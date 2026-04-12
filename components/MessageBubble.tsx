import { Message } from "@/types";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1">
          CC
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm"
        } ${message.content === "" ? "animate-pulse w-16 h-8" : ""}`}
      >
        {message.content || (
          <span className="text-gray-400 italic">thinking...</span>
        )}
      </div>
    </div>
  );
}
