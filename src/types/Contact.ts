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
  reminder_date?: Date | null; // Datum für Wiedervorlage
  reminder_note?: string; // Notiz zur Wiedervorlage
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
  reminder_date?: string | null; // ISO-String für Wiedervorlage
  reminder_note?: string; // Notiz zur Wiedervorlage
  tags?: string[];
}
