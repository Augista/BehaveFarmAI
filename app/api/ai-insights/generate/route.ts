import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY in .env.local')
}

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY
)


export async function POST(request: NextRequest) {
  try {
    // Fetch recent farm data for analysis
    const { data: farmData, error: fetchError } = await supabase
      .from('farm_data')
      .select('*')
      .order('date', { ascending: false })
      .limit(30)

    if (fetchError) throw fetchError

    if (!farmData || farmData.length === 0) {
      return NextResponse.json(
        { error: 'No farm data available for analysis' },
        { status: 400 }
      )
    }

    // Prepare data summary for AI analysis
    const avgFeedConsumption = (
      farmData.reduce((sum: number, d: any) => sum + (d.feed_consumed_kg || 0), 0) / farmData.length
    ).toFixed(2)
    
    const avgWaterConsumption = (
      farmData.reduce((sum: number, d: any) => sum + (d.water_consumed_liters || 0), 0) / farmData.length
    ).toFixed(2)
    
    const totalMortality = farmData.reduce((sum: number, d: any) => sum + (d.mortality_count || 0), 0)
    const avgWeight = (
      farmData.reduce((sum: number, d: any) => sum + (d.avg_weight_kg || 0), 0) / farmData.length
    ).toFixed(2)
    
    const avgTemp = (
      farmData.reduce((sum: number, d: any) => sum + (d.temperature_celsius || 0), 0) / farmData.length
    ).toFixed(1)
    
    const avgHumidity = (
      farmData.reduce((sum: number, d: any) => sum + (d.humidity_percentage || 0), 0) / farmData.length
    ).toFixed(1)

    const prompt = `You are an expert broiler chicken farm advisor. Analyze the following farm data from the last 30 days and provide insights, recommendations, and alerts.

Farm Data Summary (Last 30 days):
- Average Feed Consumption: ${avgFeedConsumption} kg/day
- Average Water Consumption: ${avgWaterConsumption} liters/day
- Total Mortality: ${totalMortality} birds
- Average Bird Weight: ${avgWeight} kg
- Average Temperature: ${avgTemp}°C
- Average Humidity: ${avgHumidity}%

Recent Daily Data:
${farmData.slice(0, 5).map(d => `Date: ${d.date}, Feed: ${d.feed_consumed_kg}kg, Water: ${d.water_consumed_liters}L, Mortality: ${d.mortality_count}, Weight: ${d.avg_weight_kg}kg, Temp: ${d.temperature_celsius}°C, Humidity: ${d.humidity_percentage}%`).join('\n')}

Please provide:
1. A brief insight title
2. A detailed analysis/description (2-3 sentences)
3. The severity level (info, warning, or critical)
4. 2-3 actionable recommendations

Format your response as JSON with this structure:
{
  "title": "string",
  "description": "string",
  "severity": "info|warning|critical",
  "actionItems": ["item1", "item2", "item3"]
}`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Parse JSON from response
    let insight
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        insight = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', responseText)
      insight = {
        title: 'Farm Analysis',
        description: responseText,
        severity: 'info',
        actionItems: []
      }
    }

    // Save insight to database
    const { data, error } = await supabase
      .from('ai_insights')
      .insert([
        {
          flock_id: 'flock-1',
          insight_type: 'recommendation',
          title: insight.title,
          description: insight.description,
          severity: insight.severity || 'info',
          action_items: insight.actionItems || [],
          data_analyzed_from: farmData[farmData.length - 1]?.date,
          data_analyzed_to: farmData[0]?.date,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}
