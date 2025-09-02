import { useEffect, useRef, useState } from "react";

const useMessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);
  const dmSocketRef = useRef(null);
  const channelSocketRef = useRef(null);
  const currentDmGroupId = useRef(null);
  const currentChannelId = useRef(null);
  const token = localStorage.getItem("accessToken");

  const fetchChannelMessages = async (channelId) => {
    try {
      const res = await fetch(
        `https://backend-7tz9.onrender.com/api/channels/${channelId}/messages/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setMessages(data);
      connectToChannelSocket(channelId);
    } catch (err) {
      console.error("Error loading channel messages:", err);
    }
  };

  const fetchDirectMessages = async (dmGroupId) => {
    try {
      const res = await fetch(
        `https://backend-7tz9.onrender.com/api/dm-groups/${dmGroupId}/messages/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setDirectMessages(data);
      connectToDMSocket(dmGroupId);
    } catch (err) {
      console.error("Error loading DM messages:", err);
    }
  };

  const connectToChannelSocket = (channelId) => {
    if (
      currentChannelId.current === channelId &&
      channelSocketRef.current?.readyState === WebSocket.OPEN
    )
      return;

    if (channelSocketRef.current) channelSocketRef.current.close();

    currentChannelId.current = channelId;
    // const socket = new WebSocket(
    //   `ws://127.0.0.1:8000/ws/chat/channel_${channelId}/?token=${token}`
    // );

    const socket = new WebSocket(
      `wss://https://backend-7tz9.onrender.com/ws/chat/channel_${channelId}/?token=${token}`
    );
    
    channelSocketRef.current = socket;

    socket.onopen = () =>
      console.log(`✅ WebSocket connected to channel ${channelId}`);
    socket.onmessage = () => fetchChannelMessages(channelId);
    socket.onerror = (err) => console.error("❌ Channel WS error:", err);
    socket.onclose = () => console.log("🔌 Channel WS closed");
  };

  const connectToDMSocket = (dmGroupId) => {
    if (
      currentDmGroupId.current === dmGroupId &&
      dmSocketRef.current?.readyState === WebSocket.OPEN
    )
      return;

    if (dmSocketRef.current) dmSocketRef.current.close();

    currentDmGroupId.current = dmGroupId;
    const socket = new WebSocket(
      `wss://https://backend-7tz9.onrender.com/ws/chat/dm_${dmGroupId}/?token=${token}`
    );
    dmSocketRef.current = socket;

    socket.onopen = () =>
      console.log(`✅ WebSocket connected to DM group ${dmGroupId}`);

    socket.onmessage = () => {
      fetchDirectMessages(dmGroupId); // Reload latest messages
    };

    socket.onerror = (error) => console.error("❌ DM WS error:", error);
    socket.onclose = () => console.log("🔌 DM WS closed");
  };

  const handleSendMessage = async (
    text,
    attachments = [],
    user,
    workspaceId,
    channelObj
  ) => {
    if ((!text.trim() && attachments.length === 0) || !channelObj?.id) return;

    const formData = new FormData();
    formData.append("content", text);
    if (attachments.length > 0) formData.append("file", attachments[0].file);

    try {
      const res = await fetch(
        `https://backend-7tz9.onrender.com/api/channels/${channelObj.id}/messages/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const newMsg = await res.json();

      if (channelSocketRef.current?.readyState === WebSocket.OPEN) {
        channelSocketRef.current.send(
          JSON.stringify({
            message: newMsg.content,
            sender: newMsg.sender?.username || "unknown",
          })
        );
      }
    } catch (err) {
      console.error("Failed to send channel message:", err);
    }
  };

  const handleSendDirectMessage = async (text, dmGroupId, attachments = []) => {
    if ((!text.trim() && attachments.length === 0) || !dmGroupId) return;

    const formData = new FormData();
    formData.append("content", text);
    if (attachments.length > 0) formData.append("file", attachments[0].file);

    try {
      const res = await fetch(
        `https://backend-7tz9.onrender.com/api/dm-groups/${dmGroupId}/messages/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      await res.json();

      if (dmSocketRef.current?.readyState === WebSocket.OPEN) {
        dmSocketRef.current.send(
          JSON.stringify({
            message: text,
            sender: "self",
          })
        );
      }

      fetchDirectMessages(dmGroupId); // 👈 ensure latest message shown
    } catch (err) {
      console.error("Failed to send DM message:", err);
    }
  };

  return {
    messages,
    directMessages,
    setMessages,
    setDirectMessages,
    fetchChannelMessages,
    fetchDirectMessages,
    handleSendMessage,
    handleSendDirectMessage,
    dmSocketRef,
    channelSocketRef,
  };
};

export default useMessagesManagement;
