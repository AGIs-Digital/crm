import { Contact, Tag } from "@/types/Contact";

/**
 * Converts an array of contacts to a CSV string
 * @param contacts Array of contacts to convert
 * @returns CSV string with headers and data rows
 */
export function contactsToCSV(contacts: Contact[]): string {
  // Define CSV headers
  const headers = [
    "Firmenname",
    "Anrede",
    "Vorname",
    "Nachname",
    "Telefonnummer",
    "E-Mail-Adresse",
    "Notizen",
    "Tags",
    "Erstellt am",
    "Aktualisiert am",
  ];

  // Convert headers to CSV row
  const headerRow = headers.join(",");

  // Convert each contact to a CSV row
  const rows = contacts.map((contact) => {
    // Format tags as semicolon-separated string
    const tagsString = contact.tags.map((tag) => tag.name).join(";");

    // Format dates
    const createdAt =
      contact.created_at instanceof Date
        ? contact.created_at.toLocaleDateString("de-DE")
        : new Date(contact.created_at).toLocaleDateString("de-DE");

    const updatedAt =
      contact.updated_at instanceof Date
        ? contact.updated_at.toLocaleDateString("de-DE")
        : new Date(contact.updated_at).toLocaleDateString("de-DE");

    // Escape fields that might contain commas
    const escapeCsvField = (field: string) => {
      if (
        field &&
        (field.includes(",") || field.includes('"') || field.includes("\n"))
      ) {
        return `"${field.replace(/"/g, '""')}"`; // Escape quotes with double quotes
      }
      return field || "";
    };

    // Create row with all contact fields
    return [
      escapeCsvField(contact.company_name),
      escapeCsvField(contact.salutation),
      escapeCsvField(contact.first_name),
      escapeCsvField(contact.last_name),
      escapeCsvField(contact.phone),
      escapeCsvField(contact.email),
      escapeCsvField(contact.notes),
      escapeCsvField(tagsString),
      createdAt,
      updatedAt,
    ].join(",");
  });

  // Combine header and data rows
  return [headerRow, ...rows].join("\n");
}

/**
 * Triggers a download of a CSV file in the browser
 * @param csvContent CSV content as string
 * @param filename Name of the file to download
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a download URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a temporary link element
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  // Add the link to the DOM, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}
