import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Set the runtime to edge for better performance
export const runtime = 'edge';

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  // Console log to track the incoming request
  console.log('Received chat request:', messages);

  // Use streamText to get a streaming response
  const result = await streamText({
    model: openai('gpt-4-turbo'), // Initialize the model
    messages: convertToCoreMessages(messages), // Convert messages to core format
  });

  // Console log to track the API response
  console.log('Received API response');

  // Return the streaming response
  return result.toDataStreamResponse();
}