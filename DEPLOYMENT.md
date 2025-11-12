# Deployment Guide - EL BARAA School Site

## Option 1: Deploy to Vercel (Recommended - Easiest)

Vercel is the creators of Next.js and provides the best integration.

### Steps:

1. **Push your code to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account

3. **Import your project**:
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

4. **Configure Environment Variables**:
   - In the project settings, go to "Environment Variables"
   - Add these variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Make sure to add them for **Production**, **Preview**, and **Development**

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (usually 1-2 minutes)
   - Your site will be live at: `https://your-project-name.vercel.app`

### Custom Domain (Optional):
- Go to Project Settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

---

## Option 2: Deploy to Netlify

### Steps:

1. **Push code to GitHub** (same as above)

2. **Go to Netlify**:
   - Visit [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub

3. **Import project**:
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `.next`

4. **Add Environment Variables**:
   - Site settings → Environment variables
   - Add:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

5. **Deploy**:
   - Click "Deploy site"
   - Your site will be live at: `https://your-project-name.netlify.app`

---

## Option 3: Deploy to Traditional Hosting (VPS/Shared Hosting)

### Prerequisites:
- Node.js 18+ installed on server
- PM2 or similar process manager

### Steps:

1. **Build the project locally**:
   ```bash
   npm run build
   ```

2. **Upload files to server** (excluding node_modules and .next):
   - Upload all files except:
     - `node_modules/`
     - `.next/`
     - `.env.local`

3. **On your server**:
   ```bash
   # Install dependencies
   npm install --production
   
   # Build the project
   npm run build
   
   # Start the server
   npm start
   # OR use PM2 for process management:
   pm2 start npm --name "school-site" -- start
   ```

4. **Set up reverse proxy** (Nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Set environment variables** on server:
   ```bash
   export NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   export NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

---

## Pre-Deployment Checklist

Before deploying, make sure:

- [ ] All environment variables are set correctly
- [ ] Build completes successfully (`npm run build`)
- [ ] No console errors in browser
- [ ] All routes work correctly
- [ ] Mobile responsiveness tested
- [ ] Supabase connection works
- [ ] File uploads work (if applicable)
- [ ] Passwords are set correctly (teacher19/, admin25/)

---

## Environment Variables Required

Make sure these are set in your deployment platform:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Never commit `.env.local` to Git. It's already in `.gitignore`.

---

## Post-Deployment

1. **Test all functionality**:
   - Home page loads
   - Student portal works
   - Teacher login (password: teacher19/)
   - Admin login (username: admin, password: admin25/)
   - File uploads work
   - Announcements display
   - Calendar displays

2. **Monitor**:
   - Check Vercel/Netlify dashboard for build logs
   - Monitor Supabase dashboard for API usage
   - Set up error tracking (optional)

---

## Quick Deploy Commands (Vercel CLI)

If you prefer command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Troubleshooting

**Build fails:**
- Check environment variables are set
- Ensure all dependencies are in package.json
- Check build logs for specific errors

**Site loads but features don't work:**
- Verify environment variables are set correctly
- Check Supabase connection
- Check browser console for errors

**Images not loading:**
- Verify Supabase storage bucket permissions
- Check CORS settings in Supabase

---

## Recommended: Vercel

For Next.js projects, **Vercel is highly recommended** because:
- ✅ Zero configuration needed
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments from Git
- ✅ Preview deployments for pull requests
- ✅ Free tier is generous
- ✅ Built by Next.js creators

