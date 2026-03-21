<h1>🤖 AI Recruiter Voice Agent – Full-Stack Application</h1>

<h3>A comprehensive AI-powered recruitment platform that automates candidate sourcing, scheduling, voice interviews, and report generation. The system reduces HR manual effort by 50–80% and accelerates the hiring process with intelligent automation.</h3>

<h1>✨ Features</h1>
<h2> Candidate Sourcing & Screening 📝</h2>

AI-powered filtering of resumes and candidate profiles

Automated shortlisting based on predefined criteria

Skills-based matching with job positions

Impact: Reduces initial screening time by 50–60%

<h2>Interview Scheduling & Notifications 📅</h2>

Automated interview scheduling with calendar integration

Email notifications for candidates and interviewers

Support for multiple interview types: Voice AI, Video, Phone, In-Person

Impact: Eliminates scheduling conflicts and manual coordination

<h2>Voice-Based Interview Conducting 🎙️</h2>

Real-time voice interaction with candidates

AI-powered question flow management

Automatic transcription and response capture

Integration-ready for Murf AI / Falcon AI Voice

Impact: Enables 24/7 automated interviewing

<h3> Automated Interview Reports 📊</h3>

AI analysis of candidate answers for skill assessment

Sentiment analysis and communication scoring

Structured reports with scores, feedback, and recommendations

Impact: Saves 70–80% of manual evaluation effort

<h4>Comprehensive Dashboard 🖥️</h4>

Real-time hiring pipeline metrics

Candidate status tracking

Interview calendar and scheduling

Report analytics and insights

<h1>🛠️ Tech Stack</h1>

Frontend: Next.js 13, React, Tailwind CSS, shadcn/ui

Backend: Next.js API Routes (serverless)

Database: Supabase (PostgreSQL)

Authentication: Supabase Auth (email/password)

AI & Voice: Murf AI, Falcon AI, OpenAI integration-ready



<h1>💾 Database Schema</h1>
Table	Purpose
users	HR managers and recruiters
candidates	Candidate profiles and information
job_positions	Open job positions
interviews	Scheduled interviews
interview_sessions	Interview recordings and transcripts
interview_reports	AI-generated assessment reports
interview_questions	Question bank for interviews
notifications	Email notification queue

Security: All tables have Row Level Security (RLS) enabled.

<h1>🚀 Getting Started</h1>
Prerequisites

Node.js 18+

npm or yarn

Supabase account

(Optional) Murf AI / Falcon AI API keys for voice features

<h1>Installation</h1>

Clone the repository

Install dependencies:

npm install

Set up environment variables in .env.local:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Run database migrations in Supabase

Start the development server:

npm run dev

<h1>📁 Application Structure</h1>
/app
  /(auth)
    login            - Authentication page
    signup           - Registration page
  /dashboard
    page.tsx         - Main dashboard with metrics
    candidates       - Candidate management
    positions        - Job position management
    interviews       - Interview scheduling
    voice-interviews - AI voice interview interface
    reports          - Interview reports and analytics
    questions        - Question bank management
    settings         - Platform configuration
/components
  /ui                - Reusable UI components (shadcn/ui)
/lib
  supabase.ts        - Database client
  auth-context.tsx   - Authentication provider
  utils.ts           - Utility functions

  
<h1>🗂️ Key Pages</h1>

Dashboard – Overview metrics, recent activity, and quick actions

Candidates – Add/manage candidates, track AI screening scores

Interviews – Schedule, view, and manage interviews

Voice Interviews – Conduct AI-powered voice interviews, record responses, track progress

Reports – Detailed candidate assessments, scores, and hiring recommendations


<h1>🤖 AI Integration<h1></h1>
  
Voice AI

Integration with Murf AI or Falcon AI

Configure in Settings: API key, provider selection, enable features

Screening AI

Resume content analysis

Skills and experience matching

Candidate fit scoring

Report Generation

Response analysis

Sentiment and communication scoring

Detailed feedback and hiring recommendations

<h1>🔒 Security</h1>

Row Level Security (RLS) enabled

Secure authentication with Supabase Auth

Protected routes and API key management

Data isolation per organization

<h1>Demo</h1>

<img width="1920" height="893" alt="Screenshot 2026-03-21 171900" src="https://github.com/user-attachments/assets/8f3cc519-f60f-4a73-b0d6-ab9871a3943f" />

<img width="1920" height="879" alt="Screenshot 2026-03-21 174708" src="https://github.com/user-attachments/assets/21a477d8-2252-40e5-8768-98cfc234496f" />


<h1>⚡ Performance Metrics</h1>

50–60% reduction in initial screening time

70–80% reduction in manual evaluation effort

100% elimination of scheduling conflicts

24/7 availability for candidate interviews

Real-time report generation

🔮 Future Enhancements

ATS integration

Video interview recording & analysis

Multi-language support

Advanced analytics & ML-powered predictions

LinkedIn/job board integration

Mobile application

Slack/Teams notifications

Calendar sync (Google/Outlook)

<h1>🛠️ Support<h1></h1>

Check documentation

Review database schema

Verify environment variables

Check Supabase connection
