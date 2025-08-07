"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Calendar,
  Building,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Contact } from "@/types/Contact";

// Mock deleted contacts
const mockDeletedContacts: (Contact & { deleted_at: Date })[] = [
  {
    id: "deleted-1",
    company_name: "Gelöschte Firma GmbH",
    salutation: "Herr",
    first_name: "Max",
    last_name: "Gelöscht",
    phone: "+49 123 4567890",
    email: "max@geloescht.de",
    notes: "Kontakt wurde versehentlich gelöscht",
    gespraechszusammenfassung: [],
    tags: [
      {
        id: "tag-1",
        name: "Kunde",
        color: "#3b82f6",
        isSystemTag: false,
        isPipelineTag: false,
      },
    ],
    status: "Lead",
    is_vip: false,
    reminders: [],
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    deleted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "deleted-2",
    company_name: "Alte Firma AG",
    salutation: "Frau",
    first_name: "Anna",
    last_name: "Alt",
    phone: "+49 987 6543210",
    email: "anna@alt.de",
    notes: "Nicht mehr aktiv",
    gespraechszusammenfassung: [],
    tags: [
      {
        id: "tag-2",
        name: "Inaktiv",
        color: "#ef4444",
        isSystemTag: false,
        isPipelineTag: false,
      },
    ],
    status: "Kunde",
    is_vip: true,
    reminders: [],
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    deleted_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "deleted-3",
    company_name: "Ehemalige Partner GmbH",
    salutation: "Herr",
    first_name: "Tom",
    last_name: "Ehemalig",
    phone: "+49 555 1234567",
    email: "tom@ehemalig.de",
    notes: "Partnerschaft beendet",
    gespraechszusammenfassung: [],
    tags: [
      {
        id: "tag-3",
        name: "Partner",
        color: "#8b5cf6",
        isSystemTag: false,
        isPipelineTag: false,
      },
    ],
    status: "Potenzial",
    is_vip: false,
    reminders: [],
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    deleted_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
  },
];

export default function PapierkorbPage() {
  const [deletedContacts, setDeletedContacts] = useState(mockDeletedContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contactToRestore, setContactToRestore] = useState<string | null>(null);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Filter contacts based on search term
  const filteredContacts = deletedContacts.filter((contact) => {
    const searchString =
      `${contact.company_name} ${contact.first_name} ${contact.last_name} ${contact.email}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Handle contact selection
  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts([...selectedContacts, contactId]);
    } else {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(filteredContacts.map((contact) => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  // Handle restore contact
  const handleRestoreContact = (contactId: string) => {
    setContactToRestore(contactId);
    setIsRestoreDialogOpen(true);
  };

  // Handle restore multiple contacts
  const handleRestoreSelected = () => {
    if (selectedContacts.length === 0) {
      toast({
        title: "Keine Auswahl",
        description: "Bitte wählen Sie mindestens einen Kontakt aus.",
        variant: "destructive",
      });
      return;
    }
    setContactToRestore(null);
    setIsRestoreDialogOpen(true);
  };

  // Confirm restore
  const confirmRestore = () => {
    const contactsToRestore = contactToRestore
      ? [contactToRestore]
      : selectedContacts;

    // Remove from deleted contacts (in real app, this would call an API)
    setDeletedContacts(
      deletedContacts.filter(
        (contact) => !contactsToRestore.includes(contact.id),
      ),
    );

    // Clear selection
    setSelectedContacts([]);
    setIsRestoreDialogOpen(false);
    setContactToRestore(null);

    toast({
      title: "Kontakte wiederhergestellt",
      description: `${contactsToRestore.length} Kontakt(e) wurden erfolgreich wiederhergestellt.`,
      variant: "success",
    });
  };

  // Handle permanent delete
  const handlePermanentDelete = (contactId: string) => {
    setContactToDelete(contactId);
    setIsDeleteDialogOpen(true);
  };

  // Handle permanent delete multiple
  const handleDeleteSelected = () => {
    if (selectedContacts.length === 0) {
      toast({
        title: "Keine Auswahl",
        description: "Bitte wählen Sie mindestens einen Kontakt aus.",
        variant: "destructive",
      });
      return;
    }
    setContactToDelete(null);
    setIsDeleteDialogOpen(true);
  };

  // Confirm permanent delete
  const confirmPermanentDelete = () => {
    const contactsToDelete = contactToDelete
      ? [contactToDelete]
      : selectedContacts;

    // Remove from deleted contacts permanently
    setDeletedContacts(
      deletedContacts.filter(
        (contact) => !contactsToDelete.includes(contact.id),
      ),
    );

    // Clear selection
    setSelectedContacts([]);
    setIsDeleteDialogOpen(false);
    setContactToDelete(null);

    toast({
      title: "Kontakte endgültig gelöscht",
      description: `${contactsToDelete.length} Kontakt(e) wurden endgültig gelöscht.`,
      variant: "success",
    });
  };

  // Empty trash
  const handleEmptyTrash = () => {
    if (deletedContacts.length === 0) {
      toast({
        title: "Papierkorb ist leer",
        description: "Es sind keine gelöschten Kontakte vorhanden.",
        variant: "destructive",
      });
      return;
    }

    setDeletedContacts([]);
    setSelectedContacts([]);

    toast({
      title: "Papierkorb geleert",
      description: "Alle gelöschten Kontakte wurden endgültig entfernt.",
      variant: "success",
    });
  };

  return (
    <div className="bg-background p-6 h-full">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Papierkorb</h1>
          <p className="text-muted-foreground mt-1">
            Gelöschte Kontakte verwalten und wiederherstellen
          </p>
        </div>
        <div className="flex gap-2">
          {selectedContacts.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={handleRestoreSelected}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Wiederherstellen ({selectedContacts.length})
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Endgültig löschen ({selectedContacts.length})
              </Button>
            </>
          )}
          <Button
            variant="destructive"
            onClick={handleEmptyTrash}
            className="flex items-center gap-2"
            disabled={deletedContacts.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Papierkorb leeren
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Gelöschte Kontakte durchsuchen..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trash2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {deletedContacts.length === 0
                ? "Papierkorb ist leer"
                : "Keine Ergebnisse"}
            </h3>
            <p className="text-muted-foreground text-center">
              {deletedContacts.length === 0
                ? "Es sind keine gelöschten Kontakte vorhanden."
                : "Keine Kontakte entsprechen Ihren Suchkriterien."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Gelöschte Kontakte ({filteredContacts.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    selectedContacts.length === filteredContacts.length &&
                    filteredContacts.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">
                  Alle auswählen
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Kontakt</TableHead>
                    <TableHead>Unternehmen</TableHead>
                    <TableHead>E-Mail</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Gelöscht am</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={(checked) =>
                            handleSelectContact(contact.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {contact.first_name} {contact.last_name}
                              {contact.is_vip && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                                >
                                  VIP
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {contact.salutation}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          {contact.company_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {contact.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {contact.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            contact.status === "Lead"
                              ? "border-blue-200 text-blue-700 bg-blue-50"
                              : contact.status === "Kunde"
                                ? "border-green-200 text-green-700 bg-green-50"
                                : "border-purple-200 text-purple-700 bg-purple-50"
                          }
                        >
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {contact.deleted_at.toLocaleDateString("de-DE")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestoreContact(contact.id)}
                            className="flex items-center gap-1"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Wiederherstellen
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handlePermanentDelete(contact.id)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Endgültig löschen
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Restore Confirmation Dialog */}
      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Kontakte wiederherstellen
            </DialogTitle>
            <DialogDescription>
              {contactToRestore
                ? "Möchten Sie diesen Kontakt wiederherstellen?"
                : `Möchten Sie ${selectedContacts.length} Kontakt(e) wiederherstellen?`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Die Kontakte werden in Ihre aktive Kontaktliste zurückversetzt.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRestoreDialogOpen(false)}
            >
              Abbrechen
            </Button>
            <Button onClick={confirmRestore}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Wiederherstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permanent Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Endgültig löschen
            </DialogTitle>
            <DialogDescription>
              {contactToDelete
                ? "Möchten Sie diesen Kontakt endgültig löschen?"
                : `Möchten Sie ${selectedContacts.length} Kontakt(e) endgültig löschen?`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Warnung</span>
              </div>
              <p className="text-sm text-destructive">
                Diese Aktion kann nicht rückgängig gemacht werden. Die Kontakte
                werden permanent aus dem System entfernt.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={confirmPermanentDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Endgültig löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
