import React, { useRef, useEffect } from 'react';
import Header from '../Header/Header';
import ChatBody from '../ChatBody/ChatBody';
import ChatInput from '../ChatInput/ChatInput';

const DirectMessageView = ({ 
  currentDM, 
  messages = [], 
  onSendMessage, 
  onUserAvatarClick 
}) => {
  const chatBodyRef = useRef(null);

  // Scroll to latest message on update
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="main-content">
      <Header 
        dmUser={currentDM} 
        isDM={true} 
      />

      <div className="chat-body-wrapper" ref={chatBodyRef}>
        <ChatBody 
          messages={messages} 
          onUserAvatarClick={onUserAvatarClick} 
        />
      </div>

      <ChatInput 
        onSendMessage={onSendMessage} 
        currentChannel={`@${currentDM || ''}`} 
        isDM={true} 
      />
    </div>
  );
};

export default DirectMessageView;
