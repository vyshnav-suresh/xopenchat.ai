"use client";

import { useForm } from "react-hook-form";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
}: ChatInputProps) {
  const { register, handleSubmit, reset } = useForm<{ message: string }>();

  const onSubmit = (data: { message: string }) => {
    onSendMessage(data.message);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 bg-gray-200 dark:bg-gray-700 rounded-b-2xl"
    >
      <div className="flex items-center space-x-2">
        <input
          {...register("message", { required: true })}
          type="text"
          className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 dark:text-white dark:bg-gray-800"
          placeholder="Type your message..."
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }
          }}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </form>
  );
}
