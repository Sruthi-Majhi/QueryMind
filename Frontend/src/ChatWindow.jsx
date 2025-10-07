import './ChatWindow.css';
import { MyContext } from './MyContext';
import { useContext } from 'react';
import RingLoader from 'react-spinners/RingLoader';
import Chat from './Chat';
import { useState } from 'react';
import { useEffect } from 'react';

function ChatWindow()
{
    const { prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, prevChats, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);

    const ensureThreadId = () => {
        if (!currThreadId || String(currThreadId).trim() === '') {
            const newId = `thread_${Date.now()}`;
            setCurrThreadId(newId);
            return newId;
        }
        return currThreadId;
    };

    const getReply = async () => {
        const trimmed = (prompt || '').trim();
        if (!trimmed) { return; }
        setLoading(true);

        const threadId = ensureThreadId();

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: trimmed,
                threadId,
            }),
        };

        try {
            const response = await fetch('http://localhost:8080/api/chat', options);
            const data = await response.json();
            console.log('chat reply:', data);
            if (data?.reply) setReply(data.reply);
        } catch (err) {
            console.error('chat error:', err);
        }
        setLoading(false);
    };

    useEffect(() => 
    {
        if (prompt && reply)
        {
            setPrevChats(prev => ([
                ...prev,
                { role: 'user', content: prompt },
                { role: 'assistant', content: reply }
            ]));
            if (setNewChat) { setNewChat(false); }
            setPrompt("");
        }
    }, [reply]);







    return (
       <div className='chatWindow'>
        <div className='navbar'>
           <span>QueryMind <i className="fa-solid fa-chevron-down"></i></span>
            <div className='userIconDiv'>
           <span className='userIcon'><i className="fa-solid fa-user"></i></span>
            </div>

        </div>

        <Chat />
<RingLoader color="#36d7b7" loading={loading} >
    </RingLoader>
        <div className='chatInput'>

            <div className='inputBox'>
                <input placeholder='Ask anything' value={prompt} onChange={(e)=>setPrompt(e.target.value)} onKeyDown={(e)=>{ if(e.key === 'Enter'){ e.preventDefault(); getReply(); } }}>
                
                </input>
                <div id='submit' onClick={getReply}>
                <i className="fa-solid fa-paper-plane"></i>
                </div>
            </div>
            <p className='info'>
                QueryMind can make mistakes. Check important info. See Cookie Preferences
            </p>

        </div>
        
       </div>
    )

}

export default ChatWindow;