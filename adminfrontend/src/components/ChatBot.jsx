import React, { useState, useEffect } from 'react';

const ChatBot = () => {

    const chatbotId = "7Oi_m4L7rjDHgPLFFxtU_"
    const [chatBubbleVisible, setChatBubbleVisible] = useState(false);

    const handleChatBubbleClick = () => setChatBubbleVisible(!chatBubbleVisible);

    useEffect(() => {
        window.addEventListener('chatbase:chatbubble:click', handleChatBubbleClick);

        return () => window.removeEventListener('chatbase:chatbubble:click', handleChatBubbleClick);
    }, [chatbotId]);

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
            <button className='text-white bg-primary px-3 py-2 font-semibold rounded-lg shadow-md'
                onClick={handleChatBubbleClick}

            >
                Ask me
            </button>
            {chatBubbleVisible && (
                <iframe
                    src={`https://www.chatbase.co/chatbot-iframe/${chatbotId}`}
                    className='drop-shadow-lg'
                    style={{ width: '350px', height: '400px', position: 'absolute', bottom: '50px', right: '20px', border: 'none' }}
                    title="Chatbot"
                />
            )}
        </div>
    );
};

export default ChatBot;
