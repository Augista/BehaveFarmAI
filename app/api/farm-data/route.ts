import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('farm_data')
      .select('*')
      .order('date', { ascending: false })
      .limit(30)

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching farm data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('farm_data')
      .insert([
        {
          date: body.date,
          flock_id: 'flock-1',
          feed_consumed_kg: body.feed_consumed_kg,
          water_consumed_liters: body.water_consumed_liters,
          mortality_count: body.mortality_count,
          live_bird_count: body.live_bird_count,
          avg_weight_kg: body.avg_weight_kg,
          temperature_celsius: body.temperature_celsius,
          humidity_percentage: body.humidity_percentage,
          notes: body.notes,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error saving farm data:', error)
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}
