import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import { ChatIcon, CloseIcon } from './ChatIcons';

const API_URL = 'http://localhost:8000'; // The URL of your FastAPI backend

// Define the structure of a message
interface Message {
  text: string;
  type: 'user' | 'bot' | 'error';
  sources?: any[];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm an AI assistant for the Humanoid Robotics e-book. How can I help you?",
      type: 'bot',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to the bottom of the message list when new messages are added
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to the list
    const userMessage: Message = { text: inputValue, type: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Add bot response to the list
      const botMessage: Message = {
        text: data.answer,
        type: 'bot',
        sources: data.sources,
      };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Failed to fetch from RAG API:", error);
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error. Please try again later.',
        type: 'error',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <div className={styles.chatBubble} onClick={() => setIsOpen(!isOpen)} role="button" aria-label="Toggle chat">
        {isOpen ? <CloseIcon color="white" /> : <ChatIcon color="white" />}
      </div>

      <div className={`${styles.chatWindow} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h3>AI Assistant</h3>
          <button className={styles.closeButton} onClick={() => setIsOpen(false)} aria-label="Close chat">
            <CloseIcon color="white" />
          </button>
        </div>

        <div className={styles.messageList} ref={messageListRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`${styles.message} ${styles[msg.type]}`}>
              <p>{msg.text}</p>
              {msg.type === 'bot' && msg.sources && msg.sources.length > 0 && (
                 <div className={styles.source}>
                    <strong>Sources:</strong>
                    <ul>
                        {msg.sources.map((source, i) => (
                            <li key={i}>{source.metadata?.source || 'Unknown'}</li>
                        ))}
                    </ul>
                 </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className={styles.loadingSpinner}>
              <div className={`${styles.dot} ${styles.dot1}`}></div>
              <div className={`${styles.dot} ${styles.dot2}`}></div>
              <div className={`${styles.dot} ${styles.dot3}`}></div>
            </div>
          )}
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            className={styles.inputField}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            disabled={isLoading}
          />
          <button
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
