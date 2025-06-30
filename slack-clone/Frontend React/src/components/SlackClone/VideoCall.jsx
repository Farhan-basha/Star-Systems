import React, { useRef, useState, useEffect } from "react";

const VideoCall = ({ ws, username = "You", audioOnly = false }) => {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const pc = useRef(null);
  const [callActive, setCallActive] = useState(false);
  const [incoming, setIncoming] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [videoEnabled, setVideoEnabled] = useState(!audioOnly);
  const remoteStream = useRef(null);

  const iceServers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  useEffect(() => {
    if (!ws) return;
    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "webrtc_offer") {
        setIncoming(true);
        window.offer = data.offer; // Save offer for later
      } else if (data.type === "webrtc_answer") {
        await pc.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
        setStatus("In Call");
      } else if (data.type === "webrtc_ice_candidate") {
        try {
          if (pc.current) {
            await pc.current.addIceCandidate(data.candidate);
          }
          // else: ignore silently
        } catch (e) {
          console.error("ICE error", e);
        }
      } else if (data.type === "call_end") {
        // Remote user ended the call
        endCall(true);
      }
    };
    return () => {
      ws.onmessage = null;
    };
  }, [ws]);

  const startCall = async (caller = true) => {
    setCallActive(true);
    setStatus("Connecting...");
    pc.current = new window.RTCPeerConnection(iceServers);

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(
          JSON.stringify({
            type: "webrtc_ice_candidate",
            candidate: event.candidate,
          })
        );
      }
    };

    // Improved ontrack: collect all tracks into a MediaStream
    pc.current.ontrack = (event) => {
      if (!remoteStream.current) {
        remoteStream.current = new MediaStream();
      }
      remoteStream.current.addTrack(event.track);
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = remoteStream.current;
      }
    };

    pc.current.onconnectionstatechange = () => {
      console.log("PeerConnection state:", pc.current.connectionState);
    };

    const stream = await navigator.mediaDevices.getUserMedia({
      video: videoEnabled,
      audio: true,
    });
    stream.getTracks().forEach((track) => pc.current.addTrack(track, stream));
    if (localVideo.current) localVideo.current.srcObject = stream;

    if (caller) {
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      ws.send(
        JSON.stringify({
          type: "webrtc_offer",
          offer,
          callType: videoEnabled ? "video" : "audio",
        })
      );
      setStatus("Calling...");
    } else {
      await pc.current.setRemoteDescription(
        new RTCSessionDescription(window.offer)
      );
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      ws.send(JSON.stringify({ type: "webrtc_answer", answer }));
      setStatus("In Call");
      setIncoming(false);
    }
  };

  // Accepts a flag to indicate if this is a remote-triggered end
  const endCall = (remote = false) => {
    setCallActive(false);
    setStatus("Idle");
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    if (localVideo.current) localVideo.current.srcObject = null;
    if (remoteVideo.current) remoteVideo.current.srcObject = null;
    remoteStream.current = null;
    // If this user is ending, notify the other peer
    if (!remote && ws && ws.readyState === 1) {
      ws.send(JSON.stringify({ type: "call_end" }));
    }
  };

  const toggleVideo = () => {
    setVideoEnabled((prev) => {
      const enabled = !prev;
      if (localVideo.current && localVideo.current.srcObject) {
        localVideo.current.srcObject.getVideoTracks().forEach((track) => {
          track.enabled = enabled;
        });
      }
      return enabled;
    });
  };

  return (
    <div
      style={{
        border: "1px solid #e1e1e1",
        borderRadius: 8,
        padding: 16,
        background: "#fafbfc",
        maxWidth: 420,
        margin: "16px auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span style={{ fontWeight: "bold" }}>Video/Audio Call</span>
        <span style={{ color: "#888" }}>{status}</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <div>
          <video
            ref={localVideo}
            autoPlay
            muted
            playsInline
            style={{ width: 180, borderRadius: 8, background: "#222" }}
          />
          <div style={{ textAlign: "center", fontSize: 12 }}>
            {username} (You)
          </div>
        </div>
        <div>
          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            style={{ width: 180, borderRadius: 8, background: "#222" }}
          />
          <div style={{ textAlign: "center", fontSize: 12 }}>Remote</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {!callActive && !incoming && (
          <>
            <button
              onClick={() => {
                setVideoEnabled(false);
                startCall(true);
              }}
              style={{
                background: "#007a5a",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              Start Audio Call
            </button>
            <button
              onClick={() => {
                setVideoEnabled(true);
                startCall(true);
              }}
              style={{
                background: "#007a5a",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              Start Video Call
            </button>
          </>
        )}
        {incoming && !callActive && (
          <button
            onClick={() => startCall(false)}
            style={{
              background: "#007a5a",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Accept Call
          </button>
        )}
        {callActive && (
          <>
            <button
              onClick={() => endCall(false)}
              style={{
                background: "#e01e5a",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              End Call
            </button>
            <button
              onClick={toggleVideo}
              style={{
                background: videoEnabled ? "#007a5a" : "#888",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              {videoEnabled ? "Turn Video Off" : "Turn Video On"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
