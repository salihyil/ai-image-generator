Certainly! I'll update the README based on the information provided, focusing on the project structure and features without including code snippets. Here's the updated README:

# AI Image Generator

## Table of Contents
1. Introduction
2. Technologies Used
3. Getting Started
4. Project Structure
5. Key Features
6. Authentication
7. Email System
8. Styling
9. API Integration
10. Deployment

## Introduction

This project is an AI Image Generator application built with Next.js. It allows users to generate images using AI models, manage their account, and handle various authentication flows.

## Technologies Used

- Frontend: Next.js 14, React 18
- Styling: Tailwind CSS, shadcn/ui components
- Authentication: NextAuth.js
- Database: Drizzle ORM with NeonDB (Serverless Postgres)
- Email: React Email for templating
- State Management: React Hook Form, Zod for validation
- UI/UX: Lucide React for icons
- API: Stability AI for image generation
- Deployment: Vercel (with Netlify as an alternative option)

## Getting Started

1. Clone the repository
2. Install dependencies using npm, yarn, or pnpm
3. Set up environment variables
4. Run the development server
5. Open http://localhost:3000 in your browser

For detailed instructions, refer to the "Getting Started" section in the original README.md file.

## Project Structure

The project follows a typical Next.js 14 structure with the App Router:

- `app/`: Contains the main application code
  - `(auth)/`: Authentication-related pages
  - `(dashboard)/`: Dashboard and user-specific pages
  - `api/`: API routes
- `components/`: Reusable React components
- `lib/`: Utility functions and constants
- `email/`: Email templates and configurations
- `public/`: Static assets

## Key Features

1. AI Image Generation: Users can generate images using Stability AI's API
2. User Authentication: Full authentication flow including login, register, and password reset
3. Dashboard: User-specific dashboard for managing generated images and account settings
4. Responsive Design: Mobile-friendly interface using Tailwind CSS
5. Theme Toggle: Support for light and dark modes

## Authentication

The project uses NextAuth.js for authentication. It includes features such as:

- User registration
- Login with email/password
- Password reset functionality
- Email verification

## Email System

React Email is used for creating email templates. The system supports various email types, including:

- Email verification
- Password reset emails
- Welcome emails

## Styling

The project uses Tailwind CSS for styling, with custom configurations for colors, typography, and responsive design. The shadcn/ui component library is integrated for consistent UI elements.

## API Integration

The application integrates with Stability AI's API for image generation. The API route for image generation can be found in:


```1:53:app/api/generate-image/route.ts
import axios from 'axios';
import { NextResponse } from 'next/server';

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const API_HOST = 'https://api.stability.ai/v2beta';

export async function POST(req: Request) {
  try {
    const { prompt, aspect_ratio, negative_prompt, seed, style_preset, output_format } =
      await req.json();

    if (!STABILITY_API_KEY) {
      throw new Error('Missing Stability API key');
    }

    const payload: any = {
      prompt,
      output_format: output_format || 'webp',
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
        validateStatus: undefined,
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          Accept: 'image/*',
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Stability API error: ${response.status} ${response.data.toString()}`);
    }

    const imageBase64 = Buffer.from(response.data).toString('base64');
    const imageUrl = `data:image/webp;base64,${imageBase64}`;

    return NextResponse.json({ imageUrl });
  } catch (error: unknown) {
    console.error('Error generating image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
```


## Deployment

The project is primarily configured for deployment on Vercel, with additional support for Netlify. The deployment process involves:

1. Pushing code to a GitHub repository
2. Connecting the repository to the chosen deployment platform
3. Configuring environment variables
4. Deploying the application

Both Vercel and Netlify offer seamless integration with Next.js projects, ensuring optimal performance and easy updates.

## Contributing

Contributions to the project are welcome. Please feel free to submit issues or pull requests following the project's contribution guidelines.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.