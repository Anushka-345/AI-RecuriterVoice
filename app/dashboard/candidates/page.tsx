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
import { Plus, Search, Mail, Phone, Linkedin, FileText, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Candidate {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  resume_url: string | null;
  linkedin_url: string | null;
  current_position: string | null;
  years_experience: number;
  skills: string[];
  status: string;
  ai_score: number | null;
  created_at: string;
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  screening: 'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-green-100 text-green-800',
  interviewing: 'bg-purple-100 text-purple-800',
  hired: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [newCandidate, setNewCandidate] = useState({
    email: '',
    full_name: '',
    phone: '',
    linkedin_url: '',
    current_position: '',
    years_experience: 0,
    skills: '',
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    let filtered = candidates;

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.current_position?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredCandidates(filtered);
  }, [searchQuery, statusFilter, candidates]);

  async function fetchCandidates() {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
      setFilteredCandidates(data || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch candidates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCandidate(e: React.FormEvent) {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('candidates')
        .insert({
          ...newCandidate,
          skills: newCandidate.skills.split(',').map((s) => s.trim()).filter(Boolean),
          created_by: user?.id,
          status: 'new',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Candidate added successfully',
      });

      setDialogOpen(false);
      setNewCandidate({
        email: '',
        full_name: '',
        phone: '',
        linkedin_url: '',
        current_position: '',
        years_experience: 0,
        skills: '',
      });
      fetchCandidates();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add candidate',
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
          <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
          <p className="text-slate-600 mt-2">
            Manage and track all candidates in your recruitment pipeline
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
              <DialogDescription>
                Enter candidate information to add them to your pipeline
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    required
                    value={newCandidate.full_name}
                    onChange={(e) =>
                      setNewCandidate({ ...newCandidate, full_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={newCandidate.email}
                    onChange={(e) =>
                      setNewCandidate({ ...newCandidate, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newCandidate.phone}
                    onChange={(e) =>
                      setNewCandidate({ ...newCandidate, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="years_experience">Years of Experience</Label>
                  <Input
                    id="years_experience"
                    type="number"
                    min="0"
                    value={newCandidate.years_experience}
                    onChange={(e) =>
                      setNewCandidate({
                        ...newCandidate,
                        years_experience: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_position">Current Position</Label>
                <Input
                  id="current_position"
                  value={newCandidate.current_position}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, current_position: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn Profile URL</Label>
                <Input
                  id="linkedin_url"
                  value={newCandidate.linkedin_url}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, linkedin_url: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  placeholder="e.g., JavaScript, React, Node.js"
                  value={newCandidate.skills}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, skills: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Candidate</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                    No candidates found. Add your first candidate to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.full_name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span className="text-slate-600">{candidate.email}</span>
                        </div>
                        {candidate.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span className="text-slate-600">{candidate.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{candidate.current_position || '-'}</TableCell>
                    <TableCell>{candidate.years_experience} years</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{candidate.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[candidate.status as keyof typeof statusColors]}>
                        {candidate.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {candidate.ai_score ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{candidate.ai_score}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {candidate.linkedin_url && (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {candidate.resume_url && (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
