interface Message {
  _id: string;
  sender: { _id: string; name: string; avatar?: string };
  content: string;
  createdAt: string;
  read: boolean;
}

interface Props {
  message: Message;
  currentUserId: string;
}

export default function ChatBubble({ message, currentUserId }: Props) {
  const isMine = message.sender._id === currentUserId || message.sender === currentUserId as any;
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
        isMine
          ? 'bg-gradient-to-r from-amber-500 to-teal-500 text-white rounded-br-sm'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'
      }`}>
        <p>{message.content}</p>
        <p className={`text-xs mt-1 ${isMine ? 'text-white/70' : 'text-gray-400'}`}>{time}</p>
      </div>
    </div>
  );
}
