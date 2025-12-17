import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.module.css';
import config from '@site/src/config';

const API_URL = config.apiUrl;

// --- Icon Components ---
const RobotIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2M7.5 13A2.5 2.5 0 005 15.5 2.5 2.5 0 007.5 18a2.5 2.5 0 002.5-2.5A2.5 2.5 0 007.5 13m9 0a2.5 2.5 0 00-2.5 2.5 2.5 2.5 0 002.5 2.5 2.5 2.5 0 002.5-2.5 2.5 2.5 0 00-2.5-2.5z"/>
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

// --- Helper Components ---

const SelectionPopup = ({ top, left, onAsk }) => (
  <div className={styles.selectionPopup} style={{ top, left }} onClick={onAsk}>
    <RobotIcon /> Ask AI
  </div>
);

const LoginForm = ({ onLogin, error, isLoading }) => {
    const [username, setUsername] = useState('testuser');
    const [password, setPassword] = useState('password');

    const handleSubmit = (e) => {
      e.preventDefault();
      onLogin(username, password);
    };

    return (
      <div className={styles.authArea}>
        <div className={styles.authIcon}>
          <RobotIcon />
        </div>
        <h4>Welcome to AI Assistant</h4>
        <p className={styles.authSubtext}>Log in to start chatting about Humanoid Robotics</p>
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.inputGroup}>
            <UserIcon />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputGroup}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles.inputField}
            />
          </div>
          <button type="submit" className={styles.loginButton} disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Start Chat'}
          </button>
        </form>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  };

// --- Typing Indicator Component ---
const TypingIndicator = () => (
  <div className={styles.typingIndicator}>
    <span></span>
    <span></span>
    <span></span>
  </div>
);

// --- Main Chat Widget Component ---

export default function MinimalChatWidget() {
  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auth State
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Conversation State
  const [messages, setMessages] = useState<{ text: string; type: 'user' | 'bot'; timestamp?: Date }[]>([]);

  // Text Selection State
  const [selection, setSelection] = useState<{ text: string; top: number; left: number } | null>(null);
  const popupContainerRef = useRef(document.createElement('div'));

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // --- Effects ---

  useEffect(() => {
    // This effect handles the text selection popup
    const handleMouseUp = () => {
        if (!authToken) return; // Only show popup if logged in
        const selectedText = window.getSelection()?.toString().trim();
        if (selectedText && selectedText.length > 3) {
            const range = window.getSelection()?.getRangeAt(0);
            if (range) {
              const rect = range.getBoundingClientRect();
              setSelection({
                  text: selectedText,
                  top: rect.top + window.scrollY - 40,
                  left: rect.left + window.scrollX + (rect.width / 2),
              });
            }
        } else {
            setSelection(null);
        }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [authToken]); // Rerun this effect when auth state changes

  useEffect(() => {
    const popupNode = popupContainerRef.current;
    document.body.appendChild(popupNode);
    return () => { document.body.removeChild(popupNode); };
  }, []);

  // --- Handlers ---

  const handleLogin = async (username: string, password: string) => {
    setIsLoginLoading(true);
    setAuthError(null);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Login failed. Please check your credentials.');
      }

      const data = await response.json();
      setAuthToken(data.access_token);
      setAuthError(null);
      setMessages([{
        text: "Hello! I'm your AI assistant for Humanoid Robotics. Ask me anything about ROS 2, Digital Twins, NVIDIA Isaac, or Vision-Language-Action models!",
        type: 'bot',
        timestamp: new Date()
      }]);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setAuthError('Cannot connect to server. Please ensure the backend is running on localhost:8000');
      } else {
        setAuthError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setMessages([]);
    setAuthError(null);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !authToken) return;

    const userMessage = { text, type: 'user' as const, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ query: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, {
        text: data.answer,
        type: 'bot',
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        text: "Sorry, I couldn't connect to the server. Please make sure the backend is running.",
        type: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAboutSelection = () => {
    if (selection) {
      const prompt = `Explain this concept from the documentation: "${selection.text}"`;
      setIsOpen(true);
      handleSendMessage(prompt);
      setSelection(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className={styles.widgetContainer}>
      {selection && ReactDOM.createPortal(
        <SelectionPopup top={selection.top} left={selection.left} onAsk={handleAskAboutSelection} />,
        popupContainerRef.current
      )}

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.headerIcon}>
                <RobotIcon />
              </div>
              <div className={styles.headerText}>
                <h3>AI Assistant</h3>
                <span className={styles.headerStatus}>
                  {authToken ? 'Online' : 'Please login'}
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              {authToken && (
                <button className={styles.logoutButton} onClick={handleLogout} title="Logout">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                </button>
              )}
              <button className={styles.closeButton} onClick={() => setIsOpen(false)} title="Close">
                <CloseIcon />
              </button>
            </div>
          </div>

          {!authToken ? (
            <LoginForm onLogin={handleLogin} error={authError} isLoading={isLoginLoading} />
          ) : (
            <>
              <div className={styles.messageList}>
                {messages.map((msg, index) => (
                  <div key={index} className={`${styles.messageWrapper} ${styles[msg.type]}`}>
                    {msg.type === 'bot' && (
                      <div className={styles.avatarBot}>
                        <RobotIcon />
                      </div>
                    )}
                    <div className={`${styles.message} ${styles[msg.type]}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className={`${styles.messageWrapper} ${styles.bot}`}>
                    <div className={styles.avatarBot}>
                      <RobotIcon />
                    </div>
                    <div className={`${styles.message} ${styles.bot}`}>
                      <TypingIndicator />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className={styles.inputArea}>
                <input
                  type="text"
                  className={styles.chatInput}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about humanoid robotics..."
                  disabled={isLoading}
                />
                <button
                  className={styles.sendButton}
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  title="Send message"
                >
                  <SendIcon />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <button
        className={`${styles.chatBubble} ${isOpen ? styles.chatBubbleActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <CloseIcon /> : <RobotIcon />}
      </button>
    </div>
  );
}
