import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Message from './Message';
import { AppContext } from '../contexts/AppContext';

// Mock the useAppContext hook to provide controlled data for our tests
const mockContextValue = {
    currentUser: { id: 'user-1', name: 'me' },
    handleDeleteMessage: vi.fn(), // A "spy" function that tracks calls
    handleUpdateMessage: vi.fn(),
    formatTimestamp: (ts) => new Date(ts).toLocaleTimeString(),
};

// A helper function to render our component with the mock context
const renderWithMessage = (message) => {
    return render(
        <AppContext.Provider value={mockContextValue}>
            <Message message={message} />
        </AppContext.Provider>
    );
};

describe('Message Component', () => {

    it('renders a message sent by the current user correctly', () => {
        const sentMessage = {
            id: 'msg-1',
            text: 'Hello from me',
            senderId: 'user-1', // Matches currentUser.id
            senderName: 'me',
            timestamp: new Date().toISOString(),
            edited: false
        };

        renderWithMessage(sentMessage);
        
        // Check if the message text is displayed
        expect(screen.getByText('Hello from me')).toBeInTheDocument();

        // Check if the sender name and timestamp are present
        expect(screen.getByText(/me - \d{1,2}:\d{2}:\d{2} [AP]M/)).toBeInTheDocument();
        
        // For sent messages, we expect an edit button to be potentially available (even if hidden)
        expect(screen.getByLabelText('Edit message')).toBeInTheDocument();
    });

    it('renders a received message correctly', () => {
        const receivedMessage = {
            id: 'msg-2',
            text: 'Reply from you',
            senderId: 'user-2', // Does NOT match currentUser.id
            senderName: 'you',
            timestamp: new Date().toISOString(),
            edited: true
        };
        
        renderWithMessage(receivedMessage);
        
        // Check for the message text
        expect(screen.getByText('Reply from you')).toBeInTheDocument();
        
        // Check for the "(edited)" tag because edited is true
        expect(screen.getByText('(edited)')).toBeInTheDocument();

        // Edit button should NOT exist for received messages
        expect(screen.queryByLabelText('Edit message')).not.toBeInTheDocument();
    });
});