import { Contact, Tag } from "@/types/Contact";

// Mock tags
const tags: Tag[] = [
  { id: "1", name: "Kunde", color: "#3b82f6" },
  { id: "2", name: "Interessent", color: "#8b5cf6" },
  { id: "3", name: "Aktiv", color: "#22c55e" },
  { id: "4", name: "Inaktiv", color: "#ef4444" },
  { id: "5", name: "VIP", color: "#f59e0b" },
];

// Mock contacts data
export const mockContacts: Contact[] = [
  {
    id: "1",
    company_name: "Musterfirma GmbH",
    salutation: "Herr",
    first_name: "Max",
    last_name: "Mustermann",
    phone: "+49 123 4567890",
    email: "max.mustermann@musterfirma.de",
    notes: "Langjähriger Kunde mit mehreren Projekten",
    gespraechszusammenfassung: [
      {
        timestamp: new Date(2023, 5, 15, 10, 30),
        text: "Gespräch über neue Produktlinie. Interesse an Erweiterung.",
      },
      {
        timestamp: new Date(2023, 6, 2, 14, 0),
        text: "Nachfrage zu Preisen und Lieferzeiten. Angebot zugesandt.",
      },
    ],
    tags: [tags[0], tags[2]],
    created_at: new Date(2022, 1, 15),
    updated_at: new Date(2023, 6, 2),
  },
  {
    id: "2",
    company_name: "Beispiel AG",
    salutation: "Frau",
    first_name: "Erika",
    last_name: "Musterfrau",
    phone: "+49 987 6543210",
    email: "erika.musterfrau@beispiel.de",
    notes: "Neuer Kontakt aus Messe",
    gespraechszusammenfassung: [
      {
        timestamp: new Date(2023, 7, 10, 11, 15),
        text: "Erstkontakt auf der Fachmesse. Interesse an Produktkategorie A.",
      },
    ],
    tags: [tags[1]],
    created_at: new Date(2023, 7, 10),
    updated_at: new Date(2023, 7, 10),
  },
  {
    id: "3",
    company_name: "TechSolutions KG",
    salutation: "Herr",
    first_name: "Thomas",
    last_name: "Schmidt",
    phone: "+49 555 1234567",
    email: "t.schmidt@techsolutions.de",
    notes: "Technischer Ansprechpartner für Projekt XYZ",
    gespraechszusammenfassung: [
      {
        timestamp: new Date(2023, 4, 5, 9, 0),
        text: "Technisches Briefing zu Anforderungen. Wünscht detaillierte Spezifikation.",
      },
      {
        timestamp: new Date(2023, 4, 20, 15, 30),
        text: "Follow-up zu technischen Fragen. Spezifikation zugesandt.",
      },
      {
        timestamp: new Date(2023, 5, 10, 11, 0),
        text: "Feedback zur Spezifikation. Einige Anpassungen notwendig.",
      },
    ],
    tags: [tags[0], tags[4]],
    created_at: new Date(2023, 3, 15),
    updated_at: new Date(2023, 5, 10),
  },
];
