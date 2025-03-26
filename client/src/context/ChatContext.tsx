import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import serverAPI from "../helper/axios";
import { IRawMessageHistory } from "../types/Types";
import { useAuth } from "./AuthContext";

interface Message {
  sender: string;
  message: string;
  adoptionId: string;
}

interface ChatContextType {
  socket: Socket | null;
  messages: Message[];
  unreadChats: Set<string>;
  chatPetNames: Record<string, string>;
  sendMessage: (message: string) => void;
  setChatId: (chatId: string, petName?: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatIdState] = useState<string | null>(null);
  const [unreadChats, setUnreadChats] = useState<Set<string>>(new Set());
  const [chatPetNames, setChatPetNames] = useState<Record<string, string>>({});
  const { user } = useAuth();

  // Function to set chatId and store pet name
  const setChatId = useCallback((id: string, petName?: string) => {
    setChatIdState(id);
    if (petName) {
      setChatPetNames((prev) => ({ ...prev, [id]: petName })); // ✅ Store pet name per chat
    }
  }, []);

  // Initialize WebSocket when user is available
  useEffect(() => {
    if (!user) return;

    const newSocket = io(import.meta.env.VITE_SERVER_URL!, {
      withCredentials: true,
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
      newSocket.emit("registerUser", user._id);
    });

    newSocket.on("joinChatRoom", ({ adoptionId }) => {
      console.log(`Joining chat room: ${adoptionId}`);

      setChatIdState((prevChatId) => {
        if (prevChatId !== adoptionId) {
          newSocket.emit("joinChat", adoptionId);
          return adoptionId;
        }
        return prevChatId;
      });
    });

    newSocket.on("newUnreadChat", ({ adoptionId, petName }) => {
      console.log(`📩 New unread chat for adoption ${adoptionId} (${petName})`);

      setUnreadChats((prev) => {
        const updated = new Set(prev);
        updated.add(adoptionId);
        return updated;
      });

      setChatPetNames((prev) => ({
        ...prev,
        [adoptionId]: petName || "Unknown Pet",
      })); // ✅ Store pet name per chat
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Fetch chat history when chatId changes
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (chatId) {
        try {
          const { data } = await serverAPI.get(`/chat/${chatId}`);

          const formattedMessages: Message[] = data.map(
            (msg: IRawMessageHistory) => ({
              sender: msg.sender,
              message: msg.message,
              adoptionId: msg.adoptionId,
            })
          );
          console.log("Fetched messages:", data);
          setMessages(formattedMessages || []);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    };

    fetchChatHistory();
  }, [chatId]);

  // Send message
  const sendMessage = async (message: string) => {
    if (socket && chatId) {
      const msgData = {
        adoptionId: chatId,
        sender: user!.name,
        message: message,
      };

      console.log("Sending message:", msgData);
      setMessages((prev) => [...prev, msgData]);
      try {
        await serverAPI.post("/chat/send", msgData);
        socket.emit("sendMessage", msgData);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.error("Chat ID is missing, cannot send message");
    }
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        messages,
        sendMessage,
        setChatId,
        unreadChats,
        chatPetNames, // ✅ Fix: use correct state
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
