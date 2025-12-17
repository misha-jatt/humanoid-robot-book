import React from 'react';
import { createRoot } from 'react-dom/client';
import MinimalChatWidget from '@site/src/components/MinimalChatWidget';

export default (function () {
  if (typeof window === 'undefined') {
    return null;
  }

  // This function will be called when the DOM is ready
  const onReady = () => {
    // Create a new div element to be the root for our React component
    const chatRoot = document.createElement('div');
    chatRoot.id = 'chat-widget-root';
    document.body.appendChild(chatRoot);

    // Use the new createRoot API for React 18
    const root = createRoot(chatRoot);
    root.render(<MinimalChatWidget />);
  };

  // Wait for the DOM to be fully loaded before injecting the chat widget
  if (document.readyState === 'complete') {
    onReady();
  } else {
    window.addEventListener('load', onReady);
  }

  // We don't need to return anything for client modules
  return null;
})();
