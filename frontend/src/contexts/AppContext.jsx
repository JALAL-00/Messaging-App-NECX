import React, { createContext, useState, useContext, useEffect, useCallback, useRef, useMemo } from 'react';
import { getUsers, createUser, getMessages, sendMessage, deleteMessage, updateMessage } from '../services/api';
import { format } from 'date-fns';

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    // --- STATE MANAGEMENT ---
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // For initial page load
    const [isSubmitting, setIsSubmitting] = useState(false); // For form actions (create, send, edit)
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const pollIntervalRef = useRef(null);

    // --- UTILITIES ---
    const showToast = useCallback((message, type = "success") => setToast({ message, type }), []);
    const hideToast = () => setToast(null);
    const formatTimestamp = (isoString) => {
        if (!isoString) return "";
        try {
            return format(new Date(isoString), "p"); // "p" is locale-sensitive time, e.g., 3:42 PM
        } catch {
            return "Invalid time";
        }
    };

    // --- CORE DATA FETCHING LOGIC ---
    const fetchAllData = useCallback(async (isInitialLoad = false) => {
        try {
            if (isInitialLoad) setLoading(true);
            const [usersRes, messagesRes] = await Promise.all([getUsers(), getMessages()]);
            const fetchedUsers = usersRes.data || [];
            const fetchedMessages = messagesRes.data || [];

            setUsers(fetchedUsers);
            setMessages(fetchedMessages);

            // Keep the current user consistent after a data refresh
            setCurrentUser(prev =>
                fetchedUsers.find(u => u.id === prev?.id) || // User still exists
                fetchedUsers.find(u => u.name === "me") ||    // Default to 'me'
                fetchedUsers[0] ||                           // Default to the first user
                null
            );
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Could not connect to the server.");
        } finally {
            if (isInitialLoad) setLoading(false);
        }
    }, []);

    // Initial load effect
    useEffect(() => {
        fetchAllData(true);
    }, [fetchAllData]);
    
    // --- API ACTION HANDLERS ---
    const handleCreateUser = async (name) => {
        setIsSubmitting(true);
        try {
            const res = await createUser(name);
            setUsers(prev => [...prev, res.data]);
            showToast(`User "${res.data.name}" created!`);
        } catch (err) {
            showToast(err.response?.data?.error || "Error creating user.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendMessage = async (text) => {
        if (!currentUser) return showToast("Select a sender first.", "error");
        setIsSubmitting(true);
        try {
            await sendMessage({ text: text.trim(), senderId: currentUser.id });
            await fetchAllData(); // Re-sync to get the new message
        } catch (err) {
            showToast(err.response?.data?.error || "Could not send message.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleUpdateMessage = async (id, newText) => {
        setIsSubmitting(true);
        try {
            await updateMessage(id, newText);
            await fetchAllData(); // Re-sync to get the edited message
            showToast("Message updated.", "success");
        } catch (err) {
            showToast(err.response?.data?.error || "Could not update message.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteMessage = async (id) => {
        // Optimistic UI update for a faster feel
        const originalMessages = messages;
        setMessages(prev => prev.filter(msg => msg.id !== id));
        try {
            await deleteMessage(id);
            showToast("Message deleted.");
        } catch (err) {
            showToast(err.response?.data?.error || "Could not delete message.", "error");
            setMessages(originalMessages); // Revert UI if the API call fails
        }
    };
    
    // --- DATA EXPORT/IMPORT ---
    const handleExportData = async () => {
        showToast("Exporting data...", "success");
        const [usersRes, messagesRes] = await Promise.all([getUsers(), getMessages()]);
        const data = { users: usersRes.data, messages: messagesRes.data };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "necx-messages-backup.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportData = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.users || !data.messages) throw new Error("Invalid file format.");
                // NOTE: A real import requires a backend endpoint. This is a demonstration.
                showToast("Data loaded. A real import requires backend support.", "success");
                setUsers(data.users);
                setMessages(data.messages);
            } catch (err) {
                showToast(err.message, "error");
            }
        };
        reader.readAsText(file);
    };

    // --- REAL-TIME POLLING ---
    useEffect(() => {
        const poll = () => fetchAllData(false); // Fetch without setting loading spinner
        const start = () => {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = setInterval(poll, 3000); // Poll every 3 seconds
        };
        const stop = () => clearInterval(pollIntervalRef.current);
        const handleVisibility = () => {
            if (document.hidden) stop(); else start();
        };
        start();
        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            stop();
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [fetchAllData]);

    // --- SEARCH FILTERING ---
    const filteredMessages = useMemo(() => {
        if (!searchQuery.trim()) return messages;
        const q = searchQuery.toLowerCase();
        return messages.filter(msg =>
            msg.text.toLowerCase().includes(q) ||
            msg.senderName?.toLowerCase().includes(q)
        );
    }, [messages, searchQuery]);

    // --- CONTEXT VALUE ---
    const value = {
        users, messages, filteredMessages, currentUser, loading, isSubmitting, error, toast, hideToast,
        setCurrentUser, handleCreateUser, handleSendMessage, handleDeleteMessage, handleUpdateMessage,
        handleExportData, handleImportData, formatTimestamp, searchQuery, setSearchQuery
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};