'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Calendar as CalendarIcon, Clock, Video, Phone, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Interview {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  type: string;
  status: string;
  candidate_id: string;
  job_position_id: string;
  meeting_link: string | null;
  candidates: {
    full_name: string;
    email: string;
  };
  job_positions: {
    title: string;
  };
}

interface Candidate {
  id: string;
  full_name: string;
  email: string;
}

interface JobPosition {
  id: string;
  title: string;
}

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  'no-show': 'bg-slate-100 text-slate-800',
};

const typeIcons = {
  voice_ai: Mic,
  video: Video,
  phone: Phone,
  'in-person': CalendarIcon,
};

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [newInterview, setNewInterview] = useState({
    candidate_id: '',
    job_position_id: '',
    scheduled_at: '',
    duration_minutes: 30,
    type: 'voice_ai',
  });

  useEffect(() => {
    fetchInterviews();
    fetchCandidates();
    fetchPositions();
  }, []);

  async function fetchInterviews() {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          candidates (full_name, email),
          job_positions (title)
        `)
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      setInterviews(data || []);
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

  async function fetchCandidates() {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('id, full_name, email')
        .in('status', ['screening', 'shortlisted', 'interviewing']);

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  }

  async function fetchPositions() {
    try {
      const { data, error } = await supabase
        .from('job_positions')
        .select('id, title')
        .eq('status', 'active');

      if (error) throw error;
      setPositions(data || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  }

  async function handleScheduleInterview(e: React.FormEvent) {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('interviews')
        .insert({
          ...newInterview,
          created_by: user?.id,
          status: 'scheduled',
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('candidates')
        .update({ status: 'interviewing' })
        .eq('id', newInterview.candidate_id);

      toast({
        title: 'Success',
        description: 'Interview scheduled successfully',
      });

      setDialogOpen(false);
      setNewInterview({
        candidate_id: '',
        job_position_id: '',
        scheduled_at: '',
        duration_minutes: 30,
        type: 'voice_ai',
      });
      fetchInterviews();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to schedule interview',
        variant: 'destructive',
      });
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Interviews</h1>
          <p className="text-slate-600 mt-2">
            Schedule and manage candidate interviews
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
              <DialogDescription>
                Schedule a new interview for a candidate
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="candidate_id">Candidate *</Label>
                <Select
                  value={newInterview.candidate_id}
                  onValueChange={(value) =>
                    setNewInterview({ ...newInterview, candidate_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        {candidate.full_name} ({candidate.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_position_id">Position *</Label>
                <Select
                  value={newInterview.job_position_id}
                  onValueChange={(value) =>
                    setNewInterview({ ...newInterview, job_position_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_at">Date & Time *</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    required
                    value={newInterview.scheduled_at}
                    onChange={(e) =>
                      setNewInterview({ ...newInterview, scheduled_at: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    min="15"
                    step="15"
                    value={newInterview.duration_minutes}
                    onChange={(e) =>
                      setNewInterview({
                        ...newInterview,
                        duration_minutes: parseInt(e.target.value) || 30,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Interview Type *</Label>
                <Select
                  value={newInterview.type}
                  onValueChange={(value) =>
                    setNewInterview({ ...newInterview, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voice_ai">AI Voice Interview</SelectItem>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule Interview</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No interviews scheduled yet. Schedule your first interview to get started.
                  </TableCell>
                </TableRow>
              ) : (
                interviews.map((interview) => {
                  const TypeIcon = typeIcons[interview.type as keyof typeof typeIcons];
                  return (
                    <TableRow key={interview.id}>
                      <TableCell>
                        <div className="font-medium">{interview.candidates.full_name}</div>
                        <div className="text-sm text-slate-600">{interview.candidates.email}</div>
                      </TableCell>
                      <TableCell>{interview.job_positions.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="h-4 w-4 text-slate-400" />
                          <div>
                            <div>{format(new Date(interview.scheduled_at), 'MMM dd, yyyy')}</div>
                            <div className="text-slate-600">
                              {format(new Date(interview.scheduled_at), 'hh:mm a')}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4 text-slate-400" />
                          {interview.duration_minutes} min
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-slate-600" />
                          <span className="text-sm capitalize">
                            {interview.type.replace('_', ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[interview.status as keyof typeof statusColors]}>
                          {interview.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
