// Database service layer - abstracts database operations
// Currently uses mock data, will be replaced with Supabase calls

import { Contact } from "@/types/Contact";
import { Pipeline, Todo, KanbanCard } from "@/types/Kanban";
import { mockContacts } from "@/data/mockContacts";
import { supabase, TABLES } from "./supabase";

// Mock data flag - set to false when Supabase is ready
const USE_MOCK_DATA = true;

// Contact operations
export class ContactService {
  static async getAll(): Promise<Contact[]> {
    if (USE_MOCK_DATA) {
      return mockContacts.map((contact) => ({
        ...contact,
        status: contact.status || "Lead",
        is_vip: contact.is_vip || false,
        reminders: contact.reminders || [],
      }));
    }

    // TODO: Replace with Supabase query
    const { data, error } = await supabase.from(TABLES.CONTACTS).select("*");

    if (error) throw error;
    return data || [];
  }

  static async getById(id: string): Promise<Contact | null> {
    if (USE_MOCK_DATA) {
      const contact = mockContacts.find((c) => c.id === id);
      return contact
        ? {
            ...contact,
            status: contact.status || "Lead",
            is_vip: contact.is_vip || false,
            reminders: contact.reminders || [],
          }
        : null;
    }

    // TODO: Replace with Supabase query
    const { data, error } = await supabase
      .from(TABLES.CONTACTS)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(
    contact: Omit<Contact, "id" | "created_at" | "updated_at">,
  ): Promise<Contact> {
    if (USE_MOCK_DATA) {
      const newContact: Contact = {
        ...contact,
        id: `contact-${Date.now()}`,
        created_at: new Date(),
        updated_at: new Date(),
      };
      return newContact;
    }

    // TODO: Replace with Supabase query
    const { data, error } = await supabase
      .from(TABLES.CONTACTS)
      .insert([contact])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<Contact>): Promise<Contact> {
    if (USE_MOCK_DATA) {
      const contact = await this.getById(id);
      if (!contact) throw new Error("Contact not found");

      return {
        ...contact,
        ...updates,
        updated_at: new Date(),
      };
    }

    // TODO: Replace with Supabase query
    const { data, error } = await supabase
      .from(TABLES.CONTACTS)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

// Pipeline operations
export class PipelineService {
  static async getAll(): Promise<Pipeline[]> {
    if (USE_MOCK_DATA) {
      // Return mock pipelines from Kanban page
      return [
        {
          id: "1",
          name: "Neue Leads",
          color: "#3b82f6",
          order: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "2",
          name: "Qualifiziert",
          color: "#8b5cf6",
          order: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "3",
          name: "Angebot erstellt",
          color: "#f59e0b",
          order: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "4",
          name: "Verhandlung",
          color: "#ef4444",
          order: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "5",
          name: "Abgeschlossen",
          color: "#22c55e",
          order: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
    }

    // TODO: Replace with Supabase query
    const { data, error } = await supabase
      .from(TABLES.PIPELINES)
      .select("*")
      .order("order");

    if (error) throw error;
    return data || [];
  }

  static async create(
    pipeline: Omit<Pipeline, "id" | "created_at" | "updated_at">,
  ): Promise<Pipeline> {
    if (USE_MOCK_DATA) {
      return {
        ...pipeline,
        id: `pipeline-${Date.now()}`,
        created_at: new Date(),
        updated_at: new Date(),
      };
    }

    // TODO: Replace with Supabase query
    const { data, error } = await supabase
      .from(TABLES.PIPELINES)
      .insert([pipeline])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

// Todo operations
export class TodoService {
  static async getAll(): Promise<Todo[]> {
    if (USE_MOCK_DATA) {
      return [
        {
          id: "todo-1",
          title: "Angebot erstellen",
          description: "Premium-Paket Angebot für Musterfirma erstellen",
          status: "open",
          priority: "high",
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "todo-2",
          title: "Lizenz-Angebot vorbereiten",
          description: "50 Lizenzen für TechSolutions AG kalkulieren",
          status: "in_progress",
          priority: "high",
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "todo-3",
          title: "Nachfassgespräch führen",
          description: "Budget und Anforderungen mit StartUp Inc. klären",
          status: "open",
          priority: "medium",
          due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
    }

    // TODO: Replace with Supabase query
    const { data, error } = await supabase.from(TABLES.TODOS).select("*");

    if (error) throw error;
    return data || [];
  }
}

// Kanban Card operations
export class KanbanService {
  static async getCards(): Promise<KanbanCard[]> {
    if (USE_MOCK_DATA) {
      const contacts = await ContactService.getAll();
      const todos = await TodoService.getAll();

      // Create mock kanban cards linking contacts and todos
      return [
        {
          id: "card-1",
          contact: contacts[0],
          todo: todos[0],
          pipelineId: "1",
          position: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "card-2",
          contact: contacts[1],
          todo: todos[1],
          pipelineId: "2",
          position: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "card-3",
          contact: contacts[2],
          todo: todos[2],
          pipelineId: "3",
          position: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
    }

    // TODO: Replace with Supabase query with joins
    const { data, error } = await supabase.from(TABLES.KANBAN_CARDS).select(`
        *,
        contact:contacts(*),
        todo:todos(*)
      `);

    if (error) throw error;
    return data || [];
  }

  static async updateCardPosition(
    cardId: string,
    pipelineId: string,
    position: number,
  ): Promise<void> {
    if (USE_MOCK_DATA) {
      // In mock mode, this would be handled by the component state
      return;
    }

    // TODO: Replace with Supabase query
    const { error } = await supabase
      .from(TABLES.KANBAN_CARDS)
      .update({
        pipeline_id: pipelineId,
        position,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cardId);

    if (error) throw error;
  }

  static async createCard(
    contactId: string,
    todoId: string,
    pipelineId: string,
  ): Promise<KanbanCard> {
    if (USE_MOCK_DATA) {
      const contact = await ContactService.getById(contactId);
      const todos = await TodoService.getAll();
      const todo = todos.find((t) => t.id === todoId);

      if (!contact || !todo) {
        throw new Error("Contact or Todo not found");
      }

      return {
        id: `card-${Date.now()}`,
        contact,
        todo,
        pipelineId,
        position: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };
    }

    // TODO: Replace with Supabase query
    const { data, error } = await supabase
      .from(TABLES.KANBAN_CARDS)
      .insert([
        {
          contact_id: contactId,
          todo_id: todoId,
          pipeline_id: pipelineId,
          position: 0,
        },
      ])
      .select(
        `
        *,
        contact:contacts(*),
        todo:todos(*)
      `,
      )
      .single();

    if (error) throw error;
    return data;
  }
}
