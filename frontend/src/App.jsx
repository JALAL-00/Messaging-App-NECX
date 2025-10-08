import { useState, useEffect } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:3001/api";

function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      console.error("Backend health check failed:", error);
      setHealthStatus({
        status: "ERROR",
        message: "Failed to connect to backend server",
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>NECX Messaging App</h1>
        <p>Personal messaging interface</p>
      </header>

      <main className="app-main">
        <div className="health-check">
          <h2>System Status</h2>
          {loading ? (
            <div className="status-loading">Checking backend connection...</div>
          ) : (
            <div
              className={`status-card ${healthStatus?.status?.toLowerCase()}`}
            >
              <div className="status-indicator">
                <span
                  className={`status-dot ${healthStatus?.status?.toLowerCase()}`}
                ></span>
                <strong>{healthStatus?.status || "UNKNOWN"}</strong>
              </div>
              <p>{healthStatus?.message}</p>
              {healthStatus?.timestamp && (
                <small>
                  Last checked:{" "}
                  {new Date(healthStatus.timestamp).toLocaleString()}
                </small>
              )}
              {healthStatus?.error && (
                <div className="error-details">
                  <strong>Error:</strong> {healthStatus.error}
                </div>
              )}
            </div>
          )}
          <button onClick={checkBackendHealth} className="refresh-btn">
            🔄 Refresh Status
          </button>
        </div>

        <div className="getting-started">
          <h2>Getting Started</h2>
          <p>This is your starting template for the NECX Messaging App.</p>
          <ul>
            <li>✅ Frontend React app is running</li>
            <li>
              {healthStatus?.status === "OK" ? "✅" : "❌"} Backend Express
              server connection
            </li>
            <li>🚀 Ready to start building your messaging features!</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
