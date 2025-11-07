import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

// ChevronIcon component remains the same
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
);

function Header() {
    const { users, currentUser, setCurrentUser, handleCreateUser } = useAppContext();
    const [newUserName, setNewUserName] = useState('');
    const [error, setError] = useState(null);

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        if (newUserName.trim() === '') return;
        try {
            setError(null);
            await handleCreateUser(newUserName);
            setNewUserName('');
            // TODO: Add success notification
        } catch (err) {
            setError(err.message);
        }
    };
    
    // NOTE: This is a simplified dropdown. A real one would have a pop-out menu.
    // For this assessment, a simple select is fine and robust.
    const handleUserChange = (e) => {
        const selectedUser = users.find(u => u.id === e.target.value);
        setCurrentUser(selectedUser);
    }

    return (
        <header className="bg-secondary p-4 border-b border-border shadow-sm flex-shrink-0">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <h1 className="text-xl md:text-2xl font-bold text-text-primary">NECX Messaging</h1>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm text-text-secondary" htmlFor="sender-select">Sender</label>
                        <select
                            id="sender-select"
                            value={currentUser?.id || ''}
                            onChange={handleUserChange}
                            className="bg-primary border border-border rounded-md px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-accent-green"
                        >
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                    <form onSubmit={handleSubmitUser} className="flex items-center space-x-2">
                        <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Create a new user..." className="bg-primary border border-border rounded-md px-3 py-2 text-sm w-48 placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-green" />
                        <button type="submit" className="bg-accent-green text-primary font-bold px-4 py-2 rounded-md text-sm hover:bg-accent-light-green transition-colors focus:outline-none">Create</button>
                    </form>
                </div>
            </div>
             {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </header>
    );
}
export default Header;