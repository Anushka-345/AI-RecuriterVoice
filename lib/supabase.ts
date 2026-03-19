import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'recruiter' | 'interviewer';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      candidates: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          resume_url: string | null;
          linkedin_url: string | null;
          current_position: string | null;
          years_experience: number;
          skills: string[];
          status: 'new' | 'screening' | 'shortlisted' | 'interviewing' | 'hired' | 'rejected';
          ai_score: number | null;
          screening_notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['candidates']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['candidates']['Insert']>;
      };
      job_positions: {
        Row: {
          id: string;
          title: string;
          department: string;
          description: string;
          requirements: string[];
          experience_required: number;
          status: 'active' | 'closed' | 'on-hold';
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['job_positions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['job_positions']['Insert']>;
      };
      interviews: {
        Row: {
          id: string;
          candidate_id: string;
          job_position_id: string;
          interviewer_id: string | null;
          scheduled_at: string;
          duration_minutes: number;
          type: 'voice_ai' | 'video' | 'phone' | 'in-person';
          status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
          meeting_link: string | null;
          notification_sent: boolean;
          reminder_sent: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['interviews']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['interviews']['Insert']>;
      };
      interview_reports: {
        Row: {
          id: string;
          interview_id: string;
          candidate_id: string;
          overall_score: number;
          technical_score: number | null;
          communication_score: number | null;
          cultural_fit_score: number | null;
          sentiment_analysis: 'positive' | 'neutral' | 'negative' | null;
          strengths: string[];
          weaknesses: string[];
          recommendation: 'strongly-recommend' | 'recommend' | 'neutral' | 'not-recommend' | 'strongly-not-recommend';
          detailed_feedback: string | null;
          report_data: any;
          generated_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['interview_reports']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['interview_reports']['Insert']>;
      };
    };
  };
};
