import React from "react";

const CallNotificationModal = ({
  open,
  callerName,
  onAccept,
  onDecline,
  isVideo = true,
}) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.3)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 32,
          minWidth: 320,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>
          {isVideo ? "Incoming Video Call" : "Incoming Audio Call"}
        </div>
        <div style={{ fontSize: 16, marginBottom: 24 }}>
          {callerName
            ? `${callerName} is calling you…`
            : "Someone is calling you…"}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <button
            onClick={onAccept}
            style={{
              background: "#007a5a",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 24px",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Accept
          </button>
          <button
            onClick={onDecline}
            style={{
              background: "#e01e5a",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 24px",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallNotificationModal;
