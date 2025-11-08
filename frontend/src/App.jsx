import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import Toast from './components/Toast';
import { useAppContext } from './contexts/AppContext';

function App() {
  const { loading, error, toast, hideToast } = useAppContext();

  if (loading) {
    return (
      <div className="bg-primary min-h-screen flex items-center justify-center">
        <h1 className="text-xl text-text-secondary animate-pulse">Loading Application...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-primary min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-900 border border-red-500 rounded-lg p-6 text-center">
            <h1 className="text-xl text-white mb-2">Connection Error</h1>
            <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary text-text-primary min-h-screen flex flex-col font-sans">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
      
      <Header />

      <main className="flex-1 flex flex-col overflow-y-hidden p-4">
        <div className="max-w-4xl mx-auto h-full w-full flex flex-col">
          <MessageList />
        </div>
      </main>

      <MessageInput />
    </div>
  );
}

export default App;
