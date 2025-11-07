import Message from './Message';
import { useAppContext } from '../contexts/AppContext';
import { useEffect, useRef } from 'react';

function MessageList() {
    const { messages, currentUser, formatTimestamp } = useAppContext();
    const endOfMessagesRef = useRef(null);

    // Auto-scroll to the bottom when new messages arrive
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!messages || messages.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-text-secondary">
                No messages yet. Start the conversation!
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 h-full overflow-y-auto">
             {/* This outer div needs to be a flex container */}
            <div className="flex flex-col space-y-4">
                {messages.map((msg) => (
                    <Message
                        key={msg.id}
                        message={msg} 
                    />
                ))}
                {/* Dummy div to scroll to */}
                <div ref={endOfMessagesRef} />
            </div>
        </div>
    );
}

export default MessageList;