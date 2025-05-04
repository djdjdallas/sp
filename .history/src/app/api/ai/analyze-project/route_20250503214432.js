import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  const supabase = createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectData, analysisType } = await request.json();

    let prompt = "";

    switch (analysisType) {
      case "market_analysis":
        prompt = `Analyze the market potential for this side project:
          Name: ${projectData.name}
          Description: ${projectData.description}
          Stage: ${projectData.stage}
          
          Please provide:
          1. Market size estimation
          2. Competitor analysis
          3. Potential monetization strategies
          4. Target audience analysis
          5. Growth opportunities`;
        break;

      case "project_planning":
        prompt = `Create a development roadmap for this side project:
          Name: ${projectData.name}
          Description: ${projectData.description}
          Current Stage: ${projectData.stage}
          
          Please provide:
          1. Recommended next steps
          2. Technology stack suggestions
          3. Timeline estimation
          4. Key features to develop
          5. Potential challenges and solutions`;
        break;

      case "marketing_strategy":
        prompt = `Develop a marketing strategy for this side project:
          Name: ${projectData.name}
          Description: ${projectData.description}
          Website: ${projectData.live_url || "Not launched yet"}
          
          Please provide:
          1. Marketing channel recommendations
          2. Content strategy
          3. Launch plan suggestions
          4. Community building strategies
          5. Budget allocation recommendations`;
        break;

      default:
        prompt = `Provide general feedback and suggestions for this side project:
          Name: ${projectData.name}
          Description: ${projectData.description}
          Stage: ${projectData.stage}`;
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return NextResponse.json({
      analysis: response.content[0].text,
    });
  } catch (error) {
    console.error("AI Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}
