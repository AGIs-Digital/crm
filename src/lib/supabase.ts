// Supabase client configuration
// This will be used when connecting to your local Supabase instance

import { createClient } from "@supabase/supabase-js";

// TODO: Replace with your local Supabase URL and anon key when ready
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names (for consistency)
export const TABLES = {
  CONTACTS: "contacts",
  TODOS: "todos",
  PIPELINES: "pipelines",
  KANBAN_CARDS: "kanban_cards",
  TAGS: "tags",
  CONTACT_TAGS: "contact_tags",
  REMINDERS: "reminders",
} as const;

// Type definitions for Supabase tables
export interface DatabaseContact {
  id: string;
  company_name: string;
  salutation: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  notes?: string;
  status: "Lead" | "Kunde" | "Potenzial";
  is_vip: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTodo {
  id: string;
  title: string;
  description?: string;
  status: "open" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabasePipeline {
  id: string;
  name: string;
  color: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseKanbanCard {
  id: string;
  contact_id: string;
  todo_id: string;
  pipeline_id: string;
  position: number;
  created_at: string;
  updated_at: string;
}
