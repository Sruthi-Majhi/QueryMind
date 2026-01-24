import './App.css';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import { MyContextProvider } from './MyContext.jsx';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const[prompt, setPrompt] = useState("");
  const[reply, setReply] = useState(null);
  const[currThreadId, setCurrThreadId] = useState(uuidv4());
  const[prevChats, setPrevChats] = useState([]);
  const[newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const fetchThreads = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}`);
      const threads = await response.json();
      setAllThreads(threads);
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  const fetchThreadMessages = async (threadId) => {
    try {
      const response = await fetch( `${import.meta.env.VITE_BACKEND_URL}/api/thread/${threadId}`);
      const messages = await response.json();
      setPrevChats(messages);
    } catch (error) {
      console.error('Error fetching thread messages:', error);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    if (currThreadId && !newChat) {
      fetchThreadMessages(currThreadId);
    } else if (newChat) {
      setPrevChats([]);
    }
  }, [currThreadId, newChat]);

  const chatValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
    fetchThreads
  };

  return (
       <div className="main">
        <MyContextProvider chatValues={chatValues}>
          <Sidebar />
          <ChatWindow />
        </MyContextProvider>
       </div>
    )
}

export default App;