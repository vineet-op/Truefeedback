import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";



export const maxDuration = 30;

export async function POST(request: Request) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Generate Random 3 Questions or statements for a feedback app, Don't include special characters only include letters and numbers";

        const result = await model.generateContent(prompt);
        const story = result.response.text()
        console.log(result.response.text());

        return new Response(JSON.stringify(story), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });


    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
