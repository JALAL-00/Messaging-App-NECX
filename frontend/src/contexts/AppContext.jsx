import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getUsers, createUser, getMessages, sendMessage } from '../services/api';
import { format } from 'date-fns';

const AppContext = createContext();

// Custom hook to easily use our context
export const useAppContext = () => {
    return useContext(AppContext);
};

// The provider component that will wrap our app
export const AppProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null); // State for toast notifications

    // --- Utility Functions ---

    // Function to show a toast. useCallback prevents it from being recreated on every render.
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    // Function to hide the toast, passed to the Toast component.
    const hideToast = () => setToast(null);
    
    // Utility for formatting ISO timestamp to a readable format
    const formatTimestamp = (isoString) => {
        if (!isoString) return '';
        try {
            return format(new Date(isoString), 'p'); // 'p' is a locale-sensitive time format like "12:00 PM"
        } catch (error) {
            console.error("Invalid timestamp:", isoString);
            return "Invalid time";
        }
    };


    // --- Data Fetching and State Management ---

    // Fetch initial data (users and messages) when the app loads
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [usersRes, messagesRes] = await Promise.all([getUsers(), getMessages()]);

                const fetchedUsers = usersRes.data || [];
                const fetchedMessages = messagesRes.data || [];
                
                setUsers(fetchedUsers);
                setMessages(fetchedMessages);

                // Set a default user to prevent errors
                const defaultUser = fetchedUsers.find(u => u.name === 'me') || fetchedUsers[0] || null;
                setCurrentUser(defaultUser);

            } catch (err) {
                console.error("Failed to fetch initial data:", err);
                setError("Could not connect to the server. Please check your connection and refresh.");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []); // Empty dependency array means this runs once on mount


    // --- Handlers for User Actions ---

    const handleCreateUser = async (name) => {
        try {
            const response = await createUser(name);
            setUsers(prevUsers => [...prevUsers, response.data]);
            showToast(`User "${response.data.name}" created successfully!`, 'success');
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to create user";
            showToast(errorMessage, 'error');
            throw new Error(errorMessage);
        }
    };

    const handleSendMessage = async (text) => {
        if (!currentUser) {
            const errMsg = "Cannot send message: no sender selected.";
            showToast(errMsg, 'error');
            throw new Error(errMsg);
        }
        try {
            const messagePayload = {
                text: text.trim(),
                senderId: currentUser.id,
            };
            const response = await sendMessage(messagePayload);
            setMessages(prevMessages => [...prevMessages, response.data]);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to send message";
            showToast(errorMessage, 'error');
            throw new Error(errorMessage);
        }
    };

    // The value object provided to all consumer components of this context
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
        formatTimestamp
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};