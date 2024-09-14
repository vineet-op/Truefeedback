import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(req: Request) {
    console.log("API route hit!");
    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'.";

        console.log("Sending prompt to OpenAI...");

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 400,
            stream: true,
        });

        let fullResponse = '';
        for await (const chunk of response) {
            const { choices } = chunk;
            if (choices && choices.length > 0) {
                const text = choices[0].delta?.content || "";
                fullResponse += text;
            }
        }

        console.log("Full response from OpenAI:", fullResponse);

        return NextResponse.json({ message: fullResponse });
    } catch (error) {
        console.error("Error occurred:", error);
        throw error;
    }
}
