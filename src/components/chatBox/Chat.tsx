"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { jsPDF } from "jspdf";

export default function Chat() {
  const [chatHistory, setChatHistory] = useState<
    { user: string; bot: string; timestamp: string }[]
  >([]);

  const chatMutation = useChat();
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // ✅ Load chat history from Local Storage when component mounts
  useEffect(() => {
    const storedHistory = localStorage.getItem("chatHistory");
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
  }, []);

  // ✅ Save chat history to Local Storage when chatHistory updates
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // ✅ Function to clear chat history
  const clearChat = () => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
  };

  // ✅ Function to Download Chat as PDF
  const downloadChatAsPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    doc.text("EchoChat Conversation", 10, 10);
    doc.setLineWidth(0.5);
    doc.line(10, 12, 200, 12);

    let y = 20; // Start position
    chatHistory.forEach((chat) => {
      doc.setFontSize(10);
      doc.text(`[${chat.timestamp}] User:`, 10, y);
      doc.setFontSize(12);
      doc.text(chat.user, 20, y + 5);
      y += 10;

      doc.setFontSize(10);
      doc.text(`[${chat.timestamp}] AI:`, 10, y);
      doc.setFontSize(12);
      doc.text(chat.bot, 20, y + 5);
      y += 15;

      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("chat_history.pdf");
  };

  const handleSendMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();

    setChatHistory((prev) => [
      ...prev,
      { user: message, bot: "Thinking...", timestamp },
    ]);

    chatMutation.mutate(message, {
      onSuccess: (aiMessage) => {
        setChatHistory((prev) =>
          prev.map((chat, index) =>
            index === prev.length - 1 ? { ...chat, bot: aiMessage } : chat
          )
        );
      },
    });
  };

  // ✅ Auto-scroll to the latest message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-100 dark:bg-gray-900">
      {/* Chat Container */}
      <div className="w-full max-w-2xl h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
          <h1 className="text-lg font-semibold text-gray-700 dark:text-white">
            EchoChat
          </h1>

          {/* ✅ Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* ✅ Clear Chat Button */}
            <button
              onClick={clearChat}
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition shadow-md"
              title="Clear Chat"
            >
              🗑 {/* Trash Icon */}
            </button>

            {/* ✅ Download Chat Button */}
            <button
              onClick={downloadChatAsPDF}
              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition shadow-md"
              title="Download Chat as PDF"
            >
              📄 {/* PDF Icon */}
            </button>

            {/* ✅ Refresh Button */}
            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
              title="Refresh Page"
            >
              🔄 {/* Refresh Icon */}
            </button>

            <ThemeToggle />
          </div>
        </div>

        {/* Chat Box */}
        <div
          ref={chatBoxRef}
          className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scrollbar scrollbar-thumb-gray-500 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-800"
        >
          <AnimatePresence>
            {chatHistory.map((chat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessage
                  role="user"
                  message={chat.user}
                  timestamp={chat.timestamp}
                />
                <ChatMessage
                  role="ai"
                  message={chat.bot}
                  timestamp={chat.timestamp}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={chatMutation.isPending}
        />
      </div>
    </div>
  );
}
