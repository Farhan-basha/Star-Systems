import { useState } from 'react';

const useChannelManagement = () => {
  const [currentChannel, setCurrentChannel] = useState("general");
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showViewMembersModal, setShowViewMembersModal] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [channelRefreshTrigger, setChannelRefreshTrigger] = useState(0); // ✅ trigger for reloading channels

  const handleHeaderMenuAction = (action) => {
    switch (action) {
      case 'viewMembers':
        setShowViewMembersModal(true);
        break;
      case 'addMembers':
        setShowAddMembersModal(true);
        break;
      case 'leaveChannel':
        setShowLeaveDialog(true);
        break;
      default:
        break;
    }
  };

  const handleLeaveChannel = () => {
    if (currentChannel === 'general') {
      alert("You cannot leave the #general channel.");
      setShowLeaveDialog(false);
      return;
    }

    setCurrentChannel('general');
    alert(`You have left the #${currentChannel} channel.`);
    setShowLeaveDialog(false);
  };

  const handleAddChannel = async (channelName) => {
  if (!channelName) return;

  try {
    const response = await fetch(`https://backend-7tz9.onrender.com/api/channels/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: channelName,
        description: '',
      })
    });

    if (!response.ok) throw new Error('Failed to create channel');

    const data = await response.json();
    setCurrentChannel(data.name);
    setChannelRefreshTrigger(prev => prev + 1);  // ✅ trigger refresh
    setShowChannelModal(false);
  } catch (error) {
    console.error('Error creating channel:', error);
    alert('Channel creation failed.');
  }
};

  return {
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
  };
};

export default useChannelManagement;
