'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface FarmData {
  id: string
  date: string
  feed_consumed_kg: number
  water_consumed_liters: number
  mortality_count: number
  live_bird_count: number
  avg_weight_kg: number
  temperature_celsius: number
  humidity_percentage: number
}

interface Props {
  type: 'consumption' | 'health'
  data: FarmData[]
}

export default function FarmDataChart({ type, data }: Props) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No data available. Start by adding daily farm data.
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    feed: d.feed_consumed_kg,
    water: d.water_consumed_liters,
    weight: d.avg_weight_kg,
    mortality: d.mortality_count,
    temp: d.temperature_celsius,
    humidity: d.humidity_percentage,
  }))

  if (type === 'consumption') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feed & Water Consumption (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ff8c00',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#ff8c00' }}
              />
              <Legend />
              <Line type="monotone" dataKey="feed" stroke="#ff8c00" name="Feed (kg)" strokeWidth={2} />
              <Line type="monotone" dataKey="water" stroke="#ff8c00" name="Water (L)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bird Weight Trend (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ff8c00',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#ff8c00' }}
              />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#ff8c00" name="Avg Weight (kg)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Temperature & Humidity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ff8c00',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#ff8c00' }}
                />
                <Legend />
                <Line type="monotone" dataKey="temp" stroke="#ff8c00" name="Temp (°C)" strokeWidth={2} />
                <Line type="monotone" dataKey="humidity" stroke="#ff8c00" name="Humidity (%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mortality Count by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ff8c00',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#ff8c00' }}
                />
                <Bar dataKey="mortality" fill="#ff8c00" name="Mortality Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
