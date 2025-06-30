import React, { useState, useEffect } from 'react';
import './Sidebar2.css';

const Sidebar2 = ({
  currentChannel,
  setCurrentChannel,
  activeMenuItem,
  currentWorkspace,
  currentDM,
  onDirectMessageClick,
  onAddChannel,
  onInvite,
  dmUsers,
  channelRefreshTrigger
}) => {
  const [channelList, setChannelList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/channels/')
      .then(res => res.json())
      .then(data => {
        const unique = {};
        data.forEach(ch => {
          if (!unique[ch.name]) unique[ch.name] = ch;
        });
        setChannelList(Object.values(unique));
      })
      .catch(err => console.error('Failed to fetch channels:', err));
  }, [channelRefreshTrigger]);

  const renderChannels = () => (
    <>
      <div className="sidebar2-section-header">
        Channels <span onClick={onAddChannel} className="sidebar2-action">+</span>
      </div>
      {channelList.map(channel => (
        <div
          key={channel.id}
          className={`sidebar2-item ${channel.name === currentChannel?.name ? 'active' : ''}`}
          onClick={() => setCurrentChannel(channel)}
        >
          # {channel.name}
        </div>
      ))}
    </>
  );

  const renderDirectMessages = () => (
    <>
      <div className="sidebar2-section-header">
        Direct Messages <span onClick={onInvite} className="sidebar2-action">+</span>
      </div>
      {dmUsers?.map(user => (
        <div
          key={user.id}
          className={`sidebar2-item ${user.id === currentDM?.id ? 'active' : ''}`}
          onClick={() => onDirectMessageClick(user)} // pass full user object
        >
          <span className="dm-status">●</span> {user.name || user.username}
        </div>
      ))}
    </>
  );

  return (
    <div className="sidebar2">
      {activeMenuItem === 'home' && renderChannels()}
      {activeMenuItem === 'dms' && renderDirectMessages()}
    </div>
  );
};

export default Sidebar2;
