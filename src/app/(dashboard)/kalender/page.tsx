"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus } from "lucide-react";

export default function KalenderPage() {
  return (
    <div className="bg-background p-6 h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kalender</h1>
          <p className="text-muted-foreground mt-1">
            Verwalten Sie Ihre Termine und Wiedervorlagen
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Neuer Termin
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Kalenderansicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] flex items-center justify-center border rounded-md">
              <div className="flex flex-col items-center text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Kalenderansicht wird hier implementiert
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Heutige Termine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "09:00", title: "Team Meeting", type: "Intern" },
                { time: "11:30", title: "Kundenpräsentation", type: "Extern" },
                { time: "14:00", title: "Produktbesprechung", type: "Intern" },
                { time: "16:30", title: "Strategieplanung", type: "Intern" },
              ].map((appointment, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-primary/10 text-primary font-medium rounded p-2 text-sm mr-3">
                    {appointment.time}
                  </div>
                  <div>
                    <p className="font-medium">{appointment.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Alle Termine anzeigen
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
