import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Tag } from "@/types/Contact";

// Import the shared tags array from the parent route
// In a real application, this would be a database
let availableTags: Tag[] = [
  { id: "1", name: "Kunde", color: "#3b82f6" },
  { id: "2", name: "Interessent", color: "#8b5cf6" },
  { id: "3", name: "Aktiv", color: "#22c55e" },
  { id: "4", name: "Inaktiv", color: "#ef4444" },
  { id: "5", name: "VIP", color: "#f59e0b" },
];

/**
 * GET /api/kontakte/tags
 * Returns all available tags
 */
export async function GET() {
  return NextResponse.json(availableTags);
}

/**
 * POST /api/kontakte/tags
 * Creates a new tag
 *
 * Expected JSON structure:
 * {
 *   "name": "New Tag Name",
 *   "color": "#hexcolor"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.color) {
      return NextResponse.json(
        { error: "Name und Farbe sind erforderlich" },
        { status: 400 },
      );
    }

    // Check if tag with same name already exists
    const existingTag = availableTags.find(
      (tag) => tag.name.toLowerCase() === data.name.toLowerCase(),
    );

    if (existingTag) {
      return NextResponse.json(
        { error: `Ein Tag mit dem Namen '${data.name}' existiert bereits` },
        { status: 400 },
      );
    }

    // Create new tag
    const newTag: Tag = {
      id: uuidv4(),
      name: data.name.trim(),
      color: data.color,
    };

    // Add to tags array
    availableTags.push(newTag);

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Tags" },
      { status: 500 },
    );
  }
}
