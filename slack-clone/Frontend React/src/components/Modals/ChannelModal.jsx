
import React, { useState } from 'react';

const ChannelModal = ({ onClose, onSubmit }) => {
  const [channelName, setChannelName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!channelName.trim()) return;

  const formattedName = channelName.trim().toLowerCase().replace(/\s+/g, '-');

  try {
    const res = await fetch('http://localhost:8000/api/channels/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formattedName,
        description: '', // You can add description input later
      }),
    });

    if (res.ok) {
      onSubmit(formattedName); // Notify parent
    } else {
      console.error('Failed to create channel');
    }
  } catch (error) {
    console.error('Error creating channel:', error);
  }
};


  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Channel details</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="channel-name">Channel name</label>
              <div className="input-prefix-wrapper">
                <span className="input-prefix">#</span>
                <input
                  id="channel-name"
                  type="text"
                  className="form-control channel-input"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="e.g. subscription-bud"
                  required
                />
              </div>
            </div>
            <div className="modal-description">
              <p>Channels are where conversations happen around a topic. Use a name that is easy to find and understand.</p>
            </div>
            <div className="form-group">
              <label className="visibility-label">Visibility</label>
              <div className="radio-options">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="public"
                    name="visibility"
                    checked={!isPrivate}
                    onChange={() => setIsPrivate(false)}
                  />
                  <label htmlFor="public">
                    <strong>Public</strong> — Anyone in New Workspace
                  </label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="private"
                    name="visibility"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(true)}
                  />
                  <label htmlFor="private">
                    <strong>Private</strong> — Only specific people
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn btn-submit" onClick={handleSubmit}>Create</button>
        </div>
      </div>
      <style>{`
        .input-prefix-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }
        .input-prefix {
          padding: 8px 0 8px 12px;
          background-color: #f6f6f6;
          color: #333;
          border-right: 1px solid #ddd;
        }
        .channel-input {
          border: none;
          flex: 1;
          border-radius: 0;
        }
        .radio-options {
          margin-top: 10px;
        }
        .radio-option {
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        .radio-option input {
          margin-right: 8px;
        }
        .modal-description {
          margin-bottom: 20px;
          color: #666;
          font-size: 14px;
        }
        .visibility-label {
          font-weight: 500;
          margin-bottom: 5px;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default ChannelModal;
