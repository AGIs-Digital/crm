import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Contact, Tag } from "@/types/Contact";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  Trash,
  Download,
  Mail,
  Tag as TagIcon,
  Plus,
  Loader2,
} from "lucide-react";

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
  onExport?: (contactIds: string[]) => void;
  availableTags?: Tag[];
  onAddTag?: (contactIds: string[], tagIds: string[]) => void;
  onCreateTag?: (name: string, color: string) => Promise<Tag>;
}

export function ContactTable({
  contacts,
  onEdit,
  onDelete,
  onExport,
  availableTags = [],
  onAddTag,
  onCreateTag,
}: ContactTableProps) {
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const { toast } = useToast();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("50");

  // Selection state
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
  };

  const handleConfirmDelete = () => {
    if (contactToDelete) {
      try {
        onDelete(contactToDelete.id);
        toast({
          title: "Kontakt wurde gelöscht",
          description: `${contactToDelete.first_name} ${contactToDelete.last_name} wurde erfolgreich gelöscht.`,
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Fehler beim Löschen des Kontakts",
          description: "Bitte versuchen Sie es später erneut.",
          variant: "error",
        });
      } finally {
        setContactToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setContactToDelete(null);
  };

  // Calculate pagination values
  const paginatedContacts = useMemo(() => {
    const itemsPerPageNumber = parseInt(itemsPerPage, 10);
    const startIndex = (currentPage - 1) * itemsPerPageNumber;
    const endIndex = startIndex + itemsPerPageNumber;
    return contacts.slice(startIndex, endIndex);
  }, [contacts, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(contacts.length / parseInt(itemsPerPage, 10));
  }, [contacts.length, itemsPerPage]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle selection of a single contact
  const handleSelectContact = (contactId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedContacts((prev) => [...prev, contactId]);
    } else {
      setSelectedContacts((prev) => prev.filter((id) => id !== contactId));
    }
  };

  // Handle select all contacts on current page
  const handleSelectAll = (isChecked: boolean) => {
    setSelectAll(isChecked);
    if (isChecked) {
      const currentPageIds = paginatedContacts.map((contact) => contact.id);
      setSelectedContacts((prev) => {
        // Add only the IDs that aren't already in the array
        const newIds = currentPageIds.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      });
    } else {
      // Remove only the IDs from the current page
      const currentPageIds = paginatedContacts.map((contact) => contact.id);
      setSelectedContacts((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
    }
  };

  // State for bulk dialogs
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [showNewTagForm, setShowNewTagForm] = useState(false);

  // Handle bulk delete of selected contacts
  const handleBulkDelete = () => {
    if (selectedContacts.length === 0) return;
    setShowBulkDeleteDialog(true);
  };

  // Handle confirm bulk delete
  const handleConfirmBulkDelete = () => {
    if (selectedContacts.length === 0) return;

    // Store the count before deletion
    const deletedCount = selectedContacts.length;
    // Create a copy of the selected contacts before clearing the state
    const contactsToDelete = [...selectedContacts];

    // Delete all selected contacts
    contactsToDelete.forEach((id) => onDelete(id));

    // Clear selection states
    setSelectedContacts([]);
    setSelectAll(false);
    setShowBulkDeleteDialog(false);

    // Show success message
    toast({
      title: "Kontakte gelöscht",
      description: `${deletedCount} Kontakte wurden erfolgreich gelöscht.`,
      variant: "success",
    });
  };

  // Handle bulk export of selected contacts
  const handleBulkExport = () => {
    if (selectedContacts.length === 0 || !onExport) return;
    onExport(selectedContacts);
  };

  // Handle bulk tag assignment
  const handleBulkTagClick = () => {
    if (selectedContacts.length === 0 || !onAddTag) return;
    setSelectedTagIds([]);
    setNewTagName("");
    setNewTagColor("#3b82f6");
    setShowNewTagForm(false);
    setShowTagDialog(true);
  };

  // Handle tag selection change
  const handleTagSelectionChange = (tagId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedTagIds((prev) => [...prev, tagId]);
    } else {
      setSelectedTagIds((prev) => prev.filter((id) => id !== tagId));
    }
  };

  // Handle create new tag
  const handleCreateTag = async () => {
    if (!newTagName.trim() || !onCreateTag) return;

    try {
      setIsCreatingTag(true);
      const newTag = await onCreateTag(newTagName.trim(), newTagColor);

      // Add the new tag to the selected tags
      setSelectedTagIds((prev) => [...prev, newTag.id]);

      // Reset form
      setNewTagName("");
      setNewTagColor("#3b82f6");
      setShowNewTagForm(false);

      toast({
        title: "Tag erstellt",
        description: `Der Tag "${newTag.name}" wurde erfolgreich erstellt.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Fehler beim Erstellen des Tags",
        description:
          error instanceof Error
            ? error.message
            : "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
    } finally {
      setIsCreatingTag(false);
    }
  };

  // Handle confirm tag assignment
  const handleConfirmTagAssignment = () => {
    if (
      selectedContacts.length === 0 ||
      selectedTagIds.length === 0 ||
      !onAddTag
    )
      return;

    onAddTag(selectedContacts, selectedTagIds);
    setShowTagDialog(false);

    toast({
      title: "Tags zugewiesen",
      description: `${selectedTagIds.length} Tag(s) wurden ${selectedContacts.length} Kontakt(en) zugewiesen.`,
      variant: "success",
    });
  };

  return (
    <>
      {/* Selection toolbar */}
      {selectedContacts.length > 0 && (
        <div className="bg-muted mb-4 p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {selectedContacts.length}{" "}
              {selectedContacts.length === 1 ? "Kontakt" : "Kontakte"}{" "}
              ausgewählt
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleBulkExport}
              disabled={!onExport}
            >
              <Download className="h-4 w-4" />
              <span>Exportieren</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleBulkTagClick}
              disabled={!onAddTag}
            >
              <TagIcon className="h-4 w-4" />
              <span>Tag hinzufügen</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                // Implement email functionality if needed
                toast({
                  title: "E-Mail-Funktion",
                  description: "Diese Funktion ist noch nicht implementiert.",
                });
              }}
            >
              <Mail className="h-4 w-4" />
              <span>E-Mail senden</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleBulkDelete}
            >
              <Trash className="h-4 w-4" />
              <span>Löschen</span>
            </Button>
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <div
          className="overflow-x-auto"
          role="region"
          aria-label="Kontaktliste"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50" role="row">
                <th className="py-3 px-2 text-left font-medium w-10">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={(checked) =>
                      handleSelectAll(checked === true)
                    }
                    aria-label="Alle Kontakte auswählen"
                  />
                </th>
                <th className="py-3 px-4 text-left font-medium">Firmenname</th>
                <th className="py-3 px-4 text-left font-medium">Name</th>
                <th className="py-3 px-4 text-left font-medium">Telefon</th>
                <th className="py-3 px-4 text-left font-medium">E-Mail</th>
                <th className="py-3 px-4 text-left font-medium">Tags</th>
                <th className="py-3 px-4 text-left font-medium">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {paginatedContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={(e) => {
                    // Only trigger edit if not clicking on the delete button or checkbox
                    if (
                      !e.defaultPrevented &&
                      !e.target.closest("button[data-delete-button]") &&
                      !e.target.closest(".checkbox-cell")
                    ) {
                      onEdit(contact);
                    }
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onEdit(contact);
                    }
                  }}
                  aria-label={`${contact.first_name} ${contact.last_name} bearbeiten`}
                  role="button"
                >
                  <td
                    className="py-3 px-2 w-10 checkbox-cell"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={(checked) =>
                        handleSelectContact(contact.id, checked === true)
                      }
                      aria-label={`${contact.first_name} ${contact.last_name} auswählen`}
                    />
                  </td>
                  <td className="py-3 px-4">{contact.company_name}</td>
                  <td className="py-3 px-4">
                    {contact.salutation} {contact.first_name}{" "}
                    {contact.last_name}
                  </td>
                  <td className="py-3 px-4">{contact.phone}</td>
                  <td className="py-3 px-4">{contact.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent row click from triggering
                          handleDeleteClick(contact);
                        }}
                        data-delete-button="true"
                        aria-label={`${contact.first_name} ${contact.last_name} löschen`}
                      >
                        Löschen
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Einträge pro Seite:
          </span>
          <Select value={itemsPerPage} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger
              className="w-[80px]"
              aria-label="Einträge pro Seite auswählen"
            >
              <SelectValue placeholder="50" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Vorherige Seite"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Seite {currentPage} von {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Nächste Seite"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {contacts.length} Kontakte insgesamt
        </div>
      </div>

      {/* Single contact delete dialog */}
      <AlertDialog
        open={!!contactToDelete}
        onOpenChange={() => setContactToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kontakt wirklich löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete dialog */}
      <AlertDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mehrere Kontakte löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie wirklich {selectedContacts.length}{" "}
              {selectedContacts.length === 1 ? "Kontakt" : "Kontakte"} löschen?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowBulkDeleteDialog(false)}>
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBulkDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk tag assignment dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tags zuweisen</DialogTitle>
            <DialogDescription>
              Wählen Sie Tags aus, die den ausgewählten Kontakten zugewiesen
              werden sollen.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Verfügbare Tags</h3>
              <div className="grid grid-cols-1 gap-2">
                {availableTags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={selectedTagIds.includes(tag.id)}
                      onCheckedChange={(checked) =>
                        handleTagSelectionChange(tag.id, checked === true)
                      }
                    />
                    <label
                      htmlFor={`tag-${tag.id}`}
                      className="flex items-center text-sm font-medium cursor-pointer"
                    >
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {!showNewTagForm ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 w-full"
                onClick={() => setShowNewTagForm(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Neuen Tag erstellen</span>
              </Button>
            ) : (
              <div className="space-y-3 border rounded-md p-3">
                <h3 className="text-sm font-medium">Neuen Tag erstellen</h3>
                <div className="space-y-2">
                  <Label htmlFor="new-tag-name">Name</Label>
                  <Input
                    id="new-tag-name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Tag-Name eingeben"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-tag-color">Farbe</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: newTagColor }}
                    />
                    <Input
                      id="new-tag-color"
                      type="color"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewTagForm(false)}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim() || isCreatingTag}
                  >
                    {isCreatingTag ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Erstelle...
                      </>
                    ) : (
                      "Erstellen"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagDialog(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleConfirmTagAssignment}
              disabled={selectedTagIds.length === 0}
            >
              Zuweisen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
