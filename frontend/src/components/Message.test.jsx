import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Message from './Message';
import { AppContext } from '../contexts/AppContext';

const mockContextValue = {
    currentUser: { id: 'user-1', name: 'me' },
    handleDeleteMessage: vi.fn(),
    handleUpdateMessage: vi.fn(),
    formatTimestamp: (ts) => new Date(ts).toLocaleTimeString(),
};

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
            senderId: 'user-1',
            senderName: 'me',
            timestamp: new Date().toISOString(),
            edited: false
        };

        renderWithMessage(sentMessage);
        
        expect(screen.getByText('Hello from me')).toBeInTheDocument();

        expect(screen.getByText(/me - \d{1,2}:\d{2}:\d{2} [AP]M/)).toBeInTheDocument();
        
        expect(screen.getByLabelText('Edit message')).toBeInTheDocument();
    });

    it('renders a received message correctly', () => {
        const receivedMessage = {
            id: 'msg-2',
            text: 'Reply from you',
            senderId: 'user-2',
            senderName: 'you',
            timestamp: new Date().toISOString(),
            edited: true
        };
        
        renderWithMessage(receivedMessage);
        
        expect(screen.getByText('Reply from you')).toBeInTheDocument();

        expect(screen.getByText('(edited)')).toBeInTheDocument();

        expect(screen.queryByLabelText('Edit message')).not.toBeInTheDocument();
    });
});
