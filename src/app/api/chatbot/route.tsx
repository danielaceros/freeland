import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    console.log("Received prompt:", prompt);
    console.log("API Key present:", Boolean(process.env.OPENAI_API_KEY));

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("API Key is missing or not set");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
              role: "user",
              content: prompt,
          },
      ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const reply = response.data.choices[0].message.content;
    console.log("OpenAI Response:", reply);
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Error in API route:", error.message, error.response?.data || error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
