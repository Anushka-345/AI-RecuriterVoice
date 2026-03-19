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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  category: string;
  question_text: string;
  difficulty_level: string;
  is_active: boolean;
  order_number: number | null;
  expected_answer: string | null;
  scoring_criteria: string | null;
}

const categoryColors = {
  technical: 'bg-blue-100 text-blue-800',
  behavioral: 'bg-purple-100 text-purple-800',
  situational: 'bg-green-100 text-green-800',
  cultural: 'bg-orange-100 text-orange-800',
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const { user } = useAuth();
  const { toast } = useToast();

  const [newQuestion, setNewQuestion] = useState({
    category: 'technical',
    question_text: '',
    expected_answer: '',
    scoring_criteria: '',
    difficulty_level: 'medium',
    order_number: 0,
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .order('order_number', { ascending: true });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch questions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .insert({
          ...newQuestion,
          created_by: user?.id,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Question added successfully',
      });

      setDialogOpen(false);
      setNewQuestion({
        category: 'technical',
        question_text: '',
        expected_answer: '',
        scoring_criteria: '',
        difficulty_level: 'medium',
        order_number: 0,
      });
      fetchQuestions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add question',
        variant: 'destructive',
      });
    }
  }

  async function handleDeleteQuestion(id: string) {
    try {
      const { error } = await supabase.from('interview_questions').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Question deleted successfully',
      });

      fetchQuestions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete question',
        variant: 'destructive',
      });
    }
  }

  const filteredQuestions =
    filterCategory === 'all'
      ? questions
      : questions.filter((q) => q.category === filterCategory);

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
          <h1 className="text-3xl font-bold text-slate-900">Interview Questions</h1>
          <p className="text-slate-600 mt-2">
            Manage your interview question bank for AI voice interviews
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Interview Question</DialogTitle>
              <DialogDescription>
                Create a new question for voice interviews
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={newQuestion.category}
                    onValueChange={(value) =>
                      setNewQuestion({ ...newQuestion, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="situational">Situational</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty_level">Difficulty</Label>
                  <Select
                    value={newQuestion.difficulty_level}
                    onValueChange={(value) =>
                      setNewQuestion({ ...newQuestion, difficulty_level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question_text">Question Text *</Label>
                <Textarea
                  id="question_text"
                  required
                  rows={3}
                  placeholder="Enter the interview question..."
                  value={newQuestion.question_text}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, question_text: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_answer">Expected Answer</Label>
                <Textarea
                  id="expected_answer"
                  rows={3}
                  placeholder="What should the candidate cover in their answer?"
                  value={newQuestion.expected_answer}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, expected_answer: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scoring_criteria">Scoring Criteria</Label>
                <Textarea
                  id="scoring_criteria"
                  rows={2}
                  placeholder="How should this answer be evaluated?"
                  value={newQuestion.scoring_criteria}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, scoring_criteria: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_number">Order Number</Label>
                <Input
                  id="order_number"
                  type="number"
                  min="0"
                  value={newQuestion.order_number}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      order_number: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Question</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="behavioral">Behavioral</SelectItem>
            <SelectItem value="situational">Situational</SelectItem>
            <SelectItem value="cultural">Cultural</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredQuestions.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Questions Yet</h3>
            <p className="text-slate-600 mb-4">
              Add interview questions to build your question bank
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Question
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          categoryColors[question.category as keyof typeof categoryColors]
                        }
                      >
                        {question.category}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={
                          difficultyColors[
                            question.difficulty_level as keyof typeof difficultyColors
                          ]
                        }
                      >
                        {question.difficulty_level}
                      </Badge>
                      {question.order_number !== null && (
                        <Badge variant="outline">Order: {question.order_number}</Badge>
                      )}
                    </div>

                    <p className="text-lg font-medium text-slate-900">
                      {question.question_text}
                    </p>

                    {question.expected_answer && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs font-medium text-slate-700 mb-1">
                          Expected Answer:
                        </p>
                        <p className="text-sm text-slate-600">{question.expected_answer}</p>
                      </div>
                    )}

                    {question.scoring_criteria && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs font-medium text-slate-700 mb-1">
                          Scoring Criteria:
                        </p>
                        <p className="text-sm text-slate-600">{question.scoring_criteria}</p>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
