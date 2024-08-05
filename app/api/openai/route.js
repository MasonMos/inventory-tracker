import * as dotenv from "dotenv";
import { OpenAI } from "openai";
dotenv.config();

export async function POST(request) {
  const { image } = await request.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Can you tell me what the object is in this image? Only the name of the object should be included in the response. If you don't know the object, return 3 question marks.",
            },
            {
              type: "image_url",
              image_url: {
                url: image,
                detail: "low",
              },
            },
          ],
        },
      ],
    });

    console.log("OpenAI response:", response);
    return new Response(
      JSON.stringify({ response: response.choices[0].message.content })
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }));
  }
}
