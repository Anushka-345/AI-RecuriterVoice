'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Briefcase, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  experience_required: number;
  status: string;
  created_at: string;
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  closed: 'bg-red-100 text-red-800',
  'on-hold': 'bg-yellow-100 text-yellow-800',
};

export default function PositionsPage() {
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [newPosition, setNewPosition] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    experience_required: 0,
  });

  useEffect(() => {
    fetchPositions();
  }, []);

  async function fetchPositions() {
    try {
      const { data, error } = await supabase
        .from('job_positions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPositions(data || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch positions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddPosition(e: React.FormEvent) {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('job_positions')
        .insert({
          ...newPosition,
          requirements: newPosition.requirements.split('\n').filter(Boolean),
          created_by: user?.id,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Job position created successfully',
      });

      setDialogOpen(false);
      setNewPosition({
        title: '',
        department: '',
        description: '',
        requirements: '',
        experience_required: 0,
      });
      fetchPositions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create position',
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
          <h1 className="text-3xl font-bold text-slate-900">Job Positions</h1>
          <p className="text-slate-600 mt-2">
            Manage open positions and track hiring requirements
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Position
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Job Position</DialogTitle>
              <DialogDescription>
                Add a new job position to start recruiting candidates
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPosition} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    required
                    value={newPosition.title}
                    onChange={(e) =>
                      setNewPosition({ ...newPosition, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    required
                    value={newPosition.department}
                    onChange={(e) =>
                      setNewPosition({ ...newPosition, department: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  required
                  rows={4}
                  value={newPosition.description}
                  onChange={(e) =>
                    setNewPosition({ ...newPosition, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea
                  id="requirements"
                  rows={4}
                  placeholder="Bachelor's degree in Computer Science&#10;5+ years of experience&#10;Strong communication skills"
                  value={newPosition.requirements}
                  onChange={(e) =>
                    setNewPosition({ ...newPosition, requirements: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_required">Minimum Years of Experience</Label>
                <Input
                  id="experience_required"
                  type="number"
                  min="0"
                  value={newPosition.experience_required}
                  onChange={(e) =>
                    setNewPosition({
                      ...newPosition,
                      experience_required: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Position</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {positions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No positions yet</h3>
            <p className="text-slate-600 mb-4">
              Create your first job position to start recruiting
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Position
            </Button>
          </div>
        ) : (
          positions.map((position) => (
            <Card key={position.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      {position.title}
                    </h3>
                    <p className="text-sm text-slate-600">{position.department}</p>
                  </div>
                  <Badge className={statusColors[position.status as keyof typeof statusColors]}>
                    {position.status}
                  </Badge>
                </div>

                <p className="text-sm text-slate-600 line-clamp-3">
                  {position.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>{position.experience_required}+ years required</span>
                  </div>

                  {position.requirements.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-slate-700">Key Requirements:</p>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {position.requirements.slice(0, 3).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-slate-400 mt-0.5">•</span>
                            <span className="flex-1">{req}</span>
                          </li>
                        ))}
                        {position.requirements.length > 3 && (
                          <li className="text-slate-400">
                            +{position.requirements.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <Button variant="outline" className="w-full" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
