import Message from './Message';
import { useAppContext } from '../contexts/AppContext';
import { useEffect, useRef } from 'react';

function MessageList() {
    // --- Swapped `messages` for `filteredMessages` from the context ---
    const { filteredMessages, searchQuery } = useAppContext();
    const endOfMessagesRef = useRef(null);

    // Auto-scroll to the bottom only when the list is not being filtered
    useEffect(() => {
        if (!searchQuery) {
            endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [filteredMessages, searchQuery]);

    // Handle case where no messages exist at all
    if (!filteredMessages) {
        return <div className="h-full flex items-center justify-center text-text-secondary">Loading...</div>
    }

    // Handle case where there are no messages, OR search yields no results
    if (filteredMessages.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-text-secondary">
                {searchQuery ? `No messages found for "${searchQuery}"` : "No messages yet. Start the conversation!"}
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 h-full overflow-y-auto">
            <div className="flex flex-col space-y-4">
                {/* --- MAPPING OVER THE FILTERED LIST --- */}
                {filteredMessages.map((msg) => (
                    <Message
                        key={msg.id}
                        message={msg} 
                    />
                ))}
                <div ref={endOfMessagesRef} />
            </div>
        </div>
    );
}

export default MessageList;