'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface Alert {
  id: string
  alert_type: string
  message: string
  severity: string
  is_resolved: boolean
  created_at: string
}

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/alerts')
      if (!response.ok) throw new Error('Failed to fetch alerts')
      const data = await response.json()
      setAlerts(data)
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResolveAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_resolved: true }),
      })
      if (!response.ok) throw new Error('Failed to resolve alert')
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_resolved: true } : a))
    } catch (error) {
      console.error('Error resolving alert:', error)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '🚨'
      case 'warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  const activeAlerts = alerts.filter(a => !a.is_resolved)

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Active Alerts</span>
          {activeAlerts.length > 0 && (
            <span className="text-sm font-normal bg-red-100 text-red-800 px-3 py-1 rounded-full">
              {activeAlerts.length} active
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeAlerts.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            ✓ No active alerts. Your farm is in good condition!
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'critical'
                    ? 'bg-red-50 border-l-red-500'
                    : alert.severity === 'warning'
                    ? 'bg-yellow-50 border-l-yellow-500'
                    : 'bg-blue-50 border-l-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getSeverityIcon(alert.severity)}</span>
                      <p className="font-semibold text-sm">
                        {alert.alert_type.replace(/_/g, ' ').toUpperCase()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolveAlert(alert.id)}
                    className="ml-4"
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
