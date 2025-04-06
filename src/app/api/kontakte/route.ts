import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Contact, ContactCreateRequest, Tag } from "@/types/Contact";
import { mockContacts } from "@/data/mockContacts";

// In-memory storage for contacts
// Initialize with mock data
let contacts: Contact[] = [...mockContacts];

// In-memory storage for tags
// Initialize with default tags
let availableTags: Tag[] = [
  { id: "1", name: "Kunde", color: "#3b82f6" },
  { id: "2", name: "Interessent", color: "#8b5cf6" },
  { id: "3", name: "Aktiv", color: "#22c55e" },
  { id: "4", name: "Inaktiv", color: "#ef4444" },
  { id: "5", name: "VIP", color: "#f59e0b" },
];

/**
 * GET /api/kontakte
 * Returns all contacts or tags based on the pathname
 */
export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);

  if (pathname.endsWith("/tags")) {
    return NextResponse.json(availableTags);
  }

  return NextResponse.json(contacts);
}

/**
 * POST /api/kontakte
 * Creates a new contact
 *
 * Expected JSON structure for make.com or other external services:
 * {
 *   "company_name": "Firma GmbH",
 *   "salutation": "Herr",
 *   "first_name": "Max",
 *   "last_name": "Mustermann",
 *   "phone": "+49 123 456789",
 *   "email": "max@firma.de",
 *   "notes": "Wichtiger Kunde",
 *   "tags": ["1", "3"] // Array of tag IDs
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const data: ContactCreateRequest = await request.json();

    // Validate required fields
    if (!data.first_name || !data.last_name || !data.email) {
      return NextResponse.json(
        {
          error:
            "Pflichtfelder fehlen: Vorname, Nachname und E-Mail sind erforderlich",
        },
        { status: 400 },
      );
    }

    // Map tag IDs to full tag objects
    const tags = data.tags
      ? availableTags.filter((tag) => data.tags?.includes(tag.id))
      : [];

    // Create new contact
    const newContact: Contact = {
      id: uuidv4(),
      company_name: data.company_name,
      salutation: data.salutation,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      email: data.email,
      notes: data.notes || "",
      gespraechszusammenfassung: [],
      tags: tags,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Add to contacts array
    contacts.push(newContact);

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Kontakts" },
      { status: 500 },
    );
  }
}
