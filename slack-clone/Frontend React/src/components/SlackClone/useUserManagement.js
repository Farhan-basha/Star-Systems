import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useUserManagement = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [temporaryUsers, setTemporaryUsers] = useState([]);

  // Check if user is logged in and set user
  useEffect(() => {
    const stored = localStorage.getItem('pulseVerseUser');
    if (!stored) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(stored);
    setUser(parsed);
  }, [navigate]);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('http://localhost:8000/api/users/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        const users = data
          .filter(u => u.username !== user?.username)
          .map(u => ({
            id: u.id,
            name: u.username,
            email: u.email,
            phone: 'N/A'
          }));
        setTemporaryUsers(users);
      } catch (err) {
        console.error('Failed to load users:', err.message);
      }
    };

    if (user) fetchUsers();
  }, [user]);

  const handleUserAvatarClick = (username) => {
    const found = temporaryUsers.find(u => u.name === username) || {
      name: username,
      email: `${username}@pulseverse.com`,
      phone: 'N/A'
    };
    setSelectedUser(found);
    setShowUserProfile(true);
  };

  const toggleProfile = () => setShowProfile(prev => !prev);

  const handleSignOut = () => {
    localStorage.removeItem('pulseVerseUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return {
    user,
    showProfile,
    setShowProfile,
    showUserProfile,
    setShowUserProfile,
    selectedUser,
    setSelectedUser,
    temporaryUsers,
    toggleProfile,
    handleUserAvatarClick,
    handleSignOut
  };
};

export default useUserManagement;
