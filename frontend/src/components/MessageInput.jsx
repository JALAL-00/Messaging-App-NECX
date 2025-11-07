import { useState } from "react";
import { useAppContext } from "../contexts/AppContext";

function MessageInput() {
    const { handleSendMessage } = useAppContext();
    const [text, setText] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (text.trim() === '') return;

        try {
            setError(null);
            await handleSendMessage(text);
            setText('');
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <footer className="bg-secondary p-4 md:p-6 border-t border-border">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                    <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message..." className="flex-1 bg-primary border border-border rounded-lg px-4 py-3 text-base placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-green w-full"/>
                    <button type="submit" className="bg-accent-green text-primary font-bold px-6 py-3 rounded-lg hover:bg-accent-light-green transition-colors focus:outline-none">Send</button>
                </form>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>
        </footer>
    );
}

export default MessageInput;