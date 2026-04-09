'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FarmDataChart from './FarmDataChart'
import AIInsightsPanel from './AIInsightsPanel'
import AlertsPanel from './AlertsPanel'

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

export default function Dashboard() {
  const [farmData, setFarmData] = useState<FarmData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFarmData()
  }, [])

  const fetchFarmData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/farm-data')
      if (!response.ok) throw new Error('Failed to fetch farm data')
      const data = await response.json()
      setFarmData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-32" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ukuran ternak saat ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {farmData.length > 0 ? farmData[farmData.length - 1].live_bird_count : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Update terbaru</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Berat Ternak Rata-rata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {farmData.length > 0 ? farmData[farmData.length - 1].avg_weight_kg.toFixed(2) : '-'}
              <span className="text-sm ml-1">kg</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Total ternak aktif</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Kematian ternak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">
              {farmData.reduce((sum, d) => sum + d.mortality_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Kumulatif</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Insights */}
      <Tabs defaultValue="consumption" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="consumption">Pakan Ternak & air</TabsTrigger>
          <TabsTrigger value="health">Standar Kesehatan</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="consumption" className="space-y-4">
          <FarmDataChart type="consumption" data={farmData} />
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <FarmDataChart type="health" data={farmData} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <AIInsightsPanel />
          <AlertsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
