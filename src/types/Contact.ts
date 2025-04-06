export interface Tag {
  id: string;
  name: string;
  color: string;
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
  tags?: string[];
}
