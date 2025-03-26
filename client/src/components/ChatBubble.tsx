import { useState } from "react";
import { useChat } from "../context/ChatContext";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router";

const ChatBubble = () => {
  const { unreadChats, chatPetNames } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  const unreadChatList = Array.from(unreadChats);
  const unreadCount = unreadChatList.length;

  return (
    <div className="fixed bottom-4 right-4 z-555">
      <button
        className="bg-orange-500 text-white p-3 rounded-full shadow-lg relative focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <MessageCircle />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat List Popup */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-72 bg-white shadow-lg border rounded-lg p-4 z-555">
          <h3 className="text-lg font-semibold mb-2">Unread Chats</h3>
          <div className="h-40 overflow-y-auto">
            {unreadCount > 0 ? (
              unreadChatList.map((chatId) => (
                <Link
                  key={chatId}
                  to={`/chat/${chatId}?petName=${encodeURIComponent(
                    chatPetNames[chatId] || "Unknown Pet"
                  )}`} // ✅ Fixed pet name retrieval
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left p-2 border-b hover:bg-gray-100 transition"
                >
                  🟢 {chatPetNames[chatId] || "Unknown Pet"}{" "}
                  {/* ✅ Fixed pet name display */}
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center">No unread chats</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
