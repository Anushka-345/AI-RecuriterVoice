'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, Eye, TrendingUp, TrendingDown, Minus, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Report {
  id: string;
  overall_score: number;
  technical_score: number | null;
  communication_score: number | null;
  cultural_fit_score: number | null;
  sentiment_analysis: string | null;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  detailed_feedback: string | null;
  generated_at: string;
  interviews: {
    scheduled_at: string;
    candidates: {
      full_name: string;
      email: string;
    };
    job_positions: {
      title: string;
    };
  };
}

const recommendationColors = {
  'strongly-recommend': 'bg-emerald-100 text-emerald-800',
  'recommend': 'bg-green-100 text-green-800',
  'neutral': 'bg-yellow-100 text-yellow-800',
  'not-recommend': 'bg-orange-100 text-orange-800',
  'strongly-not-recommend': 'bg-red-100 text-red-800',
};

const sentimentIcons = {
  positive: TrendingUp,
  neutral: Minus,
  negative: TrendingDown,
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const { data, error } = await supabase
        .from('interview_reports')
        .select(`
          *,
          interviews (
            scheduled_at,
            candidates (full_name, email),
            job_positions (title)
          )
        `)
        .order('generated_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch reports',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  function viewReport(report: Report) {
    setSelectedReport(report);
    setDialogOpen(true);
  }

  function getScoreColor(score: number) {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  function getScoreBg(score: number) {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Interview Reports</h1>
        <p className="text-slate-600 mt-2">
          AI-generated analysis and recommendations from completed interviews
        </p>
      </div>

      {reports.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Reports Yet</h3>
            <p className="text-slate-600 mb-4">
              Reports will be generated automatically after interviews are completed
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">{reports.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Avg Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">
                  {Math.round(
                    reports.reduce((acc, r) => acc + r.overall_score, 0) / reports.length
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Recommended
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {
                    reports.filter((r) =>
                      ['strongly-recommend', 'recommend'].includes(r.recommendation)
                    ).length
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Not Recommended
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">
                  {
                    reports.filter((r) =>
                      ['not-recommend', 'strongly-not-recommend'].includes(r.recommendation)
                    ).length
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Interview Date</TableHead>
                      <TableHead>Overall Score</TableHead>
                      <TableHead>Recommendation</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => {
                      const SentimentIcon = report.sentiment_analysis
                        ? sentimentIcons[report.sentiment_analysis as keyof typeof sentimentIcons]
                        : Minus;

                      return (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {report.interviews.candidates.full_name}
                              </div>
                              <div className="text-sm text-slate-600">
                                {report.interviews.candidates.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{report.interviews.job_positions.title}</TableCell>
                          <TableCell>
                            {format(new Date(report.interviews.scheduled_at), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className={`px-3 py-1 rounded-full ${getScoreBg(
                                  report.overall_score
                                )}`}
                              >
                                <span className={`font-bold ${getScoreColor(report.overall_score)}`}>
                                  {report.overall_score}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                recommendationColors[
                                  report.recommendation as keyof typeof recommendationColors
                                ]
                              }
                            >
                              {report.recommendation.replace(/-/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 capitalize">
                              <SentimentIcon className="h-4 w-4" />
                              {report.sentiment_analysis || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => viewReport(report)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>Interview Report</DialogTitle>
                <DialogDescription>
                  Detailed analysis for {selectedReport.interviews.candidates.full_name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">
                        Candidate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium">{selectedReport.interviews.candidates.full_name}</p>
                      <p className="text-sm text-slate-600">
                        {selectedReport.interviews.candidates.email}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">
                        Position
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium">{selectedReport.interviews.job_positions.title}</p>
                      <p className="text-sm text-slate-600">
                        {format(
                          new Date(selectedReport.interviews.scheduled_at),
                          'MMM dd, yyyy'
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Performance Scores</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Overall Score</span>
                        <span className="text-sm font-bold">
                          {selectedReport.overall_score}/100
                        </span>
                      </div>
                      <Progress value={selectedReport.overall_score} />
                    </div>

                    {selectedReport.technical_score && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Technical Skills</span>
                          <span className="text-sm font-bold">
                            {selectedReport.technical_score}/100
                          </span>
                        </div>
                        <Progress value={selectedReport.technical_score} />
                      </div>
                    )}

                    {selectedReport.communication_score && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Communication</span>
                          <span className="text-sm font-bold">
                            {selectedReport.communication_score}/100
                          </span>
                        </div>
                        <Progress value={selectedReport.communication_score} />
                      </div>
                    )}

                    {selectedReport.cultural_fit_score && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Cultural Fit</span>
                          <span className="text-sm font-bold">
                            {selectedReport.cultural_fit_score}/100
                          </span>
                        </div>
                        <Progress value={selectedReport.cultural_fit_score} />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedReport.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedReport.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      className={`${
                        recommendationColors[
                          selectedReport.recommendation as keyof typeof recommendationColors
                        ]
                      } text-base px-4 py-2`}
                    >
                      {selectedReport.recommendation.replace(/-/g, ' ').toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>

                {selectedReport.detailed_feedback && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Detailed Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">
                        {selectedReport.detailed_feedback}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
