
import React from 'react';

const UserProfileModal = ({ user, isOpen, onClose, onMessageUser }) => {
  if (!isOpen || !user) return null;
  
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{user.name}'s Profile</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="user-profile-content">
            <div className="user-avatar-large">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h3>{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-submit" onClick={() => onMessageUser(user)}>
            Message
          </button>
          <button className="btn btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
