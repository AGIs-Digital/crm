"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Download,
  Upload,
  X,
  Loader2,
  Info,
  Check,
  AlertCircle,
} from "lucide-react";
import { ContactTable } from "@/components/kontakte/ContactTable";
import { ContactForm } from "@/components/kontakte/ContactForm";
import { mockContacts } from "@/data/mockContacts";
import { generateRandomContacts } from "@/lib/generateDummyContacts";
import {
  Contact,
  TimeStampedEntry,
  Tag,
  ContactCreateRequest,
} from "@/types/Contact";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function KontaktePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // State for available tags
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  // CSV Import states
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvPreviewData, setCsvPreviewData] = useState<string[][]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [importStep, setImportStep] = useState<
    "upload" | "mapping" | "preview" | "importing"
  >("upload");
  const [importErrors, setImportErrors] = useState<Record<number, string[]>>(
    {},
  );
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch tags from API
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/kontakte/tags");
      if (!response.ok) {
        throw new Error(`Fehler beim Laden der Tags: ${response.status}`);
      }
      const data = await response.json();
      setAvailableTags(data);
    } catch (err) {
      console.error("Fehler beim Laden der Tags:", err);
      // Fallback to extracting tags from contacts if API fails
      const extractedTags =
        contacts.length > 0
          ? contacts
              .flatMap((contact) => contact.tags)
              .filter(
                (tag, index, self) =>
                  self.findIndex((t) => t.id === tag.id) === index,
              )
          : [];
      setAvailableTags(extractedTags);
    }
  };

  // Filter contacts based on search term
  const filteredContacts = contacts.filter((contact) => {
    const searchString =
      `${contact.company_name} ${contact.first_name} ${contact.last_name} ${contact.email}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Handle edit contact
  const handleEditContact = (contact: Contact) => {
    setCurrentContact(contact);
    setIsFormOpen(true);
  };

  // Handle delete contact
  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter((contact) => contact.id !== contactId));
  };

  // Handle new contact
  const handleNewContact = () => {
    setCurrentContact(undefined);
    setIsFormOpen(true);
  };

  // Handle add tag to contacts
  const handleAddTagToContacts = async (
    contactIds: string[],
    tagIds: string[],
  ) => {
    try {
      // Get the selected contacts
      const selectedContacts = contacts.filter((contact) =>
        contactIds.includes(contact.id),
      );

      // Get the selected tags
      const selectedTags = availableTags.filter((tag) =>
        tagIds.includes(tag.id),
      );

      // Update each contact with the new tags
      const updatedContacts = selectedContacts.map((contact) => {
        // Get existing tag IDs
        const existingTagIds = contact.tags.map((tag) => tag.id);

        // Add new tags that don't already exist on the contact
        const newTags = [
          ...contact.tags,
          ...selectedTags.filter((tag) => !existingTagIds.includes(tag.id)),
        ];

        return {
          ...contact,
          tags: newTags,
          updated_at: new Date(),
        };
      });

      // Update the contacts in state
      setContacts(
        contacts.map((contact) => {
          const updatedContact = updatedContacts.find(
            (uc) => uc.id === contact.id,
          );
          return updatedContact || contact;
        }),
      );

      return true;
    } catch (error) {
      console.error("Fehler beim Hinzufügen von Tags:", error);
      toast({
        title: "Fehler beim Hinzufügen von Tags",
        description:
          error instanceof Error
            ? error.message
            : "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle create new tag
  const handleCreateTag = async (name: string, color: string): Promise<Tag> => {
    try {
      const response = await fetch("/api/kontakte/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Erstellen des Tags");
      }

      const newTag = await response.json();

      // Update available tags
      setAvailableTags((prev) => [...prev, newTag]);

      return newTag;
    } catch (error) {
      console.error("Fehler beim Erstellen des Tags:", error);
      throw error;
    }
  };

  // Handle save contact
  const handleSaveContact = (contactData: Partial<Contact>) => {
    // Refresh tags in case new tags were created during contact creation/editing
    fetchTags();
    if (currentContact) {
      // Update existing contact
      setContacts(
        contacts.map((contact) =>
          contact.id === currentContact.id
            ? {
                ...currentContact,
                ...contactData,
                gespraechszusammenfassung:
                  contactData.gespraechszusammenfassung ||
                  currentContact.gespraechszusammenfassung,
                updated_at: new Date(),
              }
            : contact,
        ),
      );
      toast({
        title: "Kontakt aktualisiert",
        description: "Der Kontakt wurde erfolgreich aktualisiert.",
        variant: "success",
      });
    } else {
      // For new contacts, the API call is handled in ContactForm
      // We just need to add the new contact to our local state
      if (contactData.id) {
        const newContact = contactData as Contact;
        setContacts([...contacts, newContact]);
        toast({
          title: "Kontakt erstellt",
          description: "Der Kontakt wurde erfolgreich erstellt.",
          variant: "success",
        });
      }
    }
    setIsFormOpen(false);
  };

  // Handle close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentContact(undefined);
    // Refresh tags when form is closed in case new tags were created
    fetchTags();
  };

  // CSV Import functions
  const handleImportContacts = () => {
    setIsImportDialogOpen(true);
    setImportStep("upload");
    setCsvFile(null);
    setCsvData([]);
    setCsvHeaders([]);
    setCsvPreviewData([]);
    setFieldMapping({});
    setImportErrors({});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (csvText: string) => {
    // Simple CSV parser (can be replaced with a library for more robust parsing)
    const lines = csvText.split("\n").filter((line) => line.trim() !== "");
    const headers = lines[0].split(",").map((header) => header.trim());
    const data = lines
      .slice(1)
      .map((line) => line.split(",").map((cell) => cell.trim()));

    setCsvHeaders(headers);
    setCsvData(data);
    setCsvPreviewData(data.slice(0, 5)); // Show first 5 rows for preview

    // Create initial field mapping based on header names
    const initialMapping: Record<string, string> = {};
    const fieldMap: Record<string, string> = {
      Firmenname: "company_name",
      Anrede: "salutation",
      Vorname: "first_name",
      Nachname: "last_name",
      Telefonnummer: "phone",
      Telefon: "phone",
      "E-Mail": "email",
      "E-Mail-Adresse": "email",
      Notizen: "notes",
      Tags: "tags",
    };

    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase();
      const matchedField = Object.keys(fieldMap).find((key) =>
        normalizedHeader.includes(key.toLowerCase()),
      );

      if (matchedField) {
        initialMapping[index.toString()] = fieldMap[matchedField];
      }
    });

    setFieldMapping(initialMapping);
    setImportStep("mapping");
  };

  const handleFieldMappingChange = (headerIndex: string, fieldName: string) => {
    setFieldMapping((prev) => ({
      ...prev,
      [headerIndex]: fieldName,
    }));
  };

  const validateImportData = () => {
    const errors: Record<number, string[]> = {};
    const requiredFields = ["first_name", "last_name", "email"];
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Create a reverse mapping from field name to header index
    const reverseMapping: Record<string, number> = {};
    Object.entries(fieldMapping).forEach(([index, field]) => {
      reverseMapping[field] = parseInt(index);
    });

    // Check if required fields are mapped
    const missingRequiredFields = requiredFields.filter(
      (field) => !Object.values(fieldMapping).includes(field),
    );

    if (missingRequiredFields.length > 0) {
      toast({
        title: "Fehlende Pflichtfelder",
        description: `Bitte ordnen Sie die folgenden Pflichtfelder zu: ${missingRequiredFields.join(", ")}`,
        variant: "destructive",
      });
      return false;
    }

    // Validate each row
    csvData.forEach((row, rowIndex) => {
      const rowErrors: string[] = [];

      // Check required fields
      requiredFields.forEach((field) => {
        const fieldIndex = reverseMapping[field];
        if (
          fieldIndex !== undefined &&
          (!row[fieldIndex] || row[fieldIndex].trim() === "")
        ) {
          rowErrors.push(`Zeile ${rowIndex + 2}: ${field} ist erforderlich`);
        }
      });

      // Validate email format
      const emailFieldIndex = reverseMapping["email"];
      if (
        emailFieldIndex !== undefined &&
        row[emailFieldIndex] &&
        !emailRegex.test(row[emailFieldIndex])
      ) {
        rowErrors.push(`Zeile ${rowIndex + 2}: Ungültiges E-Mail-Format`);
      }

      if (rowErrors.length > 0) {
        errors[rowIndex] = rowErrors;
      }
    });

    setImportErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePreviewImport = () => {
    if (validateImportData()) {
      setImportStep("preview");
    }
  };

  const processImport = async () => {
    setIsImporting(true);
    setImportStep("importing");

    try {
      // Create a reverse mapping from field name to header index
      const reverseMapping: Record<string, number> = {};
      Object.entries(fieldMapping).forEach(([index, field]) => {
        reverseMapping[field] = parseInt(index);
      });

      const importedContacts: ContactCreateRequest[] = csvData.map((row) => {
        const contact: Partial<ContactCreateRequest> = {};

        Object.entries(reverseMapping).forEach(([field, index]) => {
          if (field === "tags") {
            // Handle tags specially - they should be split by semicolon
            if (row[index]) {
              contact[field as keyof ContactCreateRequest] = row[index]
                .split(";")
                .map((tag) => tag.trim());
            }
          } else if (
            field !== "id" &&
            field !== "created_at" &&
            field !== "updated_at" &&
            field !== "gespraechszusammenfassung"
          ) {
            // Skip fields that shouldn't be imported directly
            contact[field as keyof ContactCreateRequest] = row[index];
          }
        });

        return contact as ContactCreateRequest;
      });

      // In a real application, you would send these to your API
      // For now, we'll just add them to the local state
      const newContacts = await Promise.all(
        importedContacts.map(async (contactData) => {
          try {
            const response = await fetch("/api/kontakte", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(contactData),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(
                errorData.error || "Fehler beim Erstellen des Kontakts",
              );
            }

            return await response.json();
          } catch (error) {
            console.error("Fehler beim Importieren des Kontakts:", error);
            throw error;
          }
        }),
      );

      // Add the new contacts to the state
      setContacts((prev) => [...prev, ...newContacts]);

      toast({
        title: "Import erfolgreich",
        description: `${newContacts.length} Kontakte wurden erfolgreich importiert.`,
        variant: "success",
      });

      setIsImportDialogOpen(false);
    } catch (error) {
      console.error("Fehler beim Importieren der Kontakte:", error);
      toast({
        title: "Import fehlgeschlagen",
        description:
          error instanceof Error
            ? error.message
            : "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Handle export contacts
  const handleExportContacts = (contactIds?: string[]) => {
    try {
      // If contactIds is provided, export only those contacts
      const contactsToExport = contactIds
        ? contacts.filter((contact) => contactIds.includes(contact.id))
        : filteredContacts;

      // Check if there are contacts to export
      if (contactsToExport.length === 0) {
        toast({
          title: "Keine Kontakte zum Exportieren",
          description:
            "Es sind keine Kontakte vorhanden, die exportiert werden können.",
          variant: "destructive",
        });
        return;
      }

      // Import CSV utility functions
      import("@/lib/csvUtils").then(({ contactsToCSV, downloadCSV }) => {
        // Generate CSV content from contacts
        const csvContent = contactsToCSV(contactsToExport);

        // Generate filename with current date
        const date = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
        const filename = `kontakte_export_${date}.csv`;

        // Trigger download
        downloadCSV(csvContent, filename);

        // Show success message
        toast({
          title: "Export erfolgreich",
          description: `${contactsToExport.length} Kontakte wurden erfolgreich exportiert.`,
          variant: "success",
        });
      });
    } catch (error) {
      console.error("Fehler beim Exportieren der Kontakte:", error);
      toast({
        title: "Export fehlgeschlagen",
        description:
          error instanceof Error
            ? error.message
            : "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
    }
  };

  // Add dummy contacts for testing
  const addDummyContacts = () => {
    // Extract tags from existing contacts or use default tags
    const extractedTags =
      contacts.length > 0
        ? contacts
            .flatMap((contact) => contact.tags)
            .filter(
              (tag, index, self) =>
                self.findIndex((t) => t.id === tag.id) === index,
            )
        : [
            { id: "1", name: "Kunde", color: "#3b82f6" },
            { id: "2", name: "Interessent", color: "#8b5cf6" },
            { id: "3", name: "Aktiv", color: "#22c55e" },
            { id: "4", name: "Inaktiv", color: "#ef4444" },
            { id: "5", name: "VIP", color: "#f59e0b" },
          ];

    // Generate 20 random contacts
    const dummyContacts = generateRandomContacts(20, extractedTags);

    // Add to existing contacts
    setContacts((prevContacts) => [...prevContacts, ...dummyContacts]);

    toast({
      title: "Dummy-Kontakte hinzugefügt",
      description: "20 zufällige Kontakte wurden erfolgreich hinzugefügt.",
      variant: "success",
    });
  };

  // Fetch contacts from API
  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Add a small delay to simulate network latency in development
      // This helps with testing pagination. Remove in production.
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const response = await fetch("/api/kontakte");
      if (!response.ok) {
        throw new Error(`Fehler beim Laden der Kontakte: ${response.status}`);
      }
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ein unbekannter Fehler ist aufgetreten",
      );
      console.error("Fehler beim Laden der Kontakte:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load contacts and tags on component mount
  useEffect(() => {
    fetchContacts();
    fetchTags();
  }, []);

  return (
    <div className="bg-background p-6 h-full">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Kontakte durchsuchen..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="default" onClick={handleNewContact}>
            Neuer Kontakt
          </Button>
          <Button variant="outline" onClick={addDummyContacts}>
            20 Dummy-Kontakte
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleImportContacts}
            >
              <Upload className="h-4 w-4" />
              <span>CSV Import</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={() => {
                // Open a new dialog with CSV format info
                const newDialog = document.createElement("dialog");
                newDialog.className =
                  "fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm";
                newDialog.innerHTML = `
                  <div class="bg-background border rounded-lg shadow-lg max-w-md w-full p-6 relative">
                    <div class="flex flex-col space-y-1.5 mb-4">
                      <h2 class="text-lg font-semibold">CSV-Format Beispiel</h2>
                      <p class="text-sm text-muted-foreground">Verwenden Sie dieses Format für den CSV-Import</p>
                    </div>
                    <div class="space-y-4 mt-2">
                      <div class="bg-muted p-4 rounded-md">
                        <p class="font-medium mb-2 text-sm">Spaltenüberschriften:</p>
                        <pre class="text-xs overflow-x-auto whitespace-pre-wrap">
                          Firmenname, Anrede, Vorname, Nachname, Telefonnummer, E-Mail-Adresse, Notizen, Tags
                        </pre>
                      </div>
                      <div class="bg-muted p-4 rounded-md">
                        <p class="font-medium mb-2 text-sm">Beispieldaten:</p>
                        <pre class="text-xs overflow-x-auto whitespace-pre-wrap">
                          Musterfirma GmbH, Herr, Max, Mustermann, +49 123 4567890, max@beispiel.de, Rückruf vereinbart, Kunde;VIP
                        </pre>
                      </div>
                      <div class="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md mt-2">
                        <div class="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4"/>
                            <path d="M12 8h.01"/>
                          </svg>
                          <h3 class="text-sm font-medium">Hinweis zu Tags</h3>
                        </div>
                        <p class="text-xs mt-1">Tags können mit Semikolon (;) getrennt werden, z.B. "Kunde;VIP"</p>
                      </div>
                    </div>
                    <button class="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2" id="closeDialogBtn">Schließen</button>
                  </div>
                `;
                document.body.appendChild(newDialog);
                newDialog.showModal();

                // Add event listener for the close button
                const closeButton = newDialog.querySelector("#closeDialogBtn");
                if (closeButton) {
                  closeButton.addEventListener("click", () => {
                    newDialog.close();
                    document.body.removeChild(newDialog);
                  });
                }

                // Close when clicking outside the dialog
                newDialog.addEventListener("click", (e) => {
                  if (e.target === newDialog) {
                    newDialog.close();
                    document.body.removeChild(newDialog);
                  }
                });
              }}
            >
              <Info className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExportContacts}
          >
            <Download className="h-4 w-4" />
            <span>CSV Export</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Kontakte werden geladen...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchContacts}>
            Erneut versuchen
          </Button>
        </div>
      ) : (
        <ContactTable
          contacts={filteredContacts}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onExport={handleExportContacts}
          availableTags={availableTags}
          onAddTag={handleAddTagToContacts}
          onCreateTag={handleCreateTag}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentContact ? "Kontakt bearbeiten" : "Neuer Kontakt"}
            </DialogTitle>
          </DialogHeader>
          <ContactForm
            contact={currentContact}
            onSave={handleSaveContact}
            onCancel={handleCloseForm}
            availableTags={availableTags}
          />
        </DialogContent>
      </Dialog>

      {/* CSV Import Dialog */}
      <Dialog
        open={isImportDialogOpen}
        onOpenChange={(open) => {
          if (!isImporting) setIsImportDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Kontakte importieren</DialogTitle>
            <DialogDescription>
              Importieren Sie Ihre Kontakte aus einer CSV-Datei.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={importStep} className="w-full">
            {/* Upload Step */}
            <TabsContent value="upload" className="space-y-4 mt-4">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  CSV-Datei hochladen
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Ziehen Sie eine CSV-Datei hierher oder klicken Sie, um eine
                  Datei auszuwählen.
                </p>
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  Datei auswählen
                </Button>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>CSV-Format</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">
                    Ihre CSV-Datei sollte folgende Spalten enthalten:
                  </p>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    Firmenname, Anrede, Vorname, Nachname, Telefonnummer,
                    E-Mail-Adresse, Notizen, Tags
                  </pre>
                  <p className="mt-2 text-xs">
                    Tags können mit Semikolon (;) getrennt werden, z.B.
                    "Kunde;VIP"
                  </p>
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Mapping Step */}
            <TabsContent value="mapping" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Spalten zuordnen</h3>
                <p className="text-sm text-muted-foreground">
                  Ordnen Sie die Spalten aus Ihrer CSV-Datei den entsprechenden
                  Feldern zu.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {csvHeaders.map((header, index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`field-${index}`}>{header}</Label>
                      <Select
                        value={fieldMapping[index.toString()] || ""}
                        onValueChange={(value) =>
                          handleFieldMappingChange(index.toString(), value)
                        }
                      >
                        <SelectTrigger id={`field-${index}`}>
                          <SelectValue placeholder="Feld auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Nicht importieren</SelectItem>
                          <SelectItem value="company_name">
                            Firmenname
                          </SelectItem>
                          <SelectItem value="salutation">Anrede</SelectItem>
                          <SelectItem value="first_name">Vorname</SelectItem>
                          <SelectItem value="last_name">Nachname</SelectItem>
                          <SelectItem value="phone">Telefonnummer</SelectItem>
                          <SelectItem value="email">E-Mail</SelectItem>
                          <SelectItem value="notes">Notizen</SelectItem>
                          <SelectItem value="tags">Tags</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <Alert variant="warning" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Hinweis</AlertTitle>
                  <AlertDescription>
                    Die Felder Vorname, Nachname und E-Mail sind Pflichtfelder
                    und müssen zugeordnet werden.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setImportStep("upload")}
                  >
                    Zurück
                  </Button>
                  <Button onClick={handlePreviewImport}>
                    Vorschau anzeigen
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Preview Step */}
            <TabsContent value="preview" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Vorschau der zu importierenden Daten
                </h3>
                <p className="text-sm text-muted-foreground">
                  Überprüfen Sie die Daten, bevor Sie den Import abschließen.
                </p>

                <div className="border rounded-md overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.entries(fieldMapping)
                          .filter(([_, field]) => field !== "")
                          .sort(([a], [b]) => parseInt(a) - parseInt(b))
                          .map(([index, field]) => (
                            <TableHead key={index}>
                              {field === "company_name"
                                ? "Firmenname"
                                : field === "salutation"
                                  ? "Anrede"
                                  : field === "first_name"
                                    ? "Vorname"
                                    : field === "last_name"
                                      ? "Nachname"
                                      : field === "phone"
                                        ? "Telefon"
                                        : field === "email"
                                          ? "E-Mail"
                                          : field === "notes"
                                            ? "Notizen"
                                            : field === "tags"
                                              ? "Tags"
                                              : field}
                            </TableHead>
                          ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvPreviewData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {Object.entries(fieldMapping)
                            .filter(([_, field]) => field !== "")
                            .sort(([a], [b]) => parseInt(a) - parseInt(b))
                            .map(([index, _]) => (
                              <TableCell key={index}>
                                {row[parseInt(index)]}
                              </TableCell>
                            ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {csvData.length > 5 && (
                  <p className="text-sm text-muted-foreground">
                    Zeigt 5 von {csvData.length} Einträgen an.
                  </p>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setImportStep("mapping")}
                  >
                    Zurück
                  </Button>
                  <Button onClick={processImport} disabled={isImporting}>
                    {isImporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importiere...
                      </>
                    ) : (
                      <>Import abschließen</>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Importing Step */}
            <TabsContent value="importing" className="space-y-4 mt-4">
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-medium">
                  Kontakte werden importiert
                </h3>
                <p className="text-sm text-muted-foreground">
                  Bitte warten Sie, während Ihre Kontakte importiert werden...
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            {importStep === "upload" && (
              <Button
                variant="outline"
                onClick={() => setIsImportDialogOpen(false)}
              >
                Abbrechen
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
