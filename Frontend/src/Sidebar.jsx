import './Sidebar.css';
import blacklogo from './assets/blacklogo.png';
import { MyContext } from './MyContext';
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

function Sidebar(params) {
    const { allThreads, setCurrThreadId, setNewChat, fetchThreads, currThreadId, setPrevChats } = useContext(MyContext);

    const handleNewChat = () => {
        setCurrThreadId(uuidv4());
        setNewChat(true);
    };

    const handleThreadClick = (threadId) => {
        setCurrThreadId(threadId);
        setNewChat(false);
    };

    const handleDeleteThread = async (threadId, event) => {
        event.stopPropagation(); // Prevent triggering the thread click
        
        try {
            const response = await fetch( `${import.meta.env.VITE_BACKEND_URL}/api/thread/${threadId}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                // Refresh the thread list
                fetchThreads();
                
                // If the deleted thread was currently selected, start a new chat
                if (currThreadId === threadId) {
                    setCurrThreadId(uuidv4());
                    setNewChat(true);
                    setPrevChats([]);
                }
            } else {
                console.error('Failed to delete thread');
            }
        } catch (error) {
            console.error('Error deleting thread:', error);
        }
    };

    return (
        <section className='sidebar'>
            <button onClick={handleNewChat}>
                <img className= 'logo' src={blacklogo} alt="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className='history'>
                {allThreads.map(thread => (
                    <li key={thread.threadId} onClick={() => handleThreadClick(thread.threadId)}>
                        <span className="thread-title">{thread.threadTitle}</span>
                        <button 
                            className="delete-thread-btn" 
                            onClick={(e) => handleDeleteThread(thread.threadId, e)}
                            title="Delete conversation"
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </li>
                ))}
            </ul>

            <div className='sign'>
                <p>By Sruthi &hearts;</p>
            </div>
        </section>
        )
}
export default Sidebar;
