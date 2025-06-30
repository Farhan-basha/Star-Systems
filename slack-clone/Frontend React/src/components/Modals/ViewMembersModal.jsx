
import React from 'react';

const ViewMembersModal = ({ onClose, currentChannel }) => {
  // Mock user data
  const members = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'David Johnson', email: 'david@example.com' }
  ];
  
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">#{currentChannel} members</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="members-list">
            {members.map(member => (
              <div key={member.id} className="member-item">
                <div className="member-avatar">
                  {getInitials(member.name)}
                </div>
                <div className="member-info">
                  <div className="member-name">{member.name}</div>
                  <div className="member-email">{member.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-submit" onClick={onClose}>Close</button>
        </div>
      </div>
      <style jsx>{`
        .members-list {
          max-height: 300px;
          overflow-y: auto;
        }
        .member-item {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .member-item:last-child {
          border-bottom: none;
        }
        .member-avatar {
          width: 36px;
          height: 36px;
          border-radius: 4px;
          background-color: #1264a3;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 12px;
        }
        .member-info {
          flex: 1;
        }
        .member-name {
          font-weight: 500;
        }
        .member-email {
          font-size: 12px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default ViewMembersModal;
