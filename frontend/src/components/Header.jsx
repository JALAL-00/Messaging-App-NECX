import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { HiCog, HiChevronDown, HiOutlineDocumentDownload, HiOutlineUpload } from 'react-icons/hi';

function Header() {
    const { 
        users, currentUser, setCurrentUser, handleCreateUser, searchQuery, 
        setSearchQuery, isSubmitting, handleExportData, handleImportData 
    } = useAppContext();

    const [newUserName, setNewUserName] = useState('');
    const [settingsOpen, setSettingsOpen] = useState(false);
    const fileInputRef = useRef(null);
    const settingsMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
                setSettingsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        if (newUserName.trim() === '' || isSubmitting) return;
        await handleCreateUser(newUserName);
        setNewUserName('');
    };
    
    const handleUserChange = (e) => {
        const selectedUser = users.find(u => u.id === e.target.value);
        setCurrentUser(selectedUser);
    };

    const onImportClick = () => {
        fileInputRef.current.click();
        setSettingsOpen(false);
    };

    const onFileSelected = (event) => {
        const file = event.target.files[0];
        if (file) handleImportData(file);
        event.target.value = null; 
    };

    return (
        <header className="bg-secondary p-4 border-b border-border shadow-sm flex-shrink-0">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <h1 className="text-xl md:text-2xl font-bold text-text-primary whitespace-nowrap">NECX Messaging</h1>
                
                <div className="flex items-center space-x-3">
                    <input type="search" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-primary border border-border rounded-md px-3 py-2 text-sm w-40 placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-green" />

                    <div className="flex items-center space-x-2">
                        <label className="text-sm text-text-secondary" htmlFor="sender-select">Sender</label>
                        <select id="sender-select" value={currentUser?.id || ''} onChange={handleUserChange} className="bg-primary border-border rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green appearance-none" style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="%239CA3AF"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>')`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em' }}>
                            {users.map(user => (<option key={user.id} value={user.id}>{user.name}</option>))}
                        </select>
                    </div>

                    <form onSubmit={handleSubmitUser} className="flex items-center">
                        <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="New user..." className="bg-primary border border-border rounded-l-md px-3 py-2 text-sm w-32 placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-green z-10" />
                        <button type="submit" disabled={isSubmitting} className="bg-accent-green text-primary font-bold px-3 py-2 rounded-r-md text-sm hover:bg-accent-light-green transition-colors focus:outline-none relative right-px disabled:opacity-60 disabled:cursor-not-allowed">
                           {isSubmitting ? '...' : 'Create'}
                        </button>
                    </form>

                    <div className="relative" ref={settingsMenuRef}>
                        <button onClick={() => setSettingsOpen(prev => !prev)} className="p-2 rounded-full hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-green">
                            <HiCog className="h-5 w-5 text-text-secondary" />
                        </button>
                        {settingsOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-primary border border-border rounded-md shadow-lg z-20">
                                <ul className="py-1">
                                    <li className="px-3 py-1 text-xs text-text-secondary uppercase">Settings</li>
                                    <li>
                                        <button onClick={handleExportData} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-text-primary hover:bg-secondary transition-colors"><HiOutlineDocumentDownload className="h-5 w-5" /> Export Data</button>
                                    </li>
                                    <li>
                                        <button onClick={onImportClick} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-text-primary hover:bg-secondary transition-colors"><HiOutlineUpload className="h-5 w-5" /> Import Data</button>
                                    </li>
                                </ul>
                            </div>
                        )}
                         <input type="file" ref={fileInputRef} onChange={onFileSelected} className="hidden" accept=".json" />
                    </div>
                </div>
            </div>
        </header>
    );
}
export default Header;
