import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import { useChat } from "../../context/ChatContext";
import TitleComponent from "../../components/shop/Admin/TitleComponent";
import PageHeader from "../../components/PageHeader";

const ChatPage = () => {
  const { adoptionId } = useParams<{ adoptionId: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const petName = searchParams.get("petName") || "Unknown Pet";
  const { messages, sendMessage, setChatId } = useChat();
  const [text, setText] = useState("");

  // Check if the URL contains "admin"
  const isAdmin = location.pathname.includes("admin");
  useEffect(() => {
    if (adoptionId) {
      console.log("Chat opened for adoptionId:", adoptionId);
      setChatId(adoptionId);
    }
  }, [adoptionId]);

  const handleSendMessage = () => {
    if (text.trim()) {
      sendMessage(text);
      setText("");
    }
    console.log(messages);
  };

  return (
    <>
      {/* Conditionally render TitleComponent only for admin */}
      {isAdmin ? (
        <TitleComponent text={`Chat for Adopting: ${petName}`} />
      ) : (
        <PageHeader text={`Chat for Adopting: ${petName}`} />
      )}

      {/* Messages */}
      <div className="p-4">
        <div className="border rounded-xl border-orange-400 p-4 h-64 overflow-y-auto bg-gray-100">
          {messages ? (
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded ${
                    msg.sender === "admin" ? "bg-blue-200" : "bg-green-200"
                  }`}
                >
                  <strong>{msg.sender}: </strong>
                  {msg.message}
                </div>
              ))}
            </>
          ) : null}
        </div>

        {/* Input */}
        <div className="mt-4 flex">
          <input
            type="text"
            className="border rounded p-2 flex-grow"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
