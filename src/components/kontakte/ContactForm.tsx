"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Contact, Tag, TimeStampedEntry } from "@/types/Contact";
import { TimeStampedTextArea } from "@/components/common/TimeStampedTextArea";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";

interface ContactFormProps {
  contact?: Contact;
  onSave: (contact: Partial<Contact>) => void;
  onCancel: () => void;
  availableTags: Tag[];
}

export function ContactForm({
  contact,
  onSave,
  onCancel,
  availableTags = [],
}: ContactFormProps) {
  const isEditing = !!contact;
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Contact>>(
    contact || {
      company_name: "",
      salutation: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      notes: "",
      tags: [],
    },
  );

  // Country codes with flags, names, and dial codes
  const countryCodes = [
    {
      code: "DE",
      name: "Deutschland",
      flag: "🇩🇪",
      dial: "+49",
      format: "### #######",
    },
    {
      code: "AT",
      name: "Österreich",
      flag: "🇦🇹",
      dial: "+43",
      format: "### #######",
    },
    {
      code: "CH",
      name: "Schweiz",
      flag: "🇨🇭",
      dial: "+41",
      format: "## ### ## ##",
    },
    {
      code: "US",
      name: "USA",
      flag: "🇺🇸",
      dial: "+1",
      format: "(###) ###-####",
    },
    {
      code: "GB",
      name: "Großbritannien",
      flag: "🇬🇧",
      dial: "+44",
      format: "#### ######",
    },
    {
      code: "FR",
      name: "Frankreich",
      flag: "🇫🇷",
      dial: "+33",
      format: "# ## ## ## ##",
    },
    {
      code: "IT",
      name: "Italien",
      flag: "🇮🇹",
      dial: "+39",
      format: "### #### ###",
    },
    {
      code: "ES",
      name: "Spanien",
      flag: "🇪🇸",
      dial: "+34",
      format: "### ### ###",
    },
    {
      code: "NL",
      name: "Niederlande",
      flag: "🇳🇱",
      dial: "+31",
      format: "## ### ####",
    },
    {
      code: "BE",
      name: "Belgien",
      flag: "🇧🇪",
      dial: "+32",
      format: "### ## ## ##",
    },
    {
      code: "LU",
      name: "Luxemburg",
      flag: "🇱🇺",
      dial: "+352",
      format: "### ###",
    },
    {
      code: "PL",
      name: "Polen",
      flag: "🇵🇱",
      dial: "+48",
      format: "### ### ###",
    },
    {
      code: "CZ",
      name: "Tschechien",
      flag: "🇨🇿",
      dial: "+420",
      format: "### ### ###",
    },
    {
      code: "DK",
      name: "Dänemark",
      flag: "🇩🇰",
      dial: "+45",
      format: "#### ####",
    },
    {
      code: "SE",
      name: "Schweden",
      flag: "🇸🇪",
      dial: "+46",
      format: "## ### ####",
    },
    {
      code: "NO",
      name: "Norwegen",
      flag: "🇳🇴",
      dial: "+47",
      format: "### ## ###",
    },
    {
      code: "FI",
      name: "Finnland",
      flag: "🇫🇮",
      dial: "+358",
      format: "## ### ####",
    },
    {
      code: "PT",
      name: "Portugal",
      flag: "🇵🇹",
      dial: "+351",
      format: "### ### ###",
    },
    {
      code: "GR",
      name: "Griechenland",
      flag: "🇬🇷",
      dial: "+30",
      format: "### ### ####",
    },
    {
      code: "IE",
      name: "Irland",
      flag: "🇮🇪",
      dial: "+353",
      format: "## ### ####",
    },
    {
      code: "RU",
      name: "Russland",
      flag: "🇷🇺",
      dial: "+7",
      format: "### ### ## ##",
    },
    {
      code: "CA",
      name: "Kanada",
      flag: "🇨🇦",
      dial: "+1",
      format: "(###) ###-####",
    },
    {
      code: "AU",
      name: "Australien",
      flag: "🇦🇺",
      dial: "+61",
      format: "### ### ###",
    },
    {
      code: "NZ",
      name: "Neuseeland",
      flag: "🇳🇿",
      dial: "+64",
      format: "## ### ####",
    },
    {
      code: "CN",
      name: "China",
      flag: "🇨🇳",
      dial: "+86",
      format: "### #### ####",
    },
    {
      code: "JP",
      name: "Japan",
      flag: "🇯🇵",
      dial: "+81",
      format: "## #### ####",
    },
    {
      code: "KR",
      name: "Südkorea",
      flag: "🇰🇷",
      dial: "+82",
      format: "## #### ####",
    },
    {
      code: "IN",
      name: "Indien",
      flag: "🇮🇳",
      dial: "+91",
      format: "## #### ####",
    },
    {
      code: "BR",
      name: "Brasilien",
      flag: "🇧🇷",
      dial: "+55",
      format: "## #### ####",
    },
    {
      code: "MX",
      name: "Mexiko",
      flag: "🇲🇽",
      dial: "+52",
      format: "## #### ####",
    },
    {
      code: "ZA",
      name: "Südafrika",
      flag: "🇿🇦",
      dial: "+27",
      format: "## ### ####",
    },
  ];

  const [countryCode, setCountryCode] = useState("+49");
  const [phoneNumber, setPhoneNumber] = useState(
    contact?.phone ? contact.phone.replace(/^\+\d+\s*/, "") : "",
  );

  // Format phone number based on country code
  const formatPhoneNumber = (value: string, countryFormat: string) => {
    if (!value) return "";

    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Apply formatting based on country format pattern
    let formatted = "";
    let digitIndex = 0;

    for (
      let i = 0;
      i < countryFormat.length && digitIndex < digitsOnly.length;
      i++
    ) {
      if (countryFormat[i] === "#") {
        formatted += digitsOnly[digitIndex];
        digitIndex++;
      } else {
        formatted += countryFormat[i];
        if (digitIndex < digitsOnly.length) {
          formatted += "";
        }
      }
    }

    // Add any remaining digits
    if (digitIndex < digitsOnly.length) {
      formatted += " " + digitsOnly.substring(digitIndex);
    }

    return formatted.trim();
  };

  // Get current country format
  const getCurrentCountryFormat = () => {
    const country = countryCodes.find((c) => c.dial === countryCode);
    return country ? country.format : "### ### ###";
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>(
    contact?.tags.map((tag) => tag.id) || [],
  );

  const [localAvailableTags, setLocalAvailableTags] =
    useState<Tag[]>(availableTags);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6"); // Default blue color

  const [gespraechszusammenfassung, setGespraechszusammenfassung] = useState<
    TimeStampedEntry[]
  >(contact?.gespraechszusammenfassung || []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleAddNewTag = async () => {
    if (newTagName.trim()) {
      try {
        setIsSubmitting(true);

        // Prepare tag data for API
        const tagData = {
          name: newTagName.trim(),
          color: newTagColor,
        };

        // Send POST request to create new tag
        const response = await fetch("/api/kontakte/tags", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tagData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Fehler beim Erstellen des Tags");
        }

        // Get the new tag with server-generated ID
        const newTag = await response.json();

        // Update local state
        setLocalAvailableTags((prev) => [...prev, newTag]);
        setSelectedTags((prev) => [...prev, newTag.id]);
        setNewTagName("");
        setNewTagColor("#3b82f6");
        setIsTagDialogOpen(false);

        // Show success toast
        toast({
          title: "Tag erstellt",
          description: `Der Tag "${newTag.name}" wurde erfolgreich erstellt.`,
          variant: "success",
        });
      } catch (error) {
        console.error("Fehler beim Erstellen des Tags:", error);
        toast({
          title: "Fehler",
          description:
            error instanceof Error
              ? error.message
              : "Ein unerwarteter Fehler ist aufgetreten",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.first_name?.trim()) {
      newErrors.first_name = "Vorname ist erforderlich";
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = "Nachname ist erforderlich";
    }

    // Enhanced email validation
    if (!formData.email?.trim()) {
      newErrors.email = "E-Mail ist erforderlich";
    } else {
      // More comprehensive email validation
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Ungültiges E-Mail-Format";
      }
    }

    // Enhanced phone validation
    if (phoneNumber.trim()) {
      // Remove spaces and other formatting characters for validation
      const cleanedNumber = phoneNumber.replace(/[\s\-\(\)]/g, "");

      if (!/^\d+$/.test(cleanedNumber)) {
        newErrors.phone = "Telefonnummer darf nur Ziffern enthalten";
      } else {
        // Get minimum and maximum length based on country code
        const country = countryCodes.find((c) => c.dial === countryCode);
        const minLength = 5;
        const maxLength = 15;

        if (cleanedNumber.length < minLength) {
          newErrors.phone = `Telefonnummer ist zu kurz (mindestens ${minLength} Ziffern)`;
        } else if (cleanedNumber.length > maxLength) {
          newErrors.phone = `Telefonnummer ist zu lang (maximal ${maxLength} Ziffern)`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        // Map selected tag IDs to full tag objects
        const tags = localAvailableTags.filter((tag) =>
          selectedTags.includes(tag.id),
        );

        // Combine country code and phone number
        const fullPhoneNumber = phoneNumber.trim()
          ? `${countryCode} ${phoneNumber}`
          : "";

        // If we're editing an existing contact, use the parent component's onSave
        if (isEditing) {
          onSave({
            ...formData,
            phone: fullPhoneNumber,
            tags,
            gespraechszusammenfassung,
          });
          return;
        }

        // Prepare data for API request
        const contactData = {
          company_name: formData.company_name || "",
          salutation: formData.salutation || "",
          first_name: formData.first_name || "",
          last_name: formData.last_name || "",
          phone: fullPhoneNumber,
          email: formData.email || "",
          notes: formData.notes || "",
          tags: selectedTags,
        };

        // Send POST request to API
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

        const newContact = await response.json();

        // Display success toast
        toast({
          title: "Kontakt erstellt",
          description: `${formData.first_name} ${formData.last_name} wurde erfolgreich erstellt.`,
          variant: "success",
        });

        // Call the parent component's onSave with the new contact
        onSave(newContact);
      } catch (error) {
        console.error("Fehler beim Speichern des Kontakts:", error);
        setErrors((prev) => ({
          ...prev,
          form:
            error instanceof Error
              ? error.message
              : "Ein unerwarteter Fehler ist aufgetreten",
        }));
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const handleAddGespraechszusammenfassung = (text: string) => {
    const newEntry: TimeStampedEntry = {
      timestamp: new Date(),
      text,
    };
    setGespraechszusammenfassung([...gespraechszusammenfassung, newEntry]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <Label htmlFor="company_name" id="company_name-label">
            Firmenname
          </Label>
          <Input
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            aria-labelledby="company_name-label"
            placeholder="Firmenname eingeben"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salutation" id="salutation-label">
            Anrede
          </Label>
          <Input
            id="salutation"
            name="salutation"
            value={formData.salutation}
            onChange={handleChange}
            aria-labelledby="salutation-label"
            placeholder="z.B. Herr, Frau, Dr."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="first_name" id="first_name-label">
            Vorname
          </Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={errors.first_name ? "border-red-500" : ""}
            aria-invalid={!!errors.first_name}
            aria-describedby={
              errors.first_name ? "first_name-error" : undefined
            }
            aria-required="true"
            aria-labelledby="first_name-label"
            placeholder="Vorname eingeben"
            onBlur={() => {
              if (!formData.first_name?.trim()) {
                setErrors((prev) => ({
                  ...prev,
                  first_name: "Vorname ist erforderlich",
                }));
              }
            }}
          />
          {errors.first_name && (
            <p id="first_name-error" className="text-red-500 text-sm mt-1">
              {errors.first_name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name" id="last_name-label">
            Nachname
          </Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={errors.last_name ? "border-red-500" : ""}
            aria-invalid={!!errors.last_name}
            aria-describedby={errors.last_name ? "last_name-error" : undefined}
            aria-required="true"
            aria-labelledby="last_name-label"
            placeholder="Nachname eingeben"
            onBlur={() => {
              if (!formData.last_name?.trim()) {
                setErrors((prev) => ({
                  ...prev,
                  last_name: "Nachname ist erforderlich",
                }));
              }
            }}
          />
          {errors.last_name && (
            <p id="last_name-error" className="text-red-500 text-sm mt-1">
              {errors.last_name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" id="phone-label">
            Telefon
          </Label>
          <div className="flex gap-2">
            <div className="w-28">
              <Select
                value={countryCode}
                onValueChange={setCountryCode}
                name="country-code"
              >
                <SelectTrigger aria-label="Ländervorwahl auswählen">
                  <SelectValue placeholder="+49" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {countryCodes.map((country) => (
                    <SelectItem key={country.dial} value={country.dial}>
                      <span className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span className="flex-shrink-0">{country.dial}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {country.code}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              id="phone"
              name="phone"
              value={phoneNumber}
              onChange={(e) => {
                // Get only digits from input
                const digitsOnly = e.target.value.replace(/\D/g, "");
                // Format the phone number based on country code
                const formatted = formatPhoneNumber(
                  digitsOnly,
                  getCurrentCountryFormat(),
                );
                setPhoneNumber(formatted);

                // Clear error for this field when user types
                if (errors.phone) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.phone;
                    return newErrors;
                  });
                }
              }}
              className={errors.phone ? "border-red-500" : ""}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              placeholder={getCurrentCountryFormat().replace(/#/g, "0")}
              inputMode="tel"
              aria-labelledby="phone-label"
              onBlur={() => {
                if (phoneNumber.trim()) {
                  const cleanedNumber = phoneNumber.replace(/[\s\-\(\)]/g, "");
                  if (!/^\d+$/.test(cleanedNumber)) {
                    setErrors((prev) => ({
                      ...prev,
                      phone: "Telefonnummer darf nur Ziffern enthalten",
                    }));
                  } else if (cleanedNumber.length < 5) {
                    setErrors((prev) => ({
                      ...prev,
                      phone: "Telefonnummer ist zu kurz (mindestens 5 Ziffern)",
                    }));
                  } else if (cleanedNumber.length > 15) {
                    setErrors((prev) => ({
                      ...prev,
                      phone: "Telefonnummer ist zu lang (maximal 15 Ziffern)",
                    }));
                  }
                }
              }}
            />
          </div>
          {errors.phone && (
            <p id="phone-error" className="text-red-500 text-sm mt-1">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" id="email-label">
            E-Mail
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "border-red-500" : ""}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-required="true"
            aria-labelledby="email-label"
            placeholder="email@beispiel.de"
            onBlur={() => {
              if (!formData.email?.trim()) {
                setErrors((prev) => ({
                  ...prev,
                  email: "E-Mail ist erforderlich",
                }));
              } else {
                const emailRegex =
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!emailRegex.test(formData.email)) {
                  setErrors((prev) => ({
                    ...prev,
                    email: "Ungültiges E-Mail-Format",
                  }));
                }
              }
            }}
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" id="notes-label">
          Notizen
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          aria-labelledby="notes-label"
          placeholder="Zusätzliche Informationen zum Kontakt"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Tags</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setIsTagDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Neuer Tag</span>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {localAvailableTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={`px-3 py-1 rounded-full text-sm ${selectedTags.includes(tag.id) ? "ring-2 ring-offset-1" : "opacity-70"}`}
              style={{
                backgroundColor: `${tag.color}20`,
                color: tag.color,
              }}
              onClick={() => handleTagToggle(tag.id)}
            >
              {tag.name}
            </button>
          ))}
          {localAvailableTags.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Keine Tags vorhanden. Erstellen Sie einen neuen Tag.
            </p>
          )}
        </div>
      </div>

      {/* New Tag Dialog */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Neuen Tag erstellen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Name</Label>
              <Input
                id="tag-name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag-Name eingeben"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag-color">Farbe</Label>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border"
                  style={{ backgroundColor: newTagColor }}
                />
                <Input
                  id="tag-color"
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsTagDialogOpen(false)}
            >
              Abbrechen
            </Button>
            <Button
              type="button"
              onClick={handleAddNewTag}
              disabled={!newTagName.trim() || isSubmitting}
            >
              {isSubmitting ? "Wird erstellt..." : "Tag erstellen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-2">
        <Label
          htmlFor="gespraechszusammenfassung"
          id="gespraechszusammenfassung-label"
          className="flex items-center gap-2"
        >
          Gesprächszusammenfassung
          <span className="text-muted-foreground" title="Schreibgeschützt">
            🔒
          </span>
        </Label>
        <TimeStampedTextArea
          entries={gespraechszusammenfassung}
          onAddEntry={handleAddGespraechszusammenfassung}
        />
      </div>

      {errors.form && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{errors.form}</span>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Wird gespeichert..."
            : isEditing
              ? "Speichern"
              : "Kontakt erstellen"}
        </Button>
      </div>
    </form>
  );
}
