# BehaviorAI Farm - Architecture Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Main Page (page.tsx)                  │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │  Tabs: Dashboard | Input Daily Data                 │ │  │
│  │  │                                                     │ │  │
│  │  │  Tab 1: Dashboard                                   │ │  │
│  │  │  ├─ Dashboard Component                             │ │  │
│  │  │  │  ├─ Key Metrics Cards                            │ │  │
│  │  │  │  ├─ Tabs: Consumption | Health | Insights        │ │  │
│  │  │  │  │  ├─ FarmDataChart (Consumption)              │ │  │
│  │  │  │  │  ├─ FarmDataChart (Health)                    │ │  │
│  │  │  │  │  ├─ AIInsightsPanel                           │ │  │
│  │  │  │  │  └─ AlertsPanel                               │ │  │
│  │  │  │  └─ Real-time updates                            │ │  │
│  │  │                                                     │ │  │
│  │  │  Tab 2: Input Daily Data                            │ │  │
│  │  │  └─ DataInputForm Component                         │ │  │
│  │  │     ├─ Date selector                                │ │  │
│  │  │     ├─ Feed/Water inputs                            │ │  │
│  │  │     ├─ Flock health inputs                          │ │  │
│  │  │     ├─ Environment inputs                           │ │  │
│  │  │     └─ Notes textarea                               │ │  │
│  │  │                                                     │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │         Styling: Tailwind + Orange/Cream Theme         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP Requests (fetch)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Next.js API Routes)                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Farm Data Endpoints                        │   │
│  │                                                         │   │
│  │  GET  /api/farm-data                                   │   │
│  │  └─→ Returns last 30 days of farm data                │   │
│  │                                                         │   │
│  │  POST /api/farm-data                                   │   │
│  │  └─→ Saves new daily farm observation                │   │
│  │      └─ Validates input                              │   │
│  │      └─ Stores in database                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              AI Insights Endpoints                      │   │
│  │                                                         │   │
│  │  GET /api/ai-insights                                  │   │
│  │  └─→ Fetch latest AI insights                         │   │
│  │                                                         │   │
│  │  POST /api/ai-insights/generate                        │   │
│  │  └─→ Generate NEW insights using Gemini API          │   │
│  │      ├─ Fetch recent farm data                        │   │
│  │      ├─ Calculate aggregates                          │   │
│  │      ├─ Build Gemini prompt                           │   │
│  │      ├─ Call Gemini API                               │   │
│  │      ├─ Parse JSON response                           │   │
│  │      └─ Store in database                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Alerts Endpoints                           │   │
│  │                                                         │   │
│  │  GET /api/alerts                                       │   │
│  │  └─→ Fetch all alerts                                 │   │
│  │                                                         │   │
│  │  POST /api/alerts                                      │   │
│  │  └─→ Create new alert                                 │   │
│  │                                                         │   │
│  │  PATCH /api/alerts/[id]                                │   │
│  │  └─→ Update alert status (resolve/unresolve)          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Database Queries (SQL)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE (Supabase PostgreSQL)                │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │   farm_data          │  │   ai_insights        │             │
│  ├──────────────────────┤  ├──────────────────────┤             │
│  │ id (UUID)            │  │ id (UUID)            │             │
│  │ date                 │  │ flock_id             │             │
│  │ feed_consumed_kg     │  │ insight_type         │             │
│  │ water_consumed_L     │  │ title                │             │
│  │ mortality_count      │  │ description          │             │
│  │ live_bird_count      │  │ severity             │             │
│  │ avg_weight_kg        │  │ action_items[]       │             │
│  │ temperature_C        │  │ created_at           │             │
│  │ humidity_%           │  └──────────────────────┘             │
│  │ created_at           │                                       │
│  │ updated_at           │  ┌──────────────────────┐             │
│  └──────────────────────┘  │   alerts             │             │
│                            ├──────────────────────┤             │
│  Indexes:                  │ id (UUID)            │             │
│  - idx_farm_data_date      │ alert_type           │             │
│  - idx_farm_data_flock     │ message              │             │
│                            │ severity             │             │
│                            │ is_resolved          │             │
│                            │ created_at           │             │
│                            │ resolved_at          │             │
│                            └──────────────────────┘             │
│                                                                 │
│  Indexes:                  Indexes:                             │
│  - idx_ai_insights_flock   - idx_alerts_flock                 │
│  - idx_ai_insights_created - idx_alerts_created               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                   External API Call (Gemini)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│            GOOGLE GENERATIVE AI (Gemini API)                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  POST /api/ai-insights/generate                         │   │
│  │  ├─ Sends: Aggregated farm data (text prompt)          │   │
│  │  └─ Receives: JSON with analysis                       │   │
│  │                                                         │   │
│  │  Model: gemini-1.5-flash                                │   │
│  │  Input: Farm data summary + recent daily data          │   │
│  │  Output: {                                              │   │
│  │    title: "string",                                     │   │
│  │    description: "string",                               │   │
│  │    severity: "info|warning|critical",                  │   │
│  │    actionItems: ["item1", "item2", "item3"]            │   │
│  │  }                                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Adding Farm Data
```
User Input Form
    ↓
DataInputForm Component
    ↓
POST /api/farm-data
    ↓
Validate & Parse
    ↓
Supabase farm_data INSERT
    ↓
Database Storage
    ↓
Callback: Refresh Dashboard
    ↓
Dashboard Updates
```

### Generating AI Insights
```
User clicks "Generate Insights"
    ↓
POST /api/ai-insights/generate
    ↓
Fetch last 30 days of farm_data
    ↓
Calculate Aggregates
(avg feed, avg water, total mortality, etc.)
    ↓
Build Gemini Prompt
    ↓
Call Gemini API
    ↓
Parse JSON Response
    ↓
Supabase ai_insights INSERT
    ↓
Return to Frontend
    ↓
AIInsightsPanel Updates
    ↓
Show New Insight with Severity
```

### Viewing Dashboard
```
Page Load
    ↓
Dashboard Component Mounts
    ↓
useEffect: fetch /api/farm-data
    ↓
Supabase SELECT (last 30 days)
    ↓
Render Key Metrics
    ↓
Render Charts (Recharts)
    ↓
User Sees Real Data
```

## Component Hierarchy

```
app/page.tsx (Main Layout)
├── Tabs Container
│
├── Dashboard Tab
│   └── Dashboard Component
│       ├── Key Metrics (3 Cards)
│       │   ├── Flock Size Card
│       │   ├── Average Weight Card
│       │   └── Mortality Card
│       │
│       └── Data Tabs
│           ├── Consumption Tab
│           │   └── FarmDataChart (consumption type)
│           │
│           ├── Health Tab
│           │   └── FarmDataChart (health type)
│           │       ├── Weight Chart
│           │       ├── Temp & Humidity Chart
│           │       └── Mortality Bar Chart
│           │
│           └── Insights Tab
│               ├── AIInsightsPanel
│               │   ├── Generate Button
│               │   └── Insight Cards (mapped)
│               │
│               └── AlertsPanel
│                   ├── Alert Count Badge
│                   └── Alert Items (mapped)
│
└── Data Input Tab
    └── DataInputForm Component
        ├── Date Input
        ├── Feed/Water Group
        ├── Flock Health Group
        ├── Environment Group
        ├── Notes Textarea
        └── Submit Button
```

## API Request/Response Examples

### GET /api/farm-data
**Response:**
```json
[
  {
    "id": "uuid",
    "date": "2024-04-08",
    "feed_consumed_kg": 45.5,
    "water_consumed_liters": 120.0,
    "mortality_count": 2,
    "live_bird_count": 998,
    "avg_weight_kg": 2.45,
    "temperature_celsius": 28.5,
    "humidity_percentage": 65.0,
    "notes": "Normal observations"
  }
]
```

### POST /api/ai-insights/generate
**Response:**
```json
{
  "id": "uuid",
  "insight_type": "recommendation",
  "title": "Feed Efficiency Improving",
  "description": "Your feed conversion ratio has improved by 8% over the last 7 days...",
  "severity": "info",
  "action_items": [
    "Continue current feeding schedule",
    "Monitor water consumption levels",
    "Check for any environmental changes"
  ],
  "created_at": "2024-04-08T10:30:00Z"
}
```

## Styling Architecture

```
Tailwind CSS v4
    ↓
globals.css (Design Tokens)
    ├── Light Mode Variables
    │   ├── --primary: Orange (#d97706)
    │   ├── --secondary: Semi-Orange
    │   ├── --background: Cream
    │   ├── --muted: Light Gray
    │   └── --[other tokens]
    │
    └── Dark Mode Variables
        ├── --primary: Light Orange
        ├── --secondary: Orange
        ├── --background: Dark Gray
        ├── --muted: Medium Gray
        └── --[other tokens]
```

## Security Considerations

```
Frontend
├─ No sensitive data in code
├─ All API calls through Next.js routes
└─ Environment variables not exposed

Backend (API Routes)
├─ Service role key (never exposed)
├─ Server-side only database access
├─ Input validation on all endpoints
└─ Error handling without leaking details

Database
├─ Encrypted connections (Supabase)
├─ Service role authentication
└─ Row-level security (optional)

AI Integration
├─ API key in environment only
├─ No personal data sent to Gemini
├─ Only aggregated farm metrics
└─ Responses stored securely
```

## Performance Optimizations

1. **Database Queries**: Indexed on `date`, `flock_id`, `created_at`
2. **API Caching**: Insights cached on generation
3. **Component Rendering**: Memoized components, lazy loading
4. **Data Fetching**: SWR-like pattern with fetch
5. **Charts**: Recharts handles virtualization
6. **Images**: Optimized with Next.js Image

---

**This architecture is production-ready and scalable!**
