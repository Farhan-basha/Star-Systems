import React, { useState, useEffect, useRef } from "react";
import { MoreHorizontal, Headphones, Mic, MicOff } from "lucide-react";
import "./Header.css";
import VideoCall from "../SlackClone/VideoCall.jsx";
import CallNotificationModal from "../Modals/CallNotificationModal.jsx";

const Header = ({
  channelName,
  workspaceName,
  onMenuClick,
  dmUser,
  isDM = false,
  dmSocketRef,
  channelSocketRef,
  isVideoCallActive = false,
  setIsVideoCallActive,
}) => {
  const [showChannelMenu, setShowChannelMenu] = useState(false);
  const [huddle, setHuddle] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callType, setCallType] = useState(null); // 'audio' | 'video'
  const [showCall, setShowCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null); // { from, type }
  const [showNotification, setShowNotification] = useState(false);
  const audioRef = useRef(null);
  const callDropdownRef = useRef(null);
  const [showCallDropdown, setShowCallDropdown] = useState(false);

  const toggleChannelMenu = () => {
    setShowChannelMenu(!showChannelMenu);
  };

  const startHuddle = async () => {
    if (huddle) {
      leaveHuddle();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioRef.current = stream;
        setHuddle({
          id: `huddle-${Date.now()}`,
          participants: [
            {
              id: "you",
              name: "You",
              isSelf: true,
              isMuted: false,
              isActive: false,
            },
          ],
          isActive: true,
        });

        setTimeout(() => {
          setHuddle((prev) => ({
            ...prev,
            participants: [
              ...prev.participants,
              {
                id: "user1",
                name: "Karthik",
                isSelf: false,
                isMuted: false,
                isActive: false,
              },
            ],
          }));
        }, 2000);

        const interval = setInterval(() => {
          setHuddle((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              participants: prev.participants.map((p) => ({
                ...p,
                isActive: Math.random() > 0.7 ? !p.isActive : p.isActive,
              })),
            };
          });
        }, 2000);

        return () => clearInterval(interval);
      } catch (err) {
        console.error("Mic error:", err);
        alert("Microphone access needed for huddle.");
      }
    }
  };

  const leaveHuddle = () => {
    if (audioRef.current) {
      audioRef.current.getTracks().forEach((track) => track.stop());
      audioRef.current = null;
    }
    setHuddle(null);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
    }
    setHuddle((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.isSelf ? { ...p, isMuted: !isMuted } : p
      ),
    }));
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Listen for incoming call signal
  useEffect(() => {
    const socket = isDM ? dmSocketRef?.current : channelSocketRef?.current;
    if (!socket) return;
    const handleIncomingCall = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      if (data.type === "incoming_call") {
        setIncomingCall(data);
        setShowNotification(true);
      }
    };
    socket.addEventListener("message", handleIncomingCall);
    return () => socket.removeEventListener("message", handleIncomingCall);
  }, [dmSocketRef, channelSocketRef, isDM]);

  const handleCallClick = (type) => {
    setCallType(type);
    setShowCall(true);
    setShowCallDropdown(false);
    if (setIsVideoCallActive) setIsVideoCallActive(true);
  };

  const handleAccept = () => {
    setShowNotification(false);
    setCallType(incomingCall.type);
    setShowCall(true);
  };
  const handleDecline = () => {
    setShowNotification(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        callDropdownRef.current &&
        !callDropdownRef.current.contains(event.target)
      ) {
        setShowCallDropdown(false);
      }
    };
    if (showCallDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCallDropdown]);

  return (
    <div className={`header${isVideoCallActive ? " fullscreen" : ""}`}>
      <div className="header-channel">
        <div className="channel-title">
          <h2>
            {isDM ? (
              <>
                <span className="dm-status">●</span> {dmUser}
              </>
            ) : (
              <>
                <span className="channel-hash">#</span> {channelName}
              </>
            )}
          </h2>
        </div>
      </div>

      <div className="header-actions">
        <button
          className={`huddle-button ${huddle ? "huddle-active" : ""}`}
          onClick={startHuddle}
          title={huddle ? "Leave Huddle" : "Start a Huddle"}
        >
          <Headphones size={18} />
          {huddle && <span className="huddle-indicator"></span>}
        </button>

        <div className="call-dropdown" ref={callDropdownRef}>
          <button
            className="call-button"
            onClick={() => setShowCallDropdown((v) => !v)}
            title="Start Call"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4Z"
                stroke="#007a5a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ marginLeft: 4 }}>Call ▾</span>
          </button>
          {showCallDropdown && (
            <div className="call-dropdown-content">
              <button onClick={() => handleCallClick("audio")}>
                Audio Call
              </button>
              <button onClick={() => handleCallClick("video")}>
                Video Call
              </button>
            </div>
          )}
        </div>
      </div>

      {huddle && (
        <div className="huddle-panel">
          <div className="huddle-header">
            <h3>Pulse Huddle</h3>
            <button className="huddle-close" onClick={leaveHuddle}>
              ×
            </button>
          </div>
          <div className="huddle-participants">
            {huddle.participants.map((participant, index) => (
              <div
                key={index}
                className={`huddle-participant ${
                  participant.isActive ? "speaking" : ""
                }`}
              >
                <div className="participant-avatar">
                  {participant.name.charAt(0)}
                </div>
                <div className="participant-name">
                  {participant.name} {participant.isSelf && "(You)"}
                </div>
                {participant.isSelf ? (
                  <button className="mute-button" onClick={toggleMute}>
                    {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                ) : (
                  <span className="status-indicator">
                    {participant.isMuted ? (
                      <MicOff size={16} />
                    ) : (
                      <Mic size={16} />
                    )}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showCall && (
        <div className="call-modal">
          <button
            className="call-modal-close"
            onClick={() => {
              setShowCall(false);
              if (setIsVideoCallActive) setIsVideoCallActive(false);
            }}
          >
            ×
          </button>
          <VideoCall
            ws={isDM ? dmSocketRef?.current : channelSocketRef?.current}
            username={isDM ? dmUser : channelName}
            audioOnly={callType === "audio"}
          />
        </div>
      )}
      {showNotification && incomingCall && (
        <CallNotificationModal
          open={showNotification}
          callerName={incomingCall.from}
          isVideo={incomingCall.type === "video"}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </div>
  );
};

export default Header;
