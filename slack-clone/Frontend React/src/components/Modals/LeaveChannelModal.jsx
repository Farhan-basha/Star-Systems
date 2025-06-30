
import React from 'react';

const LeaveChannelModal = ({ isOpen, onClose, onLeave, channelName }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Leave #{channelName}</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to leave this channel? You'll need to be re-added to join again.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn btn-submit" onClick={onLeave}>Leave Channel</button>
        </div>
      </div>
    </div>
  );
};

export default LeaveChannelModal;
