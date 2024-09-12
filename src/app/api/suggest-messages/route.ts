import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {

    const res = await streamText({
        model: openai('gpt-4'),
        system: 'You are a helpful assistant.',
        prompt: "Tell me a joke",
    });

    for await (const textPart of res.textStream) {
        console.log(textPart);

    }
}