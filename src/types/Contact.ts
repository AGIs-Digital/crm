export interface Tag {
  id: string;
  name: string;
  color: string;
  icon?: string;
  isSystemTag?: boolean;
  isPipelineTag?: boolean;
}

export interface TimeStampedEntry {
  timestamp: Date;
  text: string;
}

export interface Reminder {
  id: string;
  date: Date;
  note: string;
  created_at: Date;
}

export interface Contact {
  id: string;
  company_name: string; // firmenname
  salutation: string; // anrede
  first_name: string; // vorname
  last_name: string; // nachname
  phone: string; // telefonnummer
  email: string;
  notes: string; // notizen
  gespraechszusammenfassung: TimeStampedEntry[]; // gespraechszusammenfassungen
  tags: Tag[];
  status: "Lead" | "Kunde" | "Potenzial"; // Status des Kontakts
  is_vip: boolean; // VIP-Status
  reminders: Reminder[]; // Liste aller Wiedervorlagen
  reminder_date?: Date | null; // Datum für Wiedervorlage (deprecated, use reminders)
  reminder_note?: string; // Notiz zur Wiedervorlage (deprecated, use reminders)
  created_at: Date;
  updated_at: Date;
}

// For API requests
export interface ContactCreateRequest {
  company_name: string;
  salutation: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  notes?: string;
  status: "Lead" | "Kunde" | "Potenzial"; // Status des Kontakts
  is_vip: boolean; // VIP-Status
  reminder_date?: string | null; // ISO-String für Wiedervorlage
  reminder_note?: string; // Notiz zur Wiedervorlage
  tags?: string[];
}
