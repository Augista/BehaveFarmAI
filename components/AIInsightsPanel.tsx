'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface AIInsight {
  id: string
  insight_type: string
  title: string
  description: string
  severity: string
  action_items: string[]
  created_at: string
}

export default function AIInsightsPanel() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ai-insights')
      if (!response.ok) throw new Error('Failed to fetch insights')
      const data = await response.json()
      setInsights(data)
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateInsights = async () => {
    try {
      setGenerating(true)
      const response = await fetch('/api/ai-insights/generate', {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to generate insights')
      const newInsight = await response.json()
      setInsights(prev => [newInsight, ...prev])
    } catch (error) {
      console.error('Error generating insights:', error)
    } finally {
      setGenerating(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-l-4 border-l-red-500 text-red-900'
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-l-yellow-500 text-yellow-900'
      default:
        return 'bg-blue-50 border-l-4 border-l-blue-500 text-blue-900'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">AI-Powered Recommendations</h3>
        <Button
          onClick={handleGenerateInsights}
          disabled={generating}
          className="bg-primary hover:bg-primary/90"
        >
          {generating ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Analyzing...
            </>
          ) : (
            'Generate Insights'
          )}
        </Button>
      </div>

      {insights.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No insights yet. Click "Generate Insights" to analyze your farm data with AI.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {insights.map(insight => (
            <Card key={insight.id} className={getSeverityColor(insight.severity)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{insight.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {new Date(insight.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    insight.severity === 'critical' ? 'bg-red-200' :
                    insight.severity === 'warning' ? 'bg-yellow-200' :
                    'bg-blue-200'
                  }`}>
                    {insight.severity.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{insight.description}</p>
                {insight.action_items && insight.action_items.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-current opacity-80">
                    <p className="text-xs font-semibold mb-2">Recommended Actions:</p>
                    <ul className="space-y-1 text-sm">
                      {insight.action_items.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
