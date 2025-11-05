import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { taskTitle } = await request.json()

    if (!taskTitle || typeof taskTitle !== 'string') {
      return NextResponse.json(
        { error: 'Invalid task title' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert at creating detailed, actionable prompts for Claude Code (an AI coding assistant).
When given a task title, generate a comprehensive prompt that:
1. Clearly describes the feature or task to implement
2. Includes any technical requirements
3. Specifies desired technologies or libraries
4. Outlines expected functionality
5. Mentions any UI/UX considerations
6. Provides context for why this feature is needed

The prompt should be ready to copy-paste directly into Claude Code to implement the feature.
Keep the prompt concise but complete (2-4 paragraphs max).`,
        },
        {
          role: 'user',
          content: `Generate a Claude Code prompt for this task: "${taskTitle}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const prompt =
      completion.choices[0]?.message?.content ||
      'Failed to generate prompt'

    return NextResponse.json({ prompt })
  } catch (error) {
    console.error('Error generating prompt:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to generate prompt: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    )
  }
}
