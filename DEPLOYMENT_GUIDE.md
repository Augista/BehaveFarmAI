# BehaviorAI Farm - Deployment Guide

Your BehaviorAI Farm application is ready to deploy! This guide will walk you through the deployment process.

## Pre-Deployment Checklist

- ✅ Database schema created (farm_data, ai_insights, alerts tables)
- ✅ All API endpoints implemented
- ✅ Dashboard and UI components built
- ✅ Orange/cream color theme applied
- ✅ Supabase integration configured
- ⚠️ Gemini API key needed (see below)

## Quick Start

### 1. Add Gemini API Key (Required for AI Features)

Before deploying, get your free Gemini API key:

1. Visit https://ai.google.dev
2. Click "Get API Key"
3. Copy your API key
4. Add it to your local `.env.local` for testing:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
   ```

### 2. Test Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

Test the app:
1. Add farm data using "Input Daily Data" tab
2. View dashboard metrics
3. Click "Generate Insights" to test AI features

### 3. Deploy to Vercel

#### Option A: Deploy from GitHub (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Vercel will auto-detect Next.js configuration
6. Add Environment Variables in Settings:
   - `NEXT_PUBLIC_SUPABASE_URL` (from Supabase)
   - `SUPABASE_SERVICE_ROLE_KEY` (from Supabase)
   - `GOOGLE_GENERATIVE_AI_API_KEY` (from Google AI)
7. Click "Deploy"

#### Option B: Direct Vercel Deployment

```bash
npm install -g vercel
vercel
```

Follow the prompts and add environment variables when asked.

## Environment Variables for Vercel

Set these in your Vercel project settings under "Environment Variables":

| Variable | Source | Required |
|----------|--------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings → API | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings → API | Yes |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI Studio | Yes (for AI features) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings → API | Auto-generated |

### Getting Your Supabase Credentials:

1. Go to your Supabase project dashboard
2. Click Settings (bottom left)
3. Click API
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `Service Role Key` → `SUPABASE_SERVICE_ROLE_KEY`
   - `Anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Production Deployment Checklist

Before going live:

- [ ] Gemini API key is set in Vercel environment variables
- [ ] Supabase credentials are correct and service role key is secured
- [ ] Database tables exist (farm_data, ai_insights, alerts)
- [ ] Test the app works in production:
  - [ ] Can add farm data
  - [ ] Dashboard displays data correctly
  - [ ] AI insights generate without errors
  - [ ] Alerts work properly
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (Vercel Analytics is built-in)

## Accessing Your Production App

Once deployed, Vercel will provide you with a production URL like:
```
https://your-project-name.vercel.app
```

You can also add a custom domain in Vercel project settings.

## Monitoring

### Vercel Monitoring
- View real-time metrics in Vercel dashboard
- Check build logs for deployment issues
- Monitor performance with Vercel Analytics

### Application Logging
- Check API responses and errors in browser console
- Use `console.log(" ...")` for debugging
- Vercel logs are available in deployment settings

## Updating Your App

To update the app after deployment:

1. Make changes locally
2. Test with `npm run dev`
3. Push to GitHub (if using GitHub integration)
4. Vercel automatically redeploys
5. Or manually redeploy with `vercel --prod`

## Troubleshooting Deployment

### Build Errors

If deployment fails:

1. Check build logs in Vercel dashboard
2. Ensure all environment variables are set
3. Try building locally: `npm run build`
4. Check for TypeScript errors: `npm run lint`

### API Errors After Deployment

If APIs fail in production:

1. Verify environment variables in Vercel settings
2. Check Supabase is accessible (check status at status.supabase.com)
3. Test API endpoints directly
4. Check Vercel Function logs

### Gemini API Issues

- Verify API key is correct and not expired
- Check Google Cloud Console for quota limits
- Ensure API is enabled in Google Cloud project
- Check recent deployments for error logs

## Database Backups

Supabase automatically backs up your data:

1. Go to your Supabase project
2. Settings → Backups
3. Enable automated backups (recommended for production)
4. Manual backups available anytime

## Scaling

As your app grows:

- **Supabase**: Upgrade plan for more storage/connections
- **Gemini API**: Set rate limits to control costs
- **Vercel**: Auto-scales with usage, upgrade for more serverless function execution

## Cost Estimates (Monthly)

| Service | Free Tier | Typical Cost |
|---------|-----------|--------------|
| Vercel | Up to 100GB bandwidth | $0-20 |
| Supabase | 500MB database | $0-25 |
| Gemini API | 1M tokens/month | $0-10 |
| **Total** | | **$0-55** |

*Costs depend on actual usage. Start with free tiers and upgrade as needed.*

## Support

- **Vercel Issues**: [vercel.com/support](https://vercel.com/support)
- **Supabase Issues**: [supabase.com/docs](https://supabase.com/docs)
- **Gemini API**: [ai.google.dev/docs](https://ai.google.dev/docs)

## Next Steps

1. ✅ Deploy your app
2. Share the URL with your team
3. Start recording farm data
4. Generate AI insights
5. Optimize your broiler farm operations

**Congratulations! Your BehaviorAI Farm is live! 🎉**
