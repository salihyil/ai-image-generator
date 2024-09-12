import axios from "axios";
import { NextResponse } from "next/server";

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const API_HOST = "https://api.stability.ai/v2beta";

export async function POST(req: Request) {
  try {
    const { prompt, aspect_ratio, negative_prompt, seed, style_preset, output_format } =
      await req.json();

    if (!STABILITY_API_KEY) {
      throw new Error("Missing Stability API key");
    }

    const payload: any = {
      prompt,
      output_format: output_format || "webp",
    };

    // Add optional parameters if they are provided
    if (aspect_ratio) payload.aspect_ratio = aspect_ratio;
    if (negative_prompt) payload.negative_prompt = negative_prompt;
    if (seed) payload.seed = seed;
    if (style_preset) payload.style_preset = style_preset;

    const response = await axios.postForm(
      `${API_HOST}/stable-image/generate/ultra`,
      axios.toFormData(payload),
      {
        validateStatus: () => true, // Allow any status code
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          Accept: "image/*",
        },
      }
    );

    if (response.status !== 200) {
      let errorMessage = "Stability API error";
      const responseText = Buffer.from(response.data).toString("utf-8");

      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // If parsing fails, use the response text as is
        errorMessage = responseText.trim() || errorMessage;
      }

      console.error("Stability API Error:", {
        status: response.status,
        message: errorMessage,
        responseHeaders: response.headers,
      });

      throw new Error(`${errorMessage} (Status: ${response.status})`);
    }

    const imageBase64 = Buffer.from(response.data).toString("base64");
    const imageUrl = `data:image/${output_format || "webp"};base64,${imageBase64}`;

    return NextResponse.json({ imageUrl });
  } catch (error: unknown) {
    console.error("Error generating image:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
