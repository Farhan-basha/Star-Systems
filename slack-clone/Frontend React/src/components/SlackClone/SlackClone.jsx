// ✅ Updated SlackClone.jsx with fetchDirectMessages after DM group creation
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Sidebar2 from "../Sidebar2/Sidebar2";
import Profile from "../Profile/Profile";
import ChannelModal from "../Modals/ChannelModal";
import InviteModal from "../Modals/InviteModal";
import ViewMembersModal from "../Modals/ViewMembersModal";
import AddMembersModal from "../Modals/AddMembersModal";
import MainContent from "./MainContent";
import UserProfileModal from "../Modals/UserProfileModal";
import LeaveChannelModal from "../Modals/LeaveChannelModal";
import useChannelManagement from "./useChannelManagement";
import useWorkspaceManagement from "./useWorkspaceManagement";
import useMessagesManagement from "./useMessagesManagement";
import useUserManagement from "./useUserManagement";
import "./SlackClone.css";

const SlackClone = () => {
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [activeMenuItem, setActiveMenuItem] = React.useState("home");
  const [currentDM, setCurrentDM] = React.useState(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  const {
    user,
    showProfile,
    setShowProfile,
    showUserProfile,
    setShowUserProfile,
    selectedUser,
    setSelectedUser,
    temporaryUsers,
    toggleProfile,
    handleUserAvatarClick,
    handleSignOut,
  } = useUserManagement();

  const {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    handleAddWorkspace,
  } = useWorkspaceManagement();

  const {
    messages,
    directMessages,
    setMessages,
    setDirectMessages,
    fetchChannelMessages,
    fetchDirectMessages,
    handleSendMessage,
    handleSendDirectMessage,
    dmSocketRef,
    channelSocketRef,
  } = useMessagesManagement();

  const {
    currentChannel,
    setCurrentChannel,
    showChannelModal,
    setShowChannelModal,
    showViewMembersModal,
    setShowViewMembersModal,
    showAddMembersModal,
    setShowAddMembersModal,
    showLeaveDialog,
    setShowLeaveDialog,
    handleHeaderMenuAction,
    handleLeaveChannel,
    handleAddChannel,
    channelRefreshTrigger,
  } = useChannelManagement();

  useEffect(() => {
    if (currentChannel?.id) fetchChannelMessages(currentChannel.id);
  }, [currentChannel]);

  useEffect(() => {
    if (currentDM?.id) fetchDirectMessages(currentDM.id);
  }, [currentDM]);

  const currentMessages = currentDM ? directMessages || [] : messages || [];

  const sendMessageWrapper = (text, attachments, isDM = false) => {
    if (isDM && currentDM) {
      handleSendDirectMessage(text, currentDM.id);
    } else {
      handleSendMessage(
        text,
        attachments,
        user,
        currentWorkspace?.id,
        currentChannel
      );
    }
  };

  const handleDirectMessageClick = async (targetUser) => {
    setCurrentChannel(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/dm-groups/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ participants: [targetUser.id] }),
      });

      const dmGroup = await res.json();

      if (res.ok) {
        setCurrentDM({
          ...dmGroup,
          username: targetUser.name || targetUser.username,
        });
      } else {
        console.error("❌ Failed to open DM:", dmGroup);
      }
    } catch (err) {
      console.error("❌ Error fetching DM group:", err);
    }
  };

  return user ? (
    <div className="slack-clone">
      <Sidebar
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        workspaces={workspaces}
        currentWorkspace={currentWorkspace}
        setCurrentWorkspace={setCurrentWorkspace}
        onProfileClick={toggleProfile}
        onAddWorkspace={(name) => handleAddWorkspace(name, setMessages)}
        user={user}
      />
      {/* Hide Sidebar2 when in video call */}
      {!isVideoCallActive && (
        <Sidebar2
          currentChannel={currentChannel}
          setCurrentChannel={(ch) => {
            setCurrentChannel(ch);
            setCurrentDM(null);
          }}
          activeMenuItem={activeMenuItem}
          currentWorkspace={currentWorkspace}
          currentDM={currentDM}
          onDirectMessageClick={handleDirectMessageClick}
          onAddChannel={() => setShowChannelModal(true)}
          onInvite={() => setShowInviteModal(true)}
          dmUsers={temporaryUsers}
          channelRefreshTrigger={channelRefreshTrigger}
        />
      )}
      <MainContent
        currentChannel={currentChannel}
        currentWorkspace={currentWorkspace}
        onHeaderMenuAction={handleHeaderMenuAction}
        onUserAvatarClick={handleUserAvatarClick}
        currentDM={currentDM}
        currentDMId={currentDM?.id}
        user={user}
        currentMessages={currentMessages}
        onSendMessage={sendMessageWrapper}
        dmSocketRef={dmSocketRef}
        channelSocketRef={channelSocketRef}
        isVideoCallActive={isVideoCallActive}
        setIsVideoCallActive={setIsVideoCallActive}
      />

      {showProfile && (
        <Profile
          user={user}
          onClose={() => setShowProfile(false)}
          onSignOut={handleSignOut}
        />
      )}

      <UserProfileModal
        user={selectedUser}
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        onMessageUser={(user) => {
          setShowUserProfile(false);
          handleDirectMessageClick(user);
        }}
      />

      {showChannelModal && (
        <ChannelModal
          onClose={() => setShowChannelModal(false)}
          onSubmit={(name, priv) =>
            handleAddChannel(name, priv, currentWorkspace.id, setMessages)
          }
        />
      )}

      {showInviteModal && (
        <InviteModal onClose={() => setShowInviteModal(false)} />
      )}

      {showViewMembersModal && (
        <ViewMembersModal
          onClose={() => setShowViewMembersModal(false)}
          currentChannel={currentChannel}
          members={[
            user?.username || user?.email?.split("@")[0] || "User",
            ...temporaryUsers.map((u) => u.name),
          ]}
        />
      )}

      {showAddMembersModal && (
        <AddMembersModal
          onClose={() => setShowAddMembersModal(false)}
          currentChannel={currentChannel}
        />
      )}

      <LeaveChannelModal
        isOpen={showLeaveDialog}
        onClose={() => setShowLeaveDialog(false)}
        onLeave={() =>
          handleLeaveChannel(
            currentChannel,
            setCurrentChannel,
            messages,
            currentWorkspace.id
          )
        }
        channelName={currentChannel}
      />
    </div>
  ) : null;
};

export default SlackClone;
