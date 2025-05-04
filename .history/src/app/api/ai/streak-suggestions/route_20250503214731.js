export async function POST(request) {
  const { streakData, projects } = await request.json();

  const prompt = `Based on this user's streak data and projects, provide personalized suggestions:
    Current streak: ${streakData.currentStreak} days
    Longest streak: ${streakData.longestStreak} days
    Active projects: ${projects.length}
    
    Please provide:
    1. Productivity tips based on their consistency
    2. Project prioritization suggestions
    3. Time management recommendations
    4. Motivation strategies for maintaining their streak`;

  // Use Claude API to generate suggestions
  // Return suggestions
}
