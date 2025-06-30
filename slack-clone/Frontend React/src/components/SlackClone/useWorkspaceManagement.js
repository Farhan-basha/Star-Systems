
import { useState } from 'react';

const useWorkspaceManagement = () => {
  // Workspace states
  const [workspaces, setWorkspaces] = useState([
    { id: 1, name: 'New Workspace', initial: 'N' }
  ]);
  
  const [currentWorkspace, setCurrentWorkspace] = useState({
    id: 1, name: 'New Workspace', initial: 'N'
  });
  
  // Handle add workspace
  const handleAddWorkspace = (workspaceName, setMessages) => {
    if (!workspaceName) return;
    
    const newWorkspaceId = workspaces.length + 1;
    const newWorkspace = {
      id: newWorkspaceId,
      name: workspaceName,
      initial: workspaceName.charAt(0).toUpperCase()
    };
    
    setWorkspaces([...workspaces, newWorkspace]);
    
    // Initialize messages for the new workspace
    setMessages(prevMessages => ({
      ...prevMessages,
      [newWorkspaceId]: {
        general: [{
          id: 1,
          user: 'PulseVerse Bot',
          avatar: 'https://via.placeholder.com/40',
          text: `Welcome to the ${workspaceName} workspace!`,
          timestamp: new Date().toISOString()
        }]
      }
    }));
    
    setCurrentWorkspace(newWorkspace);
  };
  
  return {
    workspaces,
    setWorkspaces,
    currentWorkspace,
    setCurrentWorkspace,
    handleAddWorkspace
  };
};

export default useWorkspaceManagement;
