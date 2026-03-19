'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, FileText, TrendingUp, Clock, CircleCheck as CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DashboardStats {
  totalCandidates: number;
  totalInterviews: number;
  completedInterviews: number;
  pendingReports: number;
  shortlistedCandidates: number;
  upcomingInterviews: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCandidates: 0,
    totalInterviews: 0,
    completedInterviews: 0,
    pendingReports: 0,
    shortlistedCandidates: 0,
    upcomingInterviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          candidatesResult,
          interviewsResult,
          completedResult,
          shortlistedResult,
          upcomingResult,
        ] = await Promise.all([
          supabase.from('candidates').select('id', { count: 'exact', head: true }),
          supabase.from('interviews').select('id', { count: 'exact', head: true }),
          supabase
            .from('interviews')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'completed'),
          supabase
            .from('candidates')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'shortlisted'),
          supabase
            .from('interviews')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'scheduled')
            .gte('scheduled_at', new Date().toISOString()),
        ]);

        setStats({
          totalCandidates: candidatesResult.count || 0,
          totalInterviews: interviewsResult.count || 0,
          completedInterviews: completedResult.count || 0,
          pendingReports: (completedResult.count || 0) - 0,
          shortlistedCandidates: shortlistedResult.count || 0,
          upcomingInterviews: upcomingResult.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Candidates',
      value: stats.totalCandidates,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Shortlisted',
      value: stats.shortlistedCandidates,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Interviews',
      value: stats.totalInterviews,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Upcoming Interviews',
      value: stats.upcomingInterviews,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completed',
      value: stats.completedInterviews,
      icon: TrendingUp,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      title: 'Reports Generated',
      value: stats.completedInterviews,
      icon: FileText,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Welcome to your AI Recruiter dashboard. Monitor your hiring pipeline at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                <stat.icon className={cn('h-4 w-4', stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/candidates">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Add New Candidate
              </Button>
            </Link>
            <Link href="/dashboard/interviews">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </Link>
            <Link href="/dashboard/voice-interviews">
              <Button className="w-full justify-start" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Start Voice Interview
              </Button>
            </Link>
            <Link href="/dashboard/reports">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-slate-600">
              <p>No recent activity to display.</p>
              <p className="text-xs">
                Activity will appear here as you use the platform.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
