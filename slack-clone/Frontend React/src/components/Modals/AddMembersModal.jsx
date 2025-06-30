
import React, { useState } from 'react';

const AddMembersModal = ({ onClose, currentChannel }) => {
  const [email, setEmail] = useState('');
  
  const handleAddMember = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Invitation sent to ${email} to join #${currentChannel}`);
      setEmail('');
      onClose();
    }
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Add people to #{currentChannel}</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleAddMember}>
            <div className="form-group">
              <label htmlFor="add-email">Enter email address</label>
              <input
                id="add-email"
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
          <button className="btn btn-submit" onClick={handleAddMember}>Add to Channel</button>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;
