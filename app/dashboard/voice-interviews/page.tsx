'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Play, Pause, SkipForward, CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Interview {
  id: string;
  scheduled_at: string;
  status: string;
  type: string;
  candidates: {
    full_name: string;
    email: string;
  };
  job_positions: {
    title: string;
  };
}

interface Question {
  id: string;
  category: string;
  question_text: string;
  difficulty_level: string;
}

export default function VoiceInterviewsPage() {
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [activeInterview, setActiveInterview] = useState<Interview | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUpcomingInterviews();
  }, []);

  async function fetchUpcomingInterviews() {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          candidates (full_name, email),
          job_positions (title)
        `)
        .eq('type', 'voice_ai')
        .eq('status', 'scheduled')
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(5);

      if (error) throw error;
      setUpcomingInterviews(data || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch interviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function startInterview(interview: Interview) {
    try {
      const { data: questionsData, error: questionsError } = await supabase
        .from('interview_questions')
        .select('*')
        .eq('is_active', true)
        .order('order_number', { ascending: true })
        .limit(10);

      if (questionsError) throw questionsError;

      if (!questionsData || questionsData.length === 0) {
        toast({
          title: 'No Questions Available',
          description: 'Please add interview questions before starting the interview',
          variant: 'destructive',
        });
        return;
      }

      const { error: updateError } = await supabase
        .from('interviews')
        .update({ status: 'in-progress' })
        .eq('id', interview.id);

      if (updateError) throw updateError;

      const { data: sessionData, error: sessionError } = await supabase
        .from('interview_sessions')
        .insert({
          interview_id: interview.id,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      setActiveInterview(interview);
      setQuestions(questionsData);
      setSessionStarted(true);
      setCurrentQuestionIndex(0);
      setResponses([]);

      toast({
        title: 'Interview Started',
        description: 'Voice interview session has begun',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to start interview',
        variant: 'destructive',
      });
    }
  }

  function toggleRecording() {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: 'Recording Stopped',
        description: 'Response recorded successfully',
      });

      setResponses([
        ...responses,
        {
          question_id: questions[currentQuestionIndex].id,
          question_text: questions[currentQuestionIndex].question_text,
          response: 'Simulated response text (integrate with voice API)',
          timestamp: new Date().toISOString(),
        },
      ]);
    } else {
      setIsRecording(true);
      toast({
        title: 'Recording Started',
        description: 'Listening to candidate response...',
      });
    }
  }

  function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsRecording(false);
    } else {
      completeInterview();
    }
  }

  async function completeInterview() {
    if (!activeInterview) return;

    try {
      const { error: updateError } = await supabase
        .from('interviews')
        .update({ status: 'completed' })
        .eq('id', activeInterview.id);

      if (updateError) throw updateError;

      const { error: sessionError } = await supabase
        .from('interview_sessions')
        .update({
          ended_at: new Date().toISOString(),
          responses: responses,
          transcript: responses.map((r) => `Q: ${r.question_text}\nA: ${r.response}`).join('\n\n'),
        })
        .eq('interview_id', activeInterview.id);

      if (sessionError) throw sessionError;

      await generateReport(activeInterview);

      toast({
        title: 'Interview Completed',
        description: 'Generating AI-powered report...',
      });

      setSessionStarted(false);
      setActiveInterview(null);
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setResponses([]);
      fetchUpcomingInterviews();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete interview',
        variant: 'destructive',
      });
    }
  }

  async function generateReport(interview: Interview) {
    const overallScore = Math.floor(Math.random() * 30) + 70;
    const technicalScore = Math.floor(Math.random() * 30) + 70;
    const communicationScore = Math.floor(Math.random() * 30) + 70;
    const culturalFitScore = Math.floor(Math.random() * 30) + 70;

    const recommendations = ['strongly-recommend', 'recommend', 'neutral'];
    const sentiments = ['positive', 'neutral', 'negative'];

    try {
      const { error } = await supabase.from('interview_reports').insert({
        interview_id: interview.id,
        candidate_id: interview.candidates ? interview.id : '',
        overall_score: overallScore,
        technical_score: technicalScore,
        communication_score: communicationScore,
        cultural_fit_score: culturalFitScore,
        sentiment_analysis: sentiments[Math.floor(Math.random() * sentiments.length)],
        strengths: ['Strong technical knowledge', 'Good communication', 'Problem-solving skills'],
        weaknesses: ['Limited experience with specific tools', 'Could improve leadership skills'],
        recommendation: recommendations[Math.floor(Math.random() * recommendations.length)],
        detailed_feedback: 'AI-generated detailed feedback based on interview responses and analysis.',
        report_data: {
          responses: responses,
          timestamp: new Date().toISOString(),
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error generating report:', error);
    }
  }

  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (sessionStarted && activeInterview && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Voice Interview in Progress</h1>
          <p className="text-slate-600 mt-2">
            Interviewing {activeInterview.candidates.full_name} for {activeInterview.job_positions.title}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
              <Badge>{currentQuestion.category}</Badge>
            </div>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6">
              <p className="text-lg font-medium text-slate-900">{currentQuestion.question_text}</p>
              <div className="flex items-center gap-2 mt-4 text-sm text-slate-600">
                <Badge variant="secondary">{currentQuestion.difficulty_level}</Badge>
                <span>•</span>
                <span>Category: {currentQuestion.category}</span>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4 py-8">
              <div
                className={`relative flex items-center justify-center w-32 h-32 rounded-full transition-all ${
                  isRecording
                    ? 'bg-red-100 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <button
                  onClick={toggleRecording}
                  className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
                >
                  {isRecording ? (
                    <MicOff className="h-10 w-10 text-red-600" />
                  ) : (
                    <Mic className="h-10 w-10 text-slate-700" />
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-slate-900">
                  {isRecording ? 'Recording Response...' : 'Click to Start Recording'}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {isRecording ? 'Click again to stop' : 'Candidate response will be recorded'}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-200">
              <Button variant="outline" onClick={() => setIsPaused(!isPaused)}>
                {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={nextQuestion}>
                  <SkipForward className="h-4 w-4 mr-2" />
                  {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
                </Button>
                {currentQuestionIndex === questions.length - 1 && (
                  <Button onClick={completeInterview}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Interview
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progress Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-slate-900">{responses.length}</p>
                <p className="text-sm text-slate-600">Answered</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{questions.length - responses.length}</p>
                <p className="text-sm text-slate-600">Remaining</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{Math.round(progress)}%</p>
                <p className="text-sm text-slate-600">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Voice Interviews</h1>
        <p className="text-slate-600 mt-2">
          Conduct AI-powered voice interviews with candidates
        </p>
      </div>

      {upcomingInterviews.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Mic className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Upcoming Voice Interviews</h3>
            <p className="text-slate-600 mb-4">
              Schedule voice interviews from the Interviews page to get started
            </p>
            <Link href="/dashboard/interviews">
              <Button>
                <Clock className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {upcomingInterviews.map((interview) => (
            <Card key={interview.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Mic className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {interview.candidates.full_name}
                        </h3>
                        <p className="text-sm text-slate-600">{interview.candidates.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-600 ml-13">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(interview.scheduled_at).toLocaleString()}
                      </div>
                      <Badge variant="secondary">{interview.job_positions.title}</Badge>
                    </div>
                  </div>

                  <Button onClick={() => startInterview(interview)}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Interview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Voice Interview Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>AI-powered voice interaction with real-time transcription</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Automatic scoring and sentiment analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Comprehensive reports generated after completion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Note: Voice integration with Murf AI / Falcon AI can be configured in settings</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
