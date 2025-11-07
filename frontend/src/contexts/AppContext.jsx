import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { getUsers, createUser, getMessages, sendMessage, deleteMessage, updateMessage } from '../services/api';
import { format } from 'date-fns';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    // --- STATE MANAGEMENT ---
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const pollIntervalRef = useRef(null); // Ref to hold the polling interval ID

    // --- UTILITY FUNCTIONS ---
    const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
    const hideToast = () => setToast(null);
    const formatTimestamp = (isoString) => {
        if (!isoString) return '';
        try {
            return format(new Date(isoString), 'p'); // 'p' is a flexible, locale-sensitive time format
        } catch {
            return "Invalid time";
        }
    };

    // --- INITIAL DATA FETCH ---
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [usersRes, messagesRes] = await Promise.all([getUsers(), getMessages()]);
                
                const fetchedUsers = usersRes.data || [];
                setUsers(fetchedUsers);
                setMessages(messagesRes.data || []);
                setCurrentUser(fetchedUsers.find(u => u.name === 'me') || fetchedUsers[0] || null);
            } catch (err) {
                console.error("Failed to fetch initial data:", err);
                setError("Could not connect to the server. Please check your network and try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // --- API HANDLERS ---
    const handleCreateUser = async (name) => {
        try {
            const response = await createUser(name);
            setUsers(prev => [...prev, response.data]);
            showToast(`User "${response.data.name}" created successfully!`, 'success');
        } catch (err) {
            const msg = err.response?.data?.error || "An error occurred while creating the user.";
            showToast(msg, 'error');
        }
    };

    const handleSendMessage = async (text) => {
        if (!currentUser) return showToast("Please select a sender first.", 'error');
        try {
            const response = await sendMessage({ text: text.trim(), senderId: currentUser.id });
            setMessages(prev => [...prev, response.data]);
        } catch (err) {
            const msg = err.response?.data?.error || "Could not send the message.";
            showToast(msg, 'error');
        }
    };

    const handleDeleteMessage = async (id) => {
        try {
            await deleteMessage(id);
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
            showToast("Message deleted.", 'success');
        } catch (err) {
            const msg = err.response?.data?.error || "Could not delete the message.";
            showToast(msg, 'error');
        }
    };

    // --- EDIT MESSAGE ENHANCEMENT ---
    const handleUpdateMessage = async (id, newText) => {
        try {
            const response = await updateMessage(id, newText);
            const updatedMessage = response.data;
            // Find the message in the state and replace it with the updated version
            setMessages(prevMessages => prevMessages.map(msg => 
                msg.id === id ? updatedMessage : msg
            ));
            showToast("Message updated.", 'success');
        } catch (err) {
            const msg = err.response?.data?.error || "Could not update message.";
            showToast(msg, 'error');
        }
    };


    // --- REAL-TIME POLLING LOGIC ---
    const fetchAndUpdateMessages = useCallback(async () => {
        try {
            const response = await getMessages();
            const latestMessages = response.data || [];
            // Update state only if the message list has changed to prevent needless re-renders
            setMessages(currentMessages => {
                if (JSON.stringify(currentMessages) !== JSON.stringify(latestMessages)) {
                    return latestMessages;
                }
                return currentMessages;
            });
        } catch (err) {
            console.error("Polling error:", err);
        }
    }, []);

    useEffect(() => {
        const startPolling = () => {
            clearInterval(pollIntervalRef.current);
            fetchAndUpdateMessages();
            pollIntervalRef.current = setInterval(fetchAndUpdateMessages, 3000); // Poll every 3 seconds
        };
        
        const stopPolling = () => {
            clearInterval(pollIntervalRef.current);
        };
        
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopPolling();
            } else {
                startPolling();
            }
        };
        
        startPolling();
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup to prevent memory leaks
        return () => {
            stopPolling();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchAndUpdateMessages]);

    // --- CONTEXT VALUE ---
    // This is the public API of our context, provided to all components
    const value = {
        users,
        messages,
        currentUser,
        loading,
        error,
        toast,
        hideToast,
        setCurrentUser,
        handleCreateUser,
        handleSendMessage,
        formatTimestamp,
        handleDeleteMessage,
        handleUpdateMessage // <-- Exporting the new function
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};