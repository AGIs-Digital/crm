"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TimeStampedEntry } from "@/types/Contact";

interface TimeStampedTextAreaProps {
  entries: TimeStampedEntry[];
  onAddEntry: (text: string) => void;
  initialEntriesToShow?: number;
}

export function TimeStampedTextArea({
  entries = [],
  onAddEntry,
  initialEntriesToShow = 5,
}: TimeStampedTextAreaProps) {
  const [newEntry, setNewEntry] = useState("");
  const [visibleEntries, setVisibleEntries] =
    useState<number>(initialEntriesToShow);
  const entriesContainerRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Calculate entries to display based on the current limit
  const displayedEntries = entries.slice(-visibleEntries).reverse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.trim()) {
      onAddEntry(newEntry.trim());
      setNewEntry("");
      // When a new entry is added, make sure it's visible
      if (visibleEntries < entries.length + 1) {
        setVisibleEntries((prev) => prev + 1);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleScroll = () => {
    if (!entriesContainerRef.current) return;

    const { scrollTop } = entriesContainerRef.current;

    // If user scrolls near the top and there are more entries to load
    if (scrollTop < 50 && visibleEntries < entries.length && !isLoadingMore) {
      loadMoreEntries();
    }
  };

  const loadMoreEntries = () => {
    setIsLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleEntries((prev) => Math.min(prev + 5, entries.length));
      setIsLoadingMore(false);
    }, 300);
  };

  // Reset visible entries when entries array changes significantly
  useEffect(() => {
    if (entries.length <= initialEntriesToShow) {
      setVisibleEntries(entries.length);
    } else if (visibleEntries > entries.length) {
      setVisibleEntries(entries.length);
    }
  }, [entries.length, initialEntriesToShow, visibleEntries]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {entries.length > 0 ? (
          <div
            ref={entriesContainerRef}
            className="space-y-3 max-h-60 overflow-y-auto p-2 relative"
            onScroll={handleScroll}
          >
            {isLoadingMore && visibleEntries < entries.length && (
              <div className="text-xs text-muted-foreground text-center py-1">
                Ältere Einträge werden geladen...
              </div>
            )}

            {displayedEntries.map((entry, index) => (
              <div key={index} className="border-l-2 border-primary pl-3 py-1">
                <div className="text-xs text-muted-foreground">
                  {formatDate(entry.timestamp)}
                </div>
                <div className="mt-1 text-sm whitespace-pre-wrap">
                  {entry.text}
                </div>
              </div>
            ))}

            {visibleEntries < entries.length && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs mt-2"
                onClick={loadMoreEntries}
                disabled={isLoadingMore}
              >
                {isLoadingMore
                  ? "Wird geladen..."
                  : `${entries.length - visibleEntries} weitere Einträge laden`}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic">
            Keine Einträge vorhanden
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Neuen Eintrag hinzufügen..."
          rows={3}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!newEntry.trim()}
          >
            Eintrag hinzufügen
          </Button>
        </div>
      </div>
    </div>
  );
}
