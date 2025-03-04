import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Ensure API key exists
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Missing API key. Check .env.local" },
        { status: 500 }
      );
    }

    // Sending request to OpenRouter API
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log(response.data.choices[0].message);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error("API Error:", axiosError?.response?.data || (error as Error).message);

    return NextResponse.json(
      // @ts-expect-error Axios response data shape is not fully typed
      { error: axiosError?.response?.data?.message || "Failed to fetch response" },
      { status: axiosError?.response?.status || 500 }
    );
  }
}