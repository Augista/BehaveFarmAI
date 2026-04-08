'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

interface FormData {
  date: string
  feed_consumed_kg: string
  water_consumed_liters: string
  mortality_count: string
  live_bird_count: string
  avg_weight_kg: string
  temperature_celsius: string
  humidity_percentage: string
  notes: string
}

interface Props {
  onSubmit?: () => void
}

export default function DataInputForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0],
    feed_consumed_kg: '',
    water_consumed_liters: '',
    mortality_count: '0',
    live_bird_count: '',
    avg_weight_kg: '',
    temperature_celsius: '',
    humidity_percentage: '',
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/farm-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          feed_consumed_kg: parseFloat(formData.feed_consumed_kg) || 0,
          water_consumed_liters: parseFloat(formData.water_consumed_liters) || 0,
          mortality_count: parseInt(formData.mortality_count) || 0,
          live_bird_count: parseInt(formData.live_bird_count) || 0,
          avg_weight_kg: parseFloat(formData.avg_weight_kg) || 0,
          temperature_celsius: parseFloat(formData.temperature_celsius) || 0,
          humidity_percentage: parseFloat(formData.humidity_percentage) || 0,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save data')
      }

      setMessage({
        type: 'success',
        text: 'Farm data saved successfully!',
      })

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        feed_consumed_kg: '',
        water_consumed_liters: '',
        mortality_count: '0',
        live_bird_count: '',
        avg_weight_kg: '',
        temperature_celsius: '',
        humidity_percentage: '',
        notes: '',
      })

      // Call onSubmit callback
      onSubmit?.()
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Basic Info */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Date</label>
        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="bg-input border-border"
        />
      </div>

      {/* Feed & Water */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Feed Consumed (kg)</label>
          <Input
            type="number"
            step="0.01"
            name="feed_consumed_kg"
            value={formData.feed_consumed_kg}
            onChange={handleChange}
            placeholder="0.00"
            className="bg-input border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Water Consumed (liters)</label>
          <Input
            type="number"
            step="0.01"
            name="water_consumed_liters"
            value={formData.water_consumed_liters}
            onChange={handleChange}
            placeholder="0.00"
            className="bg-input border-border"
          />
        </div>
      </div>

      {/* Flock Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Live Bird Count</label>
          <Input
            type="number"
            name="live_bird_count"
            value={formData.live_bird_count}
            onChange={handleChange}
            placeholder="0"
            className="bg-input border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Mortality Count</label>
          <Input
            type="number"
            name="mortality_count"
            value={formData.mortality_count}
            onChange={handleChange}
            placeholder="0"
            className="bg-input border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Avg Weight (kg)</label>
          <Input
            type="number"
            step="0.01"
            name="avg_weight_kg"
            value={formData.avg_weight_kg}
            onChange={handleChange}
            placeholder="0.00"
            className="bg-input border-border"
          />
        </div>
      </div>

      {/* Environment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Temperature (°C)</label>
          <Input
            type="number"
            step="0.1"
            name="temperature_celsius"
            value={formData.temperature_celsius}
            onChange={handleChange}
            placeholder="0.0"
            className="bg-input border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Humidity (%)</label>
          <Input
            type="number"
            step="0.1"
            name="humidity_percentage"
            value={formData.humidity_percentage}
            onChange={handleChange}
            placeholder="0.0"
            className="bg-input border-border"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any observations or notes..."
          className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {loading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Saving...
          </>
        ) : (
          'Save Farm Data'
        )}
      </Button>
    </form>
  )
}
