"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw, X } from "lucide-react";

export default function PapierkorbPage() {
  return (
    <div className="bg-background p-6 h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Papierkorb</h1>
          <p className="text-muted-foreground mt-1">
            Gelöschte Elemente verwalten und wiederherstellen
          </p>
        </div>
        <Button variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Papierkorb leeren
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gelöschte Elemente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center border rounded-md">
            <div className="flex flex-col items-center text-center">
              <Trash2 className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                Keine gelöschten Elemente vorhanden
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Gelöschte Leads, Termine und andere Elemente werden hier
                angezeigt
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
