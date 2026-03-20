# Deployment Guide - AI Recruiter Voice Agent

## Build Status ✓

The application has been successfully fixed and builds without errors. All pages compile correctly with optimized static generation.

## What Was Fixed

1. **Updated Next.js to v14.2.0** - Better compatibility with Radix UI components
2. **Updated Radix UI Progress to v1.1.1** - Fixed webpack minification issues
3. **Updated Netlify Plugin** - Latest version (5.15.9) for better integration
4. **Enhanced Webpack Configuration** - Optimized minification settings

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Supabase project created
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Optional API keys added (OpenAI, Murf AI, SendGrid)

## Environment Variables

Create a `.env.production` or `.env.local` file with:

```env
# Required - Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - AI & Voice Features
OPENAI_API_KEY=your_openai_api_key
MURF_AI_API_KEY=your_murf_ai_key
SENDGRID_API_KEY=your_sendgrid_api_key
```

## Deployment to Netlify

### Step 1: Connect Repository
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Select your GitHub repository

### Step 2: Configure Build Settings
The `netlify.toml` file is pre-configured. It will automatically:
- Run `npm install`
- Execute `npm run build`
- Deploy from `.next` directory

### Step 3: Add Environment Variables
1. Go to Site Settings → Environment
2. Add all required environment variables
3. No secrets are needed in the build environment

### Step 4: Deploy
1. Click "Deploy site"
2. Wait for the build to complete (typically 2-3 minutes)
3. Your site will be live at the provided URL

## Deployment to Vercel

### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository

### Step 2: Configure Project
1. Framework: Select "Next.js"
2. Build Command: `npm run build` (auto-detected)
3. Output Directory: `.next` (auto-detected)

### Step 3: Add Environment Variables
1. Go to Settings → Environment Variables
2. Add required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Optional: `OPENAI_API_KEY`, `MURF_AI_API_KEY`, etc.

### Step 4: Deploy
1. Click "Deploy"
2. Vercel will automatically build and deploy
3. Your site will be live immediately

## Post-Deployment

### 1. Verify Application
- [ ] Navigate to your deployed URL
- [ ] Sign up with a test account
- [ ] Create a test job position
- [ ] Add a test candidate
- [ ] Verify database connection works

### 2. Configure AI Features (Optional)
If you plan to use voice interviews:

1. Get API keys from:
   - [Murf AI](https://murf.ai/) - Voice generation
   - [OpenAI](https://openai.com/) - Report generation
   - [SendGrid](https://sendgrid.com/) - Email notifications

2. Add keys to your deployment environment variables

3. Configure in Settings → Voice AI Configuration

### 3. Set Up Email Notifications (Optional)
1. Get SendGrid API key
2. Add to environment variables as `SENDGRID_API_KEY`
3. Configure in Settings → Email Notifications

## Monitoring & Troubleshooting

### Check Build Logs
- **Netlify**: Site Settings → Build & Deploy → Builds
- **Vercel**: Click on deployment → Logs

### Common Issues

#### Build Fails with Webpack Errors
- Clear build cache: Delete `.next` and `node_modules/.cache`
- Run `npm install` again
- Verify all dependencies are installed

#### Database Connection Issues
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase project is active
- Ensure RLS policies are properly configured

#### Styling Issues (Tailwind not applying)
- Verify `tailwind.config.ts` includes all template paths
- Check PostCSS configuration
- Clear browser cache and restart

#### Authentication Not Working
- Verify Supabase Auth is enabled
- Check environment variables are correct
- Ensure user table has proper RLS policies

## Performance Optimization

The application includes:
- Static page generation where possible
- Optimized JavaScript bundles
- Image optimization (Netlify/Vercel handles this)
- CSS minification via Tailwind

Expected performance metrics:
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

## Scaling Considerations

### For High Traffic
1. Enable Supabase connection pooling
2. Configure CDN caching headers
3. Use Vercel Analytics to monitor performance

### For More Users
1. Increase Supabase compute resources
2. Enable read replicas for reporting
3. Implement caching layer for reports

### Database Optimization
1. Regular VACUUM/ANALYZE operations
2. Monitor slow queries in Supabase logs
3. Add indexes for frequently searched columns

## Security Checklist

- [ ] All secrets are in environment variables (not in code)
- [ ] Supabase RLS policies are enabled
- [ ] HTTPS is enforced (automatic with Netlify/Vercel)
- [ ] API keys are rotated regularly
- [ ] Regular security updates for dependencies

## Backup Strategy

### Database Backups
- Supabase provides automatic daily backups
- Configure backups in Supabase project settings
- Set retention policy to 30+ days

### Code Backups
- GitHub automatically backs up your repository
- Consider enabling branch protection rules
- Regular release tags for production versions

## Monitoring & Analytics

### Recommended Tools
- **Error Tracking**: Sentry (free tier available)
- **Performance**: Vercel Analytics or DataDog
- **Uptime**: UptimeRobot (free tier)
- **Logs**: Supabase Logs or LogRocket

## Rollback Procedure

If deployment causes issues:

1. **Quick Rollback** (Netlify/Vercel)
   - Go to Deploys section
   - Click "Rollback" on previous successful deployment

2. **Git Rollback**
   - Run `git revert <commit-hash>`
   - Push to main branch
   - New deployment will be triggered

## Support & Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Supabase Deployment Guide](https://supabase.com/docs/guides/hosting)
- [Netlify Build Config](https://docs.netlify.com/configure-builds/overview/)
- [Vercel Deployment Docs](https://vercel.com/docs)

## Production Deployment Checklist

Final checklist before going live:

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificate installed (automatic)
- [ ] Subdomain/custom domain configured
- [ ] Email notifications tested
- [ ] Voice AI features tested (if enabled)
- [ ] Analytics enabled
- [ ] Error tracking configured
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured
- [ ] Team access configured
- [ ] Documentation updated

Congratulations! Your AI Recruiter platform is ready for production.
