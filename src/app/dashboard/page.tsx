import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Calendar,
  Kanban,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="bg-background p-6 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Gesamtkontakte</p>
                <h2 className="text-3xl font-bold mt-2">1,248</h2>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">12%</span>
              <span className="text-muted-foreground ml-1">
                seit letztem Monat
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Offene Aufgaben</p>
                <h2 className="text-3xl font-bold mt-2">42</h2>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 font-medium">5%</span>
              <span className="text-muted-foreground ml-1">
                seit letzter Woche
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Termine heute</p>
                <h2 className="text-3xl font-bold mt-2">8</h2>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">18%</span>
              <span className="text-muted-foreground ml-1">
                mehr als gestern
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Projekte</p>
                <h2 className="text-3xl font-bold mt-2">16</h2>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Kanban className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">2</span>
              <span className="text-muted-foreground ml-1">
                neue diese Woche
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Aktivitätsübersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Aktivitätsdiagramm wird hier angezeigt
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Anstehende Termine</CardTitle>
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
