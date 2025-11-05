import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      )
    }

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-1',
      max_tokens: 500,
      system: `You are an expert at creating detailed, actionable prompts for Claude Code (an AI coding assistant).
When given a task title, generate a comprehensive prompt that:
1. Clearly describes the feature or task to implement
2. Includes any technical requirements
3. Specifies desired technologies or libraries
4. Outlines expected functionality
5. Mentions any UI/UX considerations
6. Provides context for why this feature is needed

The prompt should be ready to copy-paste directly into Claude Code to implement the feature.
Keep the prompt concise but complete (2-4 paragraphs max).`,
      messages: [
        {
          role: 'user',
          content: `Generate a Claude Code prompt for this task: "${taskTitle}"`,
        },
      ],
    })

    const prompt =
      message.content[0]?.type === 'text'
        ? message.content[0].text
        : 'Failed to generate prompt'

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
