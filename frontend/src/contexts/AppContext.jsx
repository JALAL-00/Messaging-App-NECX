import React, { createContext, useState, useContext, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
    getUsers, 
    createUser, 
    getMessages, 
    sendMessage, 
    deleteMessage, 
    updateMessage,
    importData 
} from '../services/api';
import { format } from 'date-fns';

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const pollIntervalRef = useRef(null);

    const showToast = useCallback((message, type = "success") => {
        setToast({ message, type });
    }, []);

    const hideToast = () => setToast(null);

    const formatTimestamp = (isoString) => {
        if (!isoString) return "";
        try {
            return format(new Date(isoString), "p");
        } catch {
            return "Invalid time";
        }
    };

    const fetchAllData = useCallback(async (isInitialLoad = false) => {
        try {
            if (isInitialLoad) setLoading(true);

            const [usersRes, messagesRes] = await Promise.all([
                getUsers(),
                getMessages()
            ]);

            const fetchedUsers = usersRes.data || [];
            const fetchedMessages = messagesRes.data || [];

            setUsers(fetchedUsers);
            setMessages(fetchedMessages);

            setCurrentUser(prev =>
                fetchedUsers.find(u => u.id === prev?.id)
                || fetchedUsers.find(u => u.name === "me")
                || fetchedUsers[0]
                || null
            );
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Could not connect to server.");
        } finally {
            if (isInitialLoad) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData(true);
    }, [fetchAllData]);

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
            await fetchAllData();
        } catch (err) {
            showToast(err.response?.data?.error || "Message send failed.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateMessage = async (id, newText) => {
        setIsSubmitting(true);
        try {
            await updateMessage(id, newText);
            await fetchAllData();
            showToast("Message updated.");
        } catch (err) {
            showToast(err.response?.data?.error || "Update failed.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteMessage = async (id) => {
        const originalMessages = messages;
        setMessages(prev => prev.filter(msg => msg.id !== id));

        try {
            await deleteMessage(id);
            showToast("Message deleted.");
        } catch (err) {
            showToast(err.response?.data?.error || "Delete failed.", "error");
            setMessages(originalMessages);
        }
    };

    const handleImportData = async (file) => {
        setIsSubmitting(true);
        try {
            const response = await importData(file);
            showToast(response.data.message || "Import successful!");

            await fetchAllData();  
        } catch (err) {
            showToast(err.response?.data?.error || "Import failed.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExportData = async () => {
        showToast("Exporting data...");

        const [usersRes, messagesRes] = await Promise.all([
            getUsers(),
            getMessages()
        ]);

        const data = { 
            users: usersRes.data, 
            messages: messagesRes.data 
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "necx-messages-backup.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const poll = () => fetchAllData(false);

        const start = () => {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = setInterval(poll, 3000);
        };

        const stop = () => clearInterval(pollIntervalRef.current);

        const handleVisibility = () => {
            if (document.hidden) stop();
            else start();
        };

        start();
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            stop();
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [fetchAllData]);

    const filteredMessages = useMemo(() => {
        if (!searchQuery.trim()) return messages;

        const q = searchQuery.toLowerCase();
        return messages.filter(msg =>
            msg.text.toLowerCase().includes(q)
            || msg.senderName?.toLowerCase().includes(q)
        );
    }, [messages, searchQuery]);

    const value = {
        users,
        messages,
        filteredMessages,
        currentUser,
        loading,
        isSubmitting,
        error,
        toast,
        hideToast,
        setCurrentUser,
        handleCreateUser,
        handleSendMessage,
        handleDeleteMessage,
        handleUpdateMessage,
        handleExportData,
        handleImportData,
        formatTimestamp,
        searchQuery,
        setSearchQuery
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
