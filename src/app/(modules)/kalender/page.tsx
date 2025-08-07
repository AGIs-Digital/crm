"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Todo {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time: string;
  priority: "low" | "medium" | "high";
  status: "open" | "completed";
  contact?: {
    name: string;
    company: string;
  };
}

// Mock ToDos für den eingeloggten Benutzer
const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Angebot erstellen",
    description: "Premium-Paket Angebot für Musterfirma erstellen",
    date: new Date(),
    time: "09:00",
    priority: "high",
    status: "open",
    contact: {
      name: "Max Mustermann",
      company: "Musterfirma GmbH",
    },
  },
  {
    id: "2",
    title: "Kundentermin",
    description: "Präsentation der neuen Features",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    time: "14:30",
    priority: "high",
    status: "open",
    contact: {
      name: "Anna Schmidt",
      company: "TechSolutions AG",
    },
  },
  {
    id: "3",
    title: "Nachfassgespräch",
    description: "Budget und Anforderungen klären",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    time: "11:00",
    priority: "medium",
    status: "open",
    contact: {
      name: "Tom Weber",
      company: "StartUp Inc.",
    },
  },
  {
    id: "4",
    title: "Projektbesprechung",
    description: "Interne Abstimmung zum neuen Projekt",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: "16:00",
    priority: "medium",
    status: "open",
  },
  {
    id: "5",
    title: "Vertrag überprüfen",
    description: "Rechtliche Prüfung des Kundenvertrags",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    time: "10:00",
    priority: "low",
    status: "completed",
  },
];

export default function KalenderPage() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isNewTodoDialogOpen, setIsNewTodoDialogOpen] = useState(false);
  const [newTodo, setNewTodo] = useState<Partial<Todo>>({});
  const { toast } = useToast();

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Generate calendar days
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Get todos for a specific date
  const getTodosForDate = (date: Date) => {
    return todos.filter((todo) => {
      const todoDate = new Date(todo.date);
      return (
        todoDate.getDate() === date.getDate() &&
        todoDate.getMonth() === date.getMonth() &&
        todoDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Navigate months
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  // Handle day click
  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(clickedDate);
  };

  // Handle new todo
  const handleNewTodo = () => {
    setNewTodo({
      date: selectedDate || new Date(),
      time: "09:00",
      priority: "medium",
      status: "open",
    });
    setIsNewTodoDialogOpen(true);
  };

  // Save new todo
  const handleSaveTodo = () => {
    if (!newTodo.title || !newTodo.date) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive",
      });
      return;
    }

    const todo: Todo = {
      id: Date.now().toString(),
      title: newTodo.title!,
      description: newTodo.description,
      date: newTodo.date!,
      time: newTodo.time || "09:00",
      priority: newTodo.priority || "medium",
      status: "open",
    };

    setTodos([...todos, todo]);
    setIsNewTodoDialogOpen(false);
    setNewTodo({});

    toast({
      title: "ToDo erstellt",
      description: "Das ToDo wurde erfolgreich erstellt.",
      variant: "success",
    });
  };

  // Toggle todo status
  const toggleTodoStatus = (todoId: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              status: todo.status === "open" ? "completed" : "open",
            }
          : todo,
      ),
    );
  };

  // Get today's todos
  const todaysTodos = getTodosForDate(new Date());
  const selectedDateTodos = selectedDate ? getTodosForDate(selectedDate) : [];

  const monthNames = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  return (
    <div className="bg-background p-6 h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kalender</h1>
          <p className="text-muted-foreground mt-1">
            Verwalten Sie Ihre Termine und ToDos
          </p>
        </div>
        <Button onClick={handleNewTodo}>
          <Plus className="h-4 w-4 mr-2" />
          Neues ToDo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {monthNames[currentMonth]} {currentYear}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={index} className="p-2 h-24"></div>;
                }

                const date = new Date(currentYear, currentMonth, day);
                const dayTodos = getTodosForDate(date);
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const isSelected =
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString();

                return (
                  <div
                    key={day}
                    className={`p-2 h-24 border rounded-md cursor-pointer transition-colors hover:bg-accent ${
                      isToday
                        ? "bg-primary/10 border-primary"
                        : isSelected
                          ? "bg-accent border-accent-foreground"
                          : "border-border"
                    }`}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="text-sm font-medium mb-1">{day}</div>
                    <div className="space-y-1">
                      {dayTodos.slice(0, 2).map((todo) => (
                        <div
                          key={todo.id}
                          className={`text-xs p-1 rounded truncate ${
                            todo.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : todo.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          } ${
                            todo.status === "completed"
                              ? "opacity-50 line-through"
                              : ""
                          }`}
                        >
                          {todo.time} {todo.title}
                        </div>
                      ))}
                      {dayTodos.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayTodos.length - 2} weitere
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Todos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Heute ({todaysTodos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysTodos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Keine ToDos für heute
                  </p>
                ) : (
                  todaysTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`p-3 border rounded-md ${
                        todo.status === "completed"
                          ? "opacity-50 bg-muted/50"
                          : "bg-background"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-sm font-medium ${
                                todo.status === "completed"
                                  ? "line-through"
                                  : ""
                              }`}
                            >
                              {todo.title}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                todo.priority === "high"
                                  ? "border-red-200 text-red-700 bg-red-50"
                                  : todo.priority === "medium"
                                    ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                                    : "border-green-200 text-green-700 bg-green-50"
                              }`}
                            >
                              {todo.priority === "high"
                                ? "Hoch"
                                : todo.priority === "medium"
                                  ? "Mittel"
                                  : "Niedrig"}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            {todo.time}
                          </div>
                          {todo.description && (
                            <div className="text-xs text-muted-foreground mb-2">
                              {todo.description}
                            </div>
                          )}
                          {todo.contact && (
                            <div className="text-xs text-muted-foreground">
                              {todo.contact.name} - {todo.contact.company}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTodoStatus(todo.id)}
                          className="ml-2"
                        >
                          {todo.status === "completed" ? "↶" : "✓"}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Todos */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {selectedDate.toLocaleDateString("de-DE", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDateTodos.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Keine ToDos für diesen Tag
                    </p>
                  ) : (
                    selectedDateTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className={`p-3 border rounded-md ${
                          todo.status === "completed"
                            ? "opacity-50 bg-muted/50"
                            : "bg-background"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-sm font-medium ${
                                  todo.status === "completed"
                                    ? "line-through"
                                    : ""
                                }`}
                              >
                                {todo.title}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  todo.priority === "high"
                                    ? "border-red-200 text-red-700 bg-red-50"
                                    : todo.priority === "medium"
                                      ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                                      : "border-green-200 text-green-700 bg-green-50"
                                }`}
                              >
                                {todo.priority === "high"
                                  ? "Hoch"
                                  : todo.priority === "medium"
                                    ? "Mittel"
                                    : "Niedrig"}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">
                              {todo.time}
                            </div>
                            {todo.description && (
                              <div className="text-xs text-muted-foreground mb-2">
                                {todo.description}
                              </div>
                            )}
                            {todo.contact && (
                              <div className="text-xs text-muted-foreground">
                                {todo.contact.name} - {todo.contact.company}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTodoStatus(todo.id)}
                            className="ml-2"
                          >
                            {todo.status === "completed" ? "↶" : "✓"}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* New Todo Dialog */}
      <Dialog open={isNewTodoDialogOpen} onOpenChange={setIsNewTodoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neues ToDo erstellen</DialogTitle>
            <DialogDescription>
              Erstellen Sie ein neues ToDo für Ihren Kalender.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="todo-title">Titel *</Label>
              <Input
                id="todo-title"
                value={newTodo.title || ""}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
                placeholder="ToDo-Titel"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="todo-description">Beschreibung</Label>
              <Textarea
                id="todo-description"
                value={newTodo.description || ""}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, description: e.target.value })
                }
                placeholder="Beschreibung (optional)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="todo-date">Datum *</Label>
                <Input
                  id="todo-date"
                  type="date"
                  value={
                    newTodo.date ? newTodo.date.toISOString().split("T")[0] : ""
                  }
                  onChange={(e) =>
                    setNewTodo({
                      ...newTodo,
                      date: e.target.value
                        ? new Date(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="todo-time">Uhrzeit</Label>
                <Input
                  id="todo-time"
                  type="time"
                  value={newTodo.time || "09:00"}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, time: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="todo-priority">Priorität</Label>
              <Select
                value={newTodo.priority || "medium"}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setNewTodo({ ...newTodo, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Niedrig</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="high">Hoch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewTodoDialogOpen(false)}
            >
              Abbrechen
            </Button>
            <Button onClick={handleSaveTodo}>ToDo erstellen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
