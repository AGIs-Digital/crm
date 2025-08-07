import { Contact } from "./Contact";

export interface Pipeline {
  id: string;
  name: string;
  color: string;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: "open" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  due_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface KanbanCard {
  id: string;
  contact: Contact;
  todo: Todo;
  pipelineId: string;
  position: number;
  created_at: Date;
  updated_at: Date;
}

export interface KanbanBoard {
  pipelines: Pipeline[];
  cards: KanbanCard[];
}

export interface PipelineCreateRequest {
  name: string;
  color: string;
}
