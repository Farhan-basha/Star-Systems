import React, { useEffect, useRef } from "react";
import Header from "../Header/Header";
import ChatBody from "../ChatBody/ChatBody";
import ChatInput from "../ChatInput/ChatInput";
import DirectMessageView from "../DirectMessage/DirectMessageView";

const MainContent = ({
  currentChannel,
  currentWorkspace,
  onHeaderMenuAction,
  onUserAvatarClick,
  currentDM,
  currentDMId,
  user,
  currentMessages,
  dmMessages,
  onSendMessage,
  dmSocketRef,
  channelSocketRef,
  isVideoCallActive = false,
  setIsVideoCallActive,
}) => {
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      const timeout = setTimeout(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentMessages, dmMessages]);

  if (currentDM) {
    return (
      <div className={`main-content${isVideoCallActive ? " fullscreen" : ""}`}>
        <Header
          isDM={true}
          dmUser={currentDM.username || currentDM.name}
          workspaceName={currentWorkspace?.name || ""}
          onMenuClick={onHeaderMenuAction}
          dmSocketRef={dmSocketRef}
          channelSocketRef={channelSocketRef}
          isVideoCallActive={isVideoCallActive}
          setIsVideoCallActive={setIsVideoCallActive}
        />
        <div
          className={`chat-body-wrapper${
            isVideoCallActive ? " fullscreen" : ""
          }`}
          ref={chatBodyRef}
        >
          <ChatBody
            messages={currentMessages}
            onUserAvatarClick={onUserAvatarClick}
          />
        </div>
        <ChatInput
          onSendMessage={(text) => onSendMessage(text, null, true)}
          isVideoCallActive={isVideoCallActive}
        />
      </div>
    );
  }

  return (
    <div className={`main-content${isVideoCallActive ? " fullscreen" : ""}`}>
      <Header
        channelName={currentChannel?.name || ""}
        workspaceName={currentWorkspace?.name || ""}
        onMenuClick={onHeaderMenuAction}
        dmSocketRef={dmSocketRef}
        channelSocketRef={channelSocketRef}
        isVideoCallActive={isVideoCallActive}
        setIsVideoCallActive={setIsVideoCallActive}
      />
      <div
        className={`chat-body-wrapper${isVideoCallActive ? " fullscreen" : ""}`}
        ref={chatBodyRef}
      >
        <ChatBody
          messages={Array.isArray(currentMessages) ? currentMessages : []}
          onUserAvatarClick={onUserAvatarClick}
        />
      </div>
      <ChatInput
        onSendMessage={onSendMessage}
        isVideoCallActive={isVideoCallActive}
      />
    </div>
  );
};

export default MainContent;
