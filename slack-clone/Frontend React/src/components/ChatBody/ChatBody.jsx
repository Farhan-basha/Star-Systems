import React, { useEffect, useRef } from 'react';
import './ChatBody.css';

const ChatBody = ({ messages = [], onUserAvatarClick }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const groupedMessages = messages.reduce((groups, message) => {
    if (!message.timestamp) return groups;
    try {
      const dateKey = new Date(message.timestamp).toISOString().split('T')[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(message);
    } catch (err) {
      console.error("Invalid timestamp in message:", message);
    }
    return groups;
  }, {});

  const formatDateHeader = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const getUserInitials = (name) => {
    if (typeof name !== 'string' || !name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const handleAvatarClick = (username) => {
    if (onUserAvatarClick) onUserAvatarClick(username);
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return '🖼️';
    if (type?.includes('pdf')) return '📄';
    if (type?.includes('word')) return '📝';
    if (type?.includes('excel') || type?.includes('sheet')) return '📊';
    if (type?.includes('video')) return '🎬';
    if (type?.includes('audio')) return '🎵';
    if (type?.includes('zip') || type?.includes('archive')) return '🗜️';
    return '📁';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatMessageText = (text) => {
    if (!text || typeof text !== 'string') return '';
    const html = text
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/@([a-zA-Z0-9_]+)/g, '<span class="mention">@$1</span>');
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="chat-body">
      {messages.length === 0 ? (
        <div className="no-messages">No messages yet. Start a conversation!</div>
      ) : (
        Object.keys(groupedMessages).sort().map(dateKey => (
          <div key={dateKey} className="message-group">
            <div className="date-divider">
              <hr />
              <span>{formatDateHeader(dateKey)}</span>
              <hr />
            </div>
            {groupedMessages[dateKey].map((msg) => {
              const sender = msg.sender;
              const username = typeof sender === 'string' ? sender : sender?.username || 'Unknown';
              return (
                <div key={`${msg.id}-${msg.timestamp || msg.id}`} className="message">
                  <div className="message-avatar" onClick={() => handleAvatarClick(username)}>
                    {msg.avatar?.includes('placeholder') || !msg.avatar ? (
                      <div className="avatar-initial">{getUserInitials(username)}</div>
                    ) : (
                      <img src={msg.avatar} alt={username} />
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-user">{username}</span>
                      <span className="message-timestamp">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className="message-text">{formatMessageText(msg.content)}</div>

                    {msg.attachments?.length > 0 && (
                      <div className="message-attachments">
                        {msg.attachments.map((file, index) => (
                          <div key={index} className="message-attachment">
                            {file.type?.startsWith('image/') ? (
                              <div className="image-attachment">
                                <img src={file.preview} alt="attachment" />
                                <div className="attachment-info">
                                  <span>{file.name}</span>
                                  <span>{formatFileSize(file.size)}</span>
                                </div>
                                <a href={file.preview} download={file.name} className="download-button">Download</a>
                              </div>
                            ) : file.type?.startsWith('video/') ? (
                              <div className="video-attachment">
                                <video controls>
                                  <source src={file.preview} type={file.type} />
                                  Your browser does not support video playback.
                                </video>
                                <div className="attachment-info">
                                  <span>{file.name}</span>
                                  <span>{formatFileSize(file.size)}</span>
                                </div>
                                <a href={file.preview} download={file.name} className="download-button">Download</a>
                              </div>
                            ) : (
                              <div className="file-attachment">
                                <div className="file-type">{getFileIcon(file.type)}</div>
                                <div className="file-details">
                                  <div className="file-name">{file.name}</div>
                                  <div className="file-size">{formatFileSize(file.size)}</div>
                                </div>
                                <a href={file.preview} download={file.name} className="download-button">Download</a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatBody;
