# 🐔 BehaviorAI Farm

An AI-powered farm management system for broiler chicken operations, built with Next.js, Supabase, and Google Gemini AI.

## 🎯 Features

### Real-time Dashboard
- **Key Metrics**: Monitor flock size, average weight, and mortality in real-time
- **Feed & Water Consumption**: Track daily consumption trends over 30 days
- **Health Metrics**: Monitor bird weight progression and environmental conditions
- **Visual Analytics**: Interactive charts powered by Recharts

### Daily Data Management
- Input comprehensive daily farm observations
- Track feed and water consumption
- Record mortality counts and bird weights
- Monitor environmental conditions (temperature, humidity)
- Add detailed notes for observations

### AI-Powered Insights
- **Gemini AI Analysis**: Automatic analysis of farm data patterns
- **Smart Recommendations**: Get actionable insights for farm optimization
- **Anomaly Detection**: Automatic detection of unusual patterns
- **Severity Levels**: Info, Warning, and Critical alerts

### Alert Management
- Real-time alert system for critical farm events
- Alert resolution tracking
- Alert history and analytics

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom orange/cream theme
- **Database**: Supabase PostgreSQL
- **AI/ML**: Google Generative AI (Gemini API)
- **Charts**: Recharts
- **UI Components**: shadcn/ui

## 🎨 Design

The app features a warm, professional color palette:
- **Primary**: Orange (#d97706) - Main brand color
- **Secondary**: Semi-Orange accent
- **Neutral**: Cream and beige backgrounds
- Modern, clean interface optimized for farm management

## 📋 Database Schema

### farm_data
Stores daily farm observations and measurements
- Feed consumption (kg)
- Water consumption (liters)
- Mortality count
- Live bird count
- Average weight
- Temperature and humidity
- Custom notes

### ai_insights
Stores AI-generated recommendations and analysis
- Insight type (anomaly, recommendation, forecast)
- Title and detailed description
- Severity level
- Actionable items
- Date range analyzed

### alerts
Manages system alerts and notifications
- Alert type
- Message
- Severity
- Resolution status
- Timestamps

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (free at supabase.com)
- Google Generative AI API key (free at ai.google.dev)

### Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Configure environment variables**

Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

3. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📖 How to Use

### 1. Dashboard Tab
- View real-time farm metrics
- Monitor feed and water consumption trends
- Check bird weight progression
- Review environmental conditions

### 2. Input Daily Data Tab
- Record daily farm observations
- Enter all measurements and observations
- Add notes for significant events
- Data is automatically saved to the database

### 3. AI Insights Tab
- Click "Generate Insights" to analyze your farm data
- AI will detect patterns and provide recommendations
- Review severity levels (Info, Warning, Critical)
- Follow action items for farm optimization

### 4. Alerts Tab
- View active alerts for your farm
- Resolve alerts once actions are taken
- Check alert history

## 🤖 AI Features

The app uses Google Gemini AI to:
- **Analyze Patterns**: Identify trends in feed consumption, growth rates, and mortality
- **Detect Anomalies**: Flag unusual patterns that may indicate health issues
- **Generate Recommendations**: Provide actionable advice for farm optimization
- **Predict Issues**: Anticipate potential problems based on historical data

## 📊 API Endpoints

```
GET/POST  /api/farm-data              - Manage farm data entries
GET       /api/ai-insights            - Retrieve AI insights
POST      /api/ai-insights/generate   - Generate new insights with Gemini
GET/POST  /api/alerts                 - Manage alerts
PATCH     /api/alerts/[id]            - Update alert status
```

## 🔒 Security

- Service role key used for backend operations only
- No sensitive data exposed to frontend
- Supabase handles all data encryption
- Row-level security can be enabled for multi-tenant support

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🚀 Deployment

Deploy to Vercel with one click:

```bash
vercel deploy
```

All environment variables will be automatically configured.

## 🐛 Troubleshooting

### "Failed to fetch data" error
- Verify all environment variables are set
- Check Supabase connection status
- Review browser console for detailed errors

### AI Insights not generating
- Ensure GOOGLE_GENERATIVE_AI_API_KEY is set
- Verify you have farm data in the database
- Check API quota at ai.google.dev

### Database errors
- Verify Supabase project is active
- Check that all tables were created
- Confirm service role key permissions

## 📝 File Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── farm-data/
│   │   ├── ai-insights/
│   │   └── alerts/
│   ├── page.tsx               # Main dashboard
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── Dashboard.tsx          # Main dashboard
│   ├── FarmDataChart.tsx      # Charts
│   ├── DataInputForm.tsx      # Form
│   ├── AIInsightsPanel.tsx    # AI insights
│   └── AlertsPanel.tsx        # Alerts
├── scripts/
│   └── 01-create-tables.sql   # Database schema
└── SETUP.md                   # Setup guide
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📞 Support

For issues, questions, or feature requests, please open an issue in the repository.

---

**Built with ❤️ for poultry farmers using AI**
