import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const API_HOST = "https://api.stability.ai/v2beta";

interface GenerateImagePayload {
  prompt: string;
  aspect_ratio?: string;
  negative_prompt?: string;
  seed?: number;
  style_preset?: string;
  output_format?: string;
}

export async function POST(req: Request) {
  try {
    if (!STABILITY_API_KEY) {
      throw new Error("Missing Stability API key");
    }

    const payload: GenerateImagePayload = await req.json();

    const { prompt, aspect_ratio, negative_prompt, seed, style_preset, output_format } = payload;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("output_format", output_format || "webp");

    if (aspect_ratio) formData.append("aspect_ratio", aspect_ratio);
    if (negative_prompt) formData.append("negative_prompt", negative_prompt);
    if (seed !== undefined) formData.append("seed", seed.toString());
    if (style_preset) formData.append("style_preset", style_preset);

    const response = await axios.post(`${API_HOST}/stable-image/generate/ultra`, formData, {
      headers: {
        Authorization: `Bearer ${STABILITY_API_KEY}`,
        Accept: "image/*",
      },
      responseType: "arraybuffer",
    });

    const imageBase64 = Buffer.from(response.data).toString("base64");
    const imageUrl = `data:image/${output_format || "webp"};base64,${imageBase64}`;
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      const errorMessage = axiosError.response?.data
        ? Buffer.from(axiosError.response.data as ArrayBuffer).toString("utf-8")
        : "Failed to generate image";

      return NextResponse.json({ error: errorMessage }, { status });
    }

    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
