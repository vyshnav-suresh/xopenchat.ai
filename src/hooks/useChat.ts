import { useMutation } from "@tanstack/react-query";

const fetchChatResponse = async (
  message: string,
  onStreamUpdate: (chunk: string) => void
): Promise<string> => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch response");
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let accumulatedText = "";

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    accumulatedText += chunk;

    try {
      const parsedData = JSON.parse(accumulatedText);
      const streamedMessage = parsedData?.choices?.[0]?.message?.content || "";
      onStreamUpdate(streamedMessage); // ✅ Real-time update
    } catch {
      // JSON parsing may fail initially; continue accumulating text
    }
  }

  // Final AI message
  const parsedData = JSON.parse(accumulatedText);
  return parsedData?.choices?.[0]?.message?.content || "No response received";
};

export function useChat() {
  return useMutation({
    mutationFn: async (message: string) => {
      return new Promise<string>((resolve) => {
        fetchChatResponse(message, (streamedMessage) => {
          resolve(streamedMessage); // ✅ Ensure response is a string
        });
      });
    },
  });
}
