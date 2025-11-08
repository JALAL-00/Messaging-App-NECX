import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

function Message({ message }) {
    const { currentUser, handleDeleteMessage, handleUpdateMessage, formatTimestamp } = useAppContext();
    const { id, text, senderName, timestamp, senderId, edited } = message;

    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(text);
    const editInputRef = useRef(null);
    
    const isSender = senderId === currentUser?.id;
    
    useEffect(() => {
        if (isEditing) {
            editInputRef.current?.focus();
            editInputRef.current?.setSelectionRange(editedText.length, editedText.length);
        }
    }, [isEditing, editedText.length]);

    const handleSave = () => {
        if (editedText.trim() && editedText.trim() !== text) {
            handleUpdateMessage(id, editedText);
        }
        setIsEditing(false);
    };
    
    const handleCancel = () => {
        setEditedText(text);
        setIsEditing(false);
    };

    const classes = {
        wrapper: isSender ? 'self-end' : 'self-start',
        bubble: isSender ? 'bg-accent-green text-primary rounded-br-none' : 'bg-secondary text-text-primary rounded-bl-none',
        timestamp: isSender ? 'text-green-200' : 'text-text-secondary',
        button: 'text-text-secondary hover:text-white',
        senderButton: 'text-green-200 hover:text-white',
    };

    return (
        <div className={`flex items-center gap-2 group ${classes.wrapper}`}>
            {isSender && (
                <div className="flex self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setIsEditing(true)} className={`p-1 rounded-full ${classes.senderButton}`} aria-label="Edit message"><EditIcon /></button>
                    <button onClick={() => handleDeleteMessage(id)} className={`p-1 rounded-full ${classes.senderButton}`} aria-label="Delete message"><TrashIcon /></button>
                </div>
            )}

            <div className={`max-w-xs md:max-w-md w-fit rounded-xl p-3 shadow-md flex flex-col ${classes.bubble}`}>
                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <textarea
                            ref={editInputRef}
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); }
                                if (e.key === 'Escape') { e.preventDefault(); handleCancel(); }
                            }}
                            className="bg-inherit text-inherit placeholder-gray-400 outline-none resize-none text-sm leading-tight"
                            rows={3}
                        />
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={handleCancel} className="text-xs font-semibold hover:underline">Cancel</button>
                            <button onClick={handleSave} className="bg-white/30 hover:bg-white/40 rounded-full p-1.5"><CheckIcon /></button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-base break-words">{text}</p>
                        <div className="flex items-center justify-end gap-2 text-xs mt-1">
                            {edited && <span className={classes.timestamp}>(edited)</span>}
                            <p className={classes.timestamp}>
                                {senderName} - {formatTimestamp(timestamp)}
                            </p>
                        </div>
                    </>
                )}
            </div>

            {!isSender && (
                <button onClick={() => handleDeleteMessage(id)} className={`self-center p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${classes.button}`} aria-label="Delete message"><TrashIcon /></button>
            )}
        </div>
    );
}

export default Message;
