
import React, { useState } from 'react';

const InviteModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  
  const handleInvite = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Invitation sent to ${email}`);
      setEmail('');
      onClose();
    }
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Invite people to PulseVerse</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleInvite}>
            <div className="form-group">
              <label htmlFor="invite-email">Enter email address</label>
              <input
                id="invite-email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn btn-submit" onClick={handleInvite}>Send Invitation</button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
