import './Chat.css';
import { MyContext } from './MyContext';
import { useContext, useState } from 'react';
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { useEffect } from 'react';


function Chat()
{
    const {newChat, prevChats} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() =>
    {

        if(!prevChats?.length) return;
        const lastMessage = prevChats[prevChats.length - 1];
        if(!lastMessage || lastMessage.role !== "assistant") return;
        const content = String(lastMessage.content || "").split(" ");

       let idx = 0;
        const interval = setInterval(() => 
        {
            setLatestReply(content.slice(0, idx + 1).join(" "));

            idx++;
            if(idx >= content.length) clearInterval(interval);

        }, 40)

        return () => clearInterval(interval);

    }, [prevChats])
    return(
        <>
        {newChat && <h1>Start a 
            new chat</h1>}
        <div className='chats'>
            {
                prevChats?.slice(0, -1).map((chat, idx) =>
                <div className={chat.role === "user" ? "userDiv": "gptDiv"} key={idx}>

{
    chat.role === "user"?<p className='userMessage'>{chat.content}</p>:
    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
}

                </div>

                )
            }

            {
                prevChats?.length > 0 && latestReply != null && 
                <div className='gptDiv' key={"typing"}>
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                    </div>
            }

        </div>
        </>
    )
}
export default Chat;