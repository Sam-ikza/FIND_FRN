import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChatBubble from '../components/ChatBubble';
import { useAuthStore } from '../store/authStore';
import { getSocket, connectSocket } from '../utils/socket';

interface Conversation {
  roomId: string;
  sender: { _id: string; name: string; avatar?: string };
  receiver: { _id: string; name: string; avatar?: string };
  content: string;
  createdAt: string;
}

interface Message {
  _id: string;
  sender: any;
  receiver: any;
  content: string;
  createdAt: string;
  read: boolean;
  roomId: string;
}

export default function ChatPage() {
  const { roomId } = useParams();
  const { authUser } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(roomId || null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!authUser?._id) return;
    connectSocket();
    const socket = getSocket();

    socket.on('receive_message', (msg: Message) => {
      if (msg.roomId === activeRoomId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    socket.on('user_typing', () => setOtherTyping(true));
    socket.on('user_stop_typing', () => setOtherTyping(false));

    axios.get(`/api/messages/conversations/${authUser._id}`)
      .then(r => setConversations(r.data))
      .catch(() => {});

    return () => {
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [authUser, activeRoomId]);

  useEffect(() => {
    if (activeRoomId) {
      const socket = getSocket();
      socket.emit('join_room', activeRoomId);
      axios.get(`/api/messages/${activeRoomId}`)
        .then(r => setMessages(r.data))
        .catch(() => {});
    }
  }, [activeRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !authUser?._id || !activeRoomId) return;
    const [id1, id2] = activeRoomId.split('_');
    const receiverId = id1 === authUser._id ? id2 : id1;
    const socket = getSocket();
    socket.emit('send_message', {
      sender: authUser._id,
      receiver: receiverId,
      content: newMessage.trim(),
      roomId: activeRoomId,
    });
    setNewMessage('');
    socket.emit('stop_typing', { roomId: activeRoomId, userId: authUser._id });
  };

  const handleTyping = (val: string) => {
    setNewMessage(val);
    if (!activeRoomId || !authUser?._id) return;
    const socket = getSocket();
    if (!typing) {
      setTyping(true);
      socket.emit('typing', { roomId: activeRoomId, userId: authUser._id });
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setTyping(false);
      socket.emit('stop_typing', { roomId: activeRoomId, userId: authUser._id });
    }, 2000);
  };

  const getConversationName = (conv: Conversation) => {
    if (!authUser) return '';
    const other = conv.sender._id === authUser._id ? conv.receiver : conv.sender;
    return other?.name || 'Unknown';
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full md:w-72 border-r border-gray-200 dark:border-gray-700 flex flex-col ${activeRoomId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-white">💬 Chats</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No conversations yet</p>
          )}
          {conversations.map((conv) => (
            <button
              key={conv.roomId}
              onClick={() => setActiveRoomId(conv.roomId)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 transition-colors ${
                activeRoomId === conv.roomId ? 'bg-amber-50 dark:bg-amber-900/20' : ''
              }`}
            >
              <p className="font-medium text-sm text-gray-800 dark:text-white truncate">{getConversationName(conv)}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{conv.content}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col ${!activeRoomId ? 'hidden md:flex' : 'flex'}`}>
        {activeRoomId ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <button onClick={() => setActiveRoomId(null)} className="md:hidden text-gray-400 hover:text-gray-600 mr-2">←</button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
                ?
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800 dark:text-white">Chat</p>
                {otherTyping && <p className="text-xs text-amber-500">typing...</p>}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {messages.map((msg) => (
                <ChatBubble key={msg._id} message={msg} currentUserId={authUser?._id || ''} />
              ))}
              {otherTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl text-sm text-gray-500">typing...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <input
                value={newMessage}
                onChange={e => handleTyping(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-teal-500 text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center text-gray-400 dark:text-gray-500">
            <div>
              <div className="text-5xl mb-3">💬</div>
              <p className="font-medium">Select a conversation</p>
              <p className="text-sm mt-1">Choose a chat from the sidebar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
