
import React, { useState } from 'react';
import { X } from 'lucide-react';
import './Profile.css';

const Profile = ({ user, onClose, onSignOut }) => {
  // Get user from localStorage if not provided as prop
  const currentUser = user || JSON.parse(localStorage.getItem('pulseVerseUser') || '{}');
  
  const [editMode, setEditMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phone || '');
  
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };
  
  const getRandomColor = () => {
    const colors = ['#2EB67D', '#ECB22E', '#E01E5A', '#36C5F0'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const handleUpdateProfile = () => {
    // Update the user info in localStorage
    const updatedUser = {
      ...currentUser,
      phone: phoneNumber
    };
    
    localStorage.setItem('pulseVerseUser', JSON.stringify(updatedUser));
    setEditMode(false);
    
    // Show confirmation
    alert('Profile updated successfully!');
  };

  const avatarColor = getRandomColor();
  const displayName = currentUser.username || currentUser.name || currentUser.email?.split('@')[0] || 'User';

  return (
    <div className="profile-sidebar">
      <div className="profile-header">
        <h2>Profile</h2>
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      
      <div className="profile-content">
        <div className="profile-avatar-section">
          <div 
            className="profile-avatar" 
            style={{ backgroundColor: avatarColor }}
          >
            {getInitials(displayName)}
          </div>
          <div className="profile-name">{displayName}</div>
          <div className="profile-status">
            <span className="status-indicator active"></span>
            <span>Active</span>
          </div>
        </div>
        
        <div className="profile-details">
          <div className="profile-section">
            <div className="section-header">Display name</div>
            <div className="section-content">{displayName}</div>
          </div>
          
          <div className="profile-section">
            <div className="section-header">Email</div>
            <div className="section-content">{currentUser.email || 'Not set'}</div>
          </div>
          
          {!editMode ? (
            <div className="profile-section">
              <div className="section-header">Phone number</div>
              <div className="section-content edit">
                <span>{phoneNumber || 'Add a phone number'}</span>
                <button className="edit-button" onClick={() => setEditMode(true)}>Edit</button>
              </div>
            </div>
          ) : (
            <div className="profile-section">
              <div className="section-header">Phone number</div>
              <div className="section-content">
                <input 
                  type="tel" 
                  className="form-control" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                />
                <div className="edit-actions">
                  <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
                  <button className="save-button" onClick={handleUpdateProfile}>Save</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="profile-footer">
        <button className="sign-out-button" onClick={onSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
