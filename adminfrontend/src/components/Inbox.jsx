import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import BroadcastMsg from "./BroadcastMsg";

const Inbox = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [activeView, setActiveView] = useState("inbox");
  const [allMessages, setAllMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [subject, setSubject] = useState("");
  const [context, setContext] = useState("");
  const [replyContext, setReplyContext] = useState("");

  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const response = await axiosPrivate.get("/messages");

        if (response.data.success) {
          setAllMessages(response.data.allMessages);
        }
      } catch (error) {
        console.log(error);
        console.log("role is ", auth.roles);
      }
    };

    getAllMessages();
  }, [axiosPrivate]);

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
  };

  const sendMessage = async () => {
    try {
      const response = await axiosPrivate.post(
        "/messages",
        { subject: subject, context: context },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("Message sent");
        setSubject("");
        setContext("");
        // Refresh the messages
        const updatedMessages = await axiosPrivate.get("/messages");
        if (updatedMessages.data.success) {
          setAllMessages(updatedMessages.data.allMessages);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReply = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const response = await axiosPrivate.post(
        "/messages/reply",
        {
          messageid: selectedMessage.messageid,
          replyContext: replyContext,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("Reply sent");
        setReplyContext("");
        // Optionally, refresh the messages to update the replied status
        const updatedMessages = await axiosPrivate.get("/messages");
        if (updatedMessages.data.success) {
          setAllMessages(updatedMessages.data.allMessages);
        }
        setSelectedMessage(null); // Deselect the message after replying
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex h-screen mt-20">
      {/* Sidebar */}

      <div
        className={`w-1/4 p-4 bg-gray-200`}
      >
        <button
          className={`w-full text-left p-3 text-xl  mb-2 ${activeView === "inbox"
            ? "bg-primary text-white"
            : "bg-white text-primary"
            } rounded`}
          onClick={() => {
            setActiveView("inbox");
            setSelectedMessage(null);
          }}
        >
          Inbox
        </button>
        <button
          className={`w-full text-left p-3 text-xl mb-2 ${activeView === "sent"
            ? "bg-primary text-white"
            : "bg-white text-primary"
            } rounded`}
          onClick={() => {
            setActiveView("sent");
            setSelectedMessage(null);
          }}
        >
          Sent
        </button>
        <button
          className={`w-full text-left p-3 text-xl mb-2  ${activeView === "compose"
            ? "bg-primary text-white"
            : "bg-white text-primary"
            } rounded`}
          onClick={() => {
            setActiveView("compose");
            setSelectedMessage(null);
          }}
        >
          Compose
        </button>
        <button
          className={`w-full text-left p-3 text-xl ${activeView === "broadcast"
            ? "bg-primary text-white"
            : "bg-white text-primary"
            } rounded`}
          onClick={() => {
            setActiveView("broadcast");
            setSelectedMessage(null);
          }}
        >
          Broadcast Message
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4 px-10">
        {activeView === "inbox" && !selectedMessage && (
          <div>

            {/* List of messages */}
            {auth.roles.includes(7788) ? (
              <ul>
                {allMessages.map((message) => (
                  <li
                    key={message.messageid}
                    className="p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleViewMessage(message)}
                  ><div>
                      <p className="font-bold">{message.sendername}</p>
                      {message.subject}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul>
                {allMessages
                  .filter((message) => message.replied === true)
                  .map((message) => (
                    <li
                      key={message.messageid}
                      className="p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleViewMessage(message)}
                    >
                      {message.subject}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}
        {activeView === "sent" && !selectedMessage && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Sent</h2>
            {/* List of sent messages */}
            <ul>
              {allMessages.map((message) => (
                <li
                  key={message.messageid}
                  className="p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleViewMessage(message)}
                > <div>
                    <p className="font-bold">{message.sendername}</p>
                    {message.subject}
                  </div>

                </li>
              ))}
            </ul>
          </div>
        )}
        {selectedMessage && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {selectedMessage.subject}
            </h2>
            <p className="mb-4">Q :{selectedMessage.context}</p>
            <p className="mb-4">A :{selectedMessage.replycontext}</p>
            <button
              className="mb-4 p-2 bg-gray-300 rounded"
              onClick={() => setSelectedMessage(null)}
            >
              Back to {activeView === "inbox" ? "Inbox" : "Sent"}
            </button>
            {auth.roles.includes(7788) && activeView === "inbox" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Reply</h3>
                <form onSubmit={handleReply} className="flex flex-col">
                  <textarea
                    onChange={(e) => setReplyContext(e.target.value)}
                    value={replyContext}
                    placeholder="Your reply"
                    className="p-2 border border-gray-300 rounded h-40 mb-2"
                  ></textarea>
                  <button
                    type="submit"
                    className="p-2 bg-primary text-white rounded"
                  >
                    Send Reply
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
        {activeView === "compose" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Compose Message</h2>
            {/* Compose form */}
            <form className="flex flex-col">
              <input
                type="text"
                placeholder="Subject"
                onChange={(e) => setSubject(e.target.value)}
                value={subject}
                className="mb-2 p-2 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Message"
                onChange={(e) => setContext(e.target.value)}
                value={context}
                className="p-2 border border-gray-300 rounded h-40"
              ></textarea>
              <button
                type="button"
                onClick={sendMessage}
                className="mt-2 p-2 bg-primary text-white rounded"
              >
                Send
              </button>
            </form>
          </div>
        )}
        {activeView === "broadcast" && (
          <BroadcastMsg />
        )}
      </div>
    </div>
  );
};
export default Inbox;
