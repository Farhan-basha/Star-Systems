import React, { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  Send,
  X,
  Share,
  AtSign,
  Bold,
  Italic,
  Code,
} from "lucide-react";
import "./ChatInput.css";
import { Textarea } from "@/components/ui/textarea";

const ChatInput = ({
  onSendMessage,
  currentChannel,
  isDM = false,
  isVideoCallActive = false,
}) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showMentionsList, setShowMentionsList] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  const commonEmojis = [
    "😊",
    "👍",
    "🎉",
    "❤️",
    "🔥",
    "👀",
    "🙌",
    "😂",
    "🤔",
    "👏",
  ];

  const users = [
    { id: 1, name: "karthik" },
    { id: 2, name: "sijin" },
    { id: 3, name: "farhan" },
    { id: 4, name: "David Johnson" },
    { id: 5, name: "Sarah Williams" },
  ];

  const channels = ["general", "random", "development", "marketing"];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDraggingOver(true);
    };

    const handleDragLeave = () => setIsDraggingOver(false);
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDraggingOver(false);
      if (e.dataTransfer.files?.length) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    };

    dropArea.addEventListener("dragover", handleDragOver);
    dropArea.addEventListener("dragleave", handleDragLeave);
    dropArea.addEventListener("drop", handleDrop);

    return () => {
      dropArea.removeEventListener("dragover", handleDragOver);
      dropArea.removeEventListener("dragleave", handleDragLeave);
      dropArea.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage("");
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleFiles = (files) => {
    const validFiles = [];
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }
      const preview = URL.createObjectURL(file);
      validFiles.push({
        file,
        preview,
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }
    setAttachments([...attachments, ...validFiles]);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          insertFormatting("*");
          break;
        case "i":
          e.preventDefault();
          insertFormatting("_");
          break;
        case "k":
          e.preventDefault();
          insertFormatting("`");
          break;
        default:
          break;
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    setShowEmojiPicker(/:[\w]*$/.test(value));
    const lastWord = value.split(" ").pop();
    if (lastWord.startsWith("@")) {
      setMentionQuery(lastWord.substring(1).toLowerCase());
      setShowMentionsList(true);
    } else {
      setShowMentionsList(false);
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    URL.revokeObjectURL(newAttachments[index].preview);
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleMentionClick = (user) => {
    const words = message.split(" ");
    words[words.length - 1] = `@${user.name}`;
    setMessage(words.join(" ") + " ");
    setShowMentionsList(false);
    textareaRef.current.focus();
  };

  const handleEmojiClick = (emoji) => {
    const cursorPosition = textareaRef.current.selectionStart;
    const before = message.substring(0, cursorPosition);
    const after = message.substring(cursorPosition);
    const colonIndex = before.lastIndexOf(":");
    const newMessage =
      colonIndex !== -1
        ? before.substring(0, colonIndex) + emoji + after
        : message + emoji;
    setMessage(newMessage);
    setShowEmojiPicker(false);
    textareaRef.current.focus();
  };

  const insertFormatting = (marker) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = message.substring(start, end);
    const formatted =
      message.substring(0, start) +
      marker +
      selected +
      marker +
      message.substring(end);
    setMessage(formatted);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + marker.length, end + marker.length);
    }, 0);
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type.includes("pdf")) return "📄";
    if (type.includes("word")) return "📝";
    if (type.includes("excel") || type.includes("sheet")) return "📊";
    if (type.includes("video")) return "🎬";
    if (type.includes("audio")) return "🎵";
    if (type.includes("zip") || type.includes("archive")) return "🗜️";
    return "📁";
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  return (
    <div className="chat-input">
      <div
        ref={dropAreaRef}
        className={`drop-area ${isDraggingOver ? "dragging-over" : ""}`}
      >
        {isDraggingOver && (
          <div className="drop-overlay">
            <Paperclip size={32} />
            <span>Drop files here</span>
          </div>
        )}

        <form
          className={`chat-input${isVideoCallActive ? " fullscreen" : ""}`}
          onSubmit={handleSubmit}
          ref={dropAreaRef}
        >
          <div className="input-container">
            {attachments.length > 0 && (
              <div className="attachments-preview">
                {attachments.map((a, i) => (
                  <div key={i} className="attachment">
                    {a.type.startsWith("image/") ? (
                      <img src={a.preview} alt={a.name} />
                    ) : a.type.startsWith("video/") ? (
                      <video controls>
                        <source src={a.preview} type={a.type} />
                      </video>
                    ) : (
                      <div className="file-icon">
                        <span>{getFileIcon(a.type)}</span>
                        <span className="file-name">{a.name}</span>
                        <span className="file-size">
                          {formatFileSize(a.size)}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="remove-attachment"
                      onClick={() => removeAttachment(i)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="formatting-toolbar">
              <button
                type="button"
                className="format-button"
                onClick={() => insertFormatting("*")}
                title="Bold (Ctrl+B)"
              >
                <Bold size={16} />
              </button>
              <button
                type="button"
                className="format-button"
                onClick={() => insertFormatting("_")}
                title="Italic (Ctrl+I)"
              >
                <Italic size={16} />
              </button>
              <button
                type="button"
                className="format-button"
                onClick={() => insertFormatting("`")}
                title="Code (Ctrl+K)"
              >
                <Code size={16} />
              </button>
              <button
                type="button"
                className="format-button"
                onClick={() => setShowMentionsList(true)}
                title="Mention"
              >
                <AtSign size={16} />
              </button>
            </div>

            <div className="message-input-wrapper">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  isDM
                    ? `Message ${currentChannel?.name || ""}`
                    : `Message #${currentChannel?.name || ""}`
                }
                className="message-input"
                rows={1}
              />

              {showMentionsList && filteredUsers.length > 0 && (
                <div className="mentions-list">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="mention-item"
                      onClick={() => handleMentionClick(user)}
                    >
                      <div className="mention-avatar">
                        {user.name.charAt(0)}
                      </div>
                      <div className="mention-name">{user.name}</div>
                    </div>
                  ))}
                </div>
              )}

              {showEmojiPicker && (
                <div className="emoji-picker">
                  {commonEmojis.map((emoji, i) => (
                    <button
                      key={i}
                      type="button"
                      className="emoji-button"
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="input-actions">
              <button
                type="button"
                className="attach-button"
                onClick={() => fileInputRef.current.click()}
                title="Attach files"
              >
                <Paperclip size={20} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {(message.trim() || attachments.length > 0) && (
                <button
                  type="submit"
                  className="send-button"
                  title="Send message"
                >
                  <Send size={20} />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
