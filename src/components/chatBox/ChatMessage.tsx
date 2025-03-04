import Image from 'next/image';

interface ChatMessageProps {
  role: "user" | "ai";
  message: string;
  timestamp: string;
}

export default function ChatMessage({
  role,
  message,
  timestamp,
}: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        role === "user" ? "justify-end" : "justify-start"
      } my-1 items-end`}
    >
      {/* AI Avatar */}
      {role === "ai" && (
        <Image
          src="/ai-avatar.png"
          alt="AI"
          width={32}
          height={32}
          className="rounded-full mr-2 self-start"
        />
      )}

      {/* Message Bubble */}
      <div
        className={`p-4 max-w-xs md:max-w-sm lg:max-w-md rounded-lg shadow-lg ${
          role === "user"
            ? "bg-blue-500 text-white self-end rounded-tr-none hover:shadow-xl"
            : "bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 self-start rounded-tl-none hover:shadow-lg"
        } transition-all duration-200`}
      >
        <p className="text-sm break-words">{message}</p>
        <span className="text-xs text-gray-400 dark:text-white block mt-1 text-right italic">
          {timestamp}
        </span>
      </div>

      {role === "user" && (
        <Image
          src="/user-avatar.png"
          alt="User"
          width={32}
          height={32}
          className="rounded-full ml-2 self-start"
        />
      )}
    </div>
  );
}
