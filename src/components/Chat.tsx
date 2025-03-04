"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const [chatHistory, setChatHistory] = useState<
    { user: string; bot: string }[]
  >([]);
  const chatMutation = useChat();
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<{ message: string }>();

  const onSubmit = async (data: { message: string }) => {
    const userMessage = data.message;
    reset(); // Clears the input field

    setChatHistory((prev) => [
      ...prev,
      { user: userMessage, bot: "Thinking..." },
    ]);

    chatMutation.mutate(userMessage, {
      onSuccess: (response: string) => {
        const parsedResponse: { choices?: { message?: { content: string } }[] } = JSON.parse(response);
        const aiResponse =
          parsedResponse.choices?.[0]?.message?.content || "No response received";
        // const aiResponse =
        //   response.choices?.[0]?.message?.content || "No response received";
        setChatHistory((prev) => [
          ...prev.slice(0, -1),
          { user: userMessage, bot: aiResponse },
        ]);
      },
    });
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div
        ref={chatBoxRef}
        className="h-64 overflow-y-auto border p-3 rounded space-y-2"
      >
        <AnimatePresence>
          {chatHistory.map((chat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-3"
            >
              <p className="text-blue-600 font-semibold">User: {chat.user}</p>
              <div className="text-green-600 font-semibold">
                <span>AI: </span>
                {chat.bot === "Thinking..." ? <Loader /> : chat.bot}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex mt-3">
        <input
          {...register("message", { required: true })}
          type="text"
          className="flex-1 p-2 border rounded-l focus:outline-none"
          placeholder="Type your message..."
          disabled={isSubmitting}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isSubmitting) {
              e.preventDefault(); // Prevents new line
              handleSubmit(onSubmit)();
            }
          }}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

// Loader Component
const Loader = () => {
  return (
    <motion.div
      className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin inline-block"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 0.8 }}
    />
  );
};
