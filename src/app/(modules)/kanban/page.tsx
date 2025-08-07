"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Building,
  Mail,
  Phone,
  Calendar,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Pipeline,
  KanbanCard,
  Todo,
  PipelineCreateRequest,
} from "@/types/Kanban";
import { Contact } from "@/types/Contact";
import { useToast } from "@/components/ui/use-toast";

// Mock data for initial pipelines - using static dates to prevent hydration issues
const getInitialPipelines = (): Pipeline[] => [
  {
    id: "1",
    name: "Neue Leads",
    color: "#3b82f6",
    order: 0,
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "2",
    name: "Qualifiziert",
    color: "#8b5cf6",
    order: 1,
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "3",
    name: "Angebot erstellt",
    color: "#f59e0b",
    order: 2,
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "4",
    name: "Verhandlung",
    color: "#ef4444",
    order: 3,
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "5",
    name: "Abgeschlossen",
    color: "#22c55e",
    order: 4,
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  },
];

// Mock contacts for Kanban cards - using static dates to prevent hydration issues
const getMockKanbanContacts = (): Contact[] => [
  {
    id: "1",
    company_name: "Musterfirma GmbH",
    salutation: "Herr",
    first_name: "Max",
    last_name: "Mustermann",
    phone: "+49 123 4567890",
    email: "max.mustermann@musterfirma.de",
    notes: "Interessiert an Premium-Paket",
    gespraechszusammenfassung: [],
    tags: [],
    status: "Lead",
    is_vip: false,
    reminders: [],
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "2",
    company_name: "TechSolutions AG",
    salutation: "Frau",
    first_name: "Anna",
    last_name: "Schmidt",
    phone: "+49 987 6543210",
    email: "a.schmidt@techsolutions.de",
    notes: "Benötigt Angebot für 50 Lizenzen",
    gespraechszusammenfassung: [],
    tags: [],
    status: "Lead",
    is_vip: true,
    reminders: [],
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "3",
    company_name: "StartUp Inc.",
    salutation: "Herr",
    first_name: "Tom",
    last_name: "Weber",
    phone: "+49 555 1234567",
    email: "tom@startup.de",
    notes: "Kleines Budget, aber großes Potenzial",
    gespraechszusammenfassung: [],
    tags: [],
    status: "Lead",
    is_vip: false,
    reminders: [],
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  },
];

// Mock todos - using static dates to prevent hydration issues
const getMockTodos = (): Todo[] => [
  {
    id: "todo-1",
    title: "Angebot erstellen",
    description: "Premium-Paket Angebot für Musterfirma erstellen",
    status: "open",
    priority: "high",
    due_date: new Date("2024-01-08T00:00:00Z"),
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "todo-2",
    title: "Lizenz-Angebot vorbereiten",
    description: "50 Lizenzen für TechSolutions AG kalkulieren",
    status: "in_progress",
    priority: "high",
    due_date: new Date("2024-01-04T00:00:00Z"),
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "todo-3",
    title: "Nachfassgespräch führen",
    description: "Budget und Anforderungen mit StartUp Inc. klären",
    status: "open",
    priority: "medium",
    due_date: new Date("2024-01-06T00:00:00Z"),
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  },
];

// Initial Kanban cards - using static dates to prevent hydration issues
const getInitialCards = (): KanbanCard[] => [
  {
    id: "card-1",
    contact_id: "1",
    pipeline_id: "1",
    position: 0,
    value: 15000,
    probability: 20,
    expected_close_date: new Date("2024-01-31T00:00:00Z"),
    notes: "Erstkontakt erfolgreich, Interesse vorhanden",
    todos: ["todo-1"],
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "card-2",
    contact_id: "2",
    pipeline_id: "2",
    position: 0,
    value: 75000,
    probability: 60,
    expected_close_date: new Date("2024-01-15T00:00:00Z"),
    notes: "Qualifiziert, Budget bestätigt",
    todos: ["todo-2"],
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "card-3",
    contact_id: "3",
    pipeline_id: "1",
    position: 1,
    value: 8000,
    probability: 15,
    expected_close_date: new Date("2024-02-15T00:00:00Z"),
    notes: "Startup mit Potenzial, Budget unklar",
    todos: ["todo-3"],
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  },
];

export default function KanbanPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [isNewPipelineDialogOpen, setIsNewPipelineDialogOpen] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState("");
  const [newPipelineColor, setNewPipelineColor] = useState("#3b82f6");
  const { toast } = useToast();

  // Initialize data on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
    setPipelines(getInitialPipelines());
    setCards(getInitialCards());
    setContacts(getMockKanbanContacts());
    setTodos(getMockTodos());
  }, []);

  // Get contact for a card
  const getContactForCard = (card: KanbanCard): Contact | undefined => {
    return contacts.find((contact) => contact.id === card.contact_id);
  };

  // Get todos for a card
  const getTodosForCard = (card: KanbanCard): Todo[] => {
    return todos.filter((todo) => card.todos.includes(todo.id));
  };

  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const card = cards.find((c) => c.id === draggableId);
    if (!card) return;

    // Update card position and pipeline
    const updatedCard = {
      ...card,
      pipeline_id: destination.droppableId,
      position: destination.index,
      updated_at: new Date(),
    };

    // Create a new cards array with updated positions
    const newCards = [...cards];
    const cardIndex = newCards.findIndex((c) => c.id === draggableId);

    if (cardIndex !== -1) {
      // Remove the card from its current position
      const [movedCard] = newCards.splice(cardIndex, 1);

      // Update the card with new pipeline and position
      movedCard.pipeline_id = destination.droppableId;
      movedCard.position = destination.index;
      movedCard.updated_at = new Date();

      // Get all cards in the destination pipeline (excluding the moved card)
      const destinationCards = newCards.filter(
        (c) => c.pipeline_id === destination.droppableId,
      );

      // Insert the moved card at the correct position
      destinationCards.splice(destination.index, 0, movedCard);

      // Update positions for all cards in the destination pipeline
      destinationCards.forEach((card, index) => {
        card.position = index;
      });

      // Rebuild the cards array
      const otherCards = newCards.filter(
        (c) => c.pipeline_id !== destination.droppableId,
      );

      setCards([...otherCards, ...destinationCards]);
    }

    // Show success message
    const pipeline = pipelines.find((p) => p.id === destination.droppableId);
    const contact = getContactForCard(updatedCard);
    if (pipeline && contact) {
      toast({
        title: "Karte verschoben",
        description: `${contact.first_name} ${contact.last_name} wurde zu "${pipeline.name}" verschoben.`,
        variant: "success",
      });
    }
  };

  // Handle card click
  const handleCardClick = (card: KanbanCard) => {
    setSelectedCard(card);
    setIsCardDialogOpen(true);
  };

  // Handle create new pipeline
  const handleCreatePipeline = () => {
    if (!newPipelineName.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Namen für die Pipeline ein.",
        variant: "destructive",
      });
      return;
    }

    const newPipeline: Pipeline = {
      id: Date.now().toString(),
      name: newPipelineName.trim(),
      color: newPipelineColor,
      order: pipelines.length,
      created_at: new Date(),
      updated_at: new Date(),
    };

    setPipelines([...pipelines, newPipeline]);
    setNewPipelineName("");
    setNewPipelineColor("#3b82f6");
    setIsNewPipelineDialogOpen(false);

    toast({
      title: "Pipeline erstellt",
      description: `Die Pipeline "${newPipeline.name}" wurde erfolgreich erstellt.`,
      variant: "success",
    });
  };

  // Handle delete pipeline
  const handleDeletePipeline = (pipelineId: string) => {
    const pipeline = pipelines.find((p) => p.id === pipelineId);
    if (!pipeline) return;

    // Check if pipeline has cards
    const pipelineCards = cards.filter((c) => c.pipeline_id === pipelineId);
    if (pipelineCards.length > 0) {
      toast({
        title: "Pipeline kann nicht gelöscht werden",
        description:
          "Die Pipeline enthält noch Karten. Verschieben Sie diese zuerst.",
        variant: "destructive",
      });
      return;
    }

    setPipelines(pipelines.filter((p) => p.id !== pipelineId));
    toast({
      title: "Pipeline gelöscht",
      description: `Die Pipeline "${pipeline.name}" wurde gelöscht.`,
      variant: "success",
    });
  };

  // Get cards for a pipeline
  const getCardsForPipeline = (pipelineId: string): KanbanCard[] => {
    return cards
      .filter((card) => card.pipeline_id === pipelineId)
      .sort((a, b) => a.position - b.position);
  };

  // Calculate pipeline statistics
  const getPipelineStats = (pipelineId: string) => {
    const pipelineCards = getCardsForPipeline(pipelineId);
    const totalValue = pipelineCards.reduce((sum, card) => sum + card.value, 0);
    const avgProbability =
      pipelineCards.length > 0
        ? pipelineCards.reduce((sum, card) => sum + card.probability, 0) /
          pipelineCards.length
        : 0;

    return {
      count: pipelineCards.length,
      totalValue,
      avgProbability: Math.round(avgProbability),
    };
  };

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="bg-background p-6 h-full min-h-screen overflow-hidden">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Kanban Board</h1>
            <p className="text-muted-foreground mt-1">
              Verwalten Sie Ihre Sales Pipeline
            </p>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 h-[calc(100vh-200px)] min-h-[600px]">
          <div className="flex-shrink-0 w-80 min-w-[320px] h-full">
            <Card className="h-full flex flex-col max-h-[calc(100vh-250px)]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse" />
                    <div className="h-4 w-24 bg-gray-300 animate-pulse rounded" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-6 h-full min-h-screen overflow-hidden">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kanban Board</h1>
          <p className="text-muted-foreground mt-1">
            Verwalten Sie Ihre Sales Pipeline
          </p>
        </div>
        <Button onClick={() => setIsNewPipelineDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Neue Pipeline
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 h-[calc(100vh-200px)] min-h-[600px]"
          style={{ scrollbarWidth: "thin" }}
        >
          {pipelines
            .sort((a, b) => a.order - b.order)
            .map((pipeline) => {
              const pipelineCards = getCardsForPipeline(pipeline.id);
              const stats = getPipelineStats(pipeline.id);

              return (
                <div
                  key={pipeline.id}
                  className="flex-shrink-0 w-80 min-w-[320px] h-full"
                >
                  <Card className="h-full flex flex-col max-h-[calc(100vh-250px)]">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: pipeline.color }}
                          />
                          <CardTitle className="text-sm font-medium">
                            {pipeline.name}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {stats.count}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Bearbeiten
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeletePipeline(pipeline.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Löschen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stats.totalValue.toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                          minimumFractionDigits: 0,
                        })}{" "}
                        • {stats.avgProbability}% Ø
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pt-0 overflow-hidden">
                      <Droppable droppableId={pipeline.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`space-y-3 min-h-[400px] max-h-[calc(100vh-350px)] overflow-y-auto p-2 rounded-md transition-colors ${
                              snapshot.isDraggingOver
                                ? "bg-accent/50"
                                : "bg-transparent"
                            }`}
                          >
                            {pipelineCards.map((card, index) => {
                              const contact = getContactForCard(card);
                              const cardTodos = getTodosForCard(card);
                              const openTodos = cardTodos.filter(
                                (todo) => todo.status === "open",
                              );

                              if (!contact) return null;

                              return (
                                <Draggable
                                  key={card.id}
                                  draggableId={card.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <Card
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`cursor-pointer transition-all hover:shadow-md ${
                                        snapshot.isDragging
                                          ? "shadow-lg rotate-2"
                                          : ""
                                      } ${
                                        contact.is_vip
                                          ? "border-l-4 border-l-yellow-400 bg-yellow-50/50"
                                          : ""
                                      }`}
                                      onClick={() => handleCardClick(card)}
                                    >
                                      <CardContent className="p-4">
                                        <div className="space-y-3">
                                          {/* Contact Info */}
                                          <div>
                                            <div className="flex items-center gap-2 mb-1">
                                              <User className="h-3 w-3 text-muted-foreground" />
                                              <span className="text-sm font-medium">
                                                {contact.first_name}{" "}
                                                {contact.last_name}
                                              </span>
                                              {contact.is_vip && (
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                                                >
                                                  VIP
                                                </Badge>
                                              )}
                                            </div>
                                            {contact.company_name && (
                                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Building className="h-3 w-3" />
                                                {contact.company_name}
                                              </div>
                                            )}
                                          </div>

                                          {/* Deal Value & Probability */}
                                          <div className="flex justify-between items-center">
                                            <div className="text-sm font-medium text-green-600">
                                              {card.value.toLocaleString(
                                                "de-DE",
                                                {
                                                  style: "currency",
                                                  currency: "EUR",
                                                  minimumFractionDigits: 0,
                                                },
                                              )}
                                            </div>
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {card.probability}%
                                            </Badge>
                                          </div>

                                          {/* Expected Close Date */}
                                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {card.expected_close_date.toLocaleDateString(
                                              "de-DE",
                                            )}
                                          </div>

                                          {/* Open Todos */}
                                          {openTodos.length > 0 && (
                                            <div className="pt-2 border-t">
                                              <div className="text-xs text-muted-foreground mb-1">
                                                Offene Aufgaben (
                                                {openTodos.length})
                                              </div>
                                              <div className="space-y-1">
                                                {openTodos
                                                  .slice(0, 2)
                                                  .map((todo) => (
                                                    <div
                                                      key={todo.id}
                                                      className={`text-xs p-2 rounded ${
                                                        todo.priority === "high"
                                                          ? "bg-red-50 text-red-700 border border-red-200"
                                                          : todo.priority ===
                                                              "medium"
                                                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                                            : "bg-green-50 text-green-700 border border-green-200"
                                                      }`}
                                                    >
                                                      {todo.title}
                                                    </div>
                                                  ))}
                                                {openTodos.length > 2 && (
                                                  <div className="text-xs text-muted-foreground">
                                                    +{openTodos.length - 2}{" "}
                                                    weitere
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
        </div>
      </DragDropContext>

      {/* Card Detail Dialog */}
      <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedCard && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {(() => {
                    const contact = getContactForCard(selectedCard);
                    return contact
                      ? `${contact.first_name} ${contact.last_name}`
                      : "Kontakt Details";
                  })()}
                </DialogTitle>
                <DialogDescription>
                  {(() => {
                    const contact = getContactForCard(selectedCard);
                    return contact?.company_name || "Kein Unternehmen";
                  })()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Kontakt</Label>
                    <div className="mt-1 space-y-2">
                      {(() => {
                        const contact = getContactForCard(selectedCard);
                        if (!contact)
                          return (
                            <p className="text-sm text-muted-foreground">
                              Kein Kontakt gefunden
                            </p>
                          );

                        return (
                          <>
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {contact.first_name} {contact.last_name}
                              {contact.is_vip && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                                >
                                  VIP
                                </Badge>
                              )}
                            </div>
                            {contact.company_name && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building className="h-4 w-4" />
                                {contact.company_name}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              {contact.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {contact.phone}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Deal Information
                    </Label>
                    <div className="mt-1 space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Wert:</span>{" "}
                        <span className="font-medium text-green-600">
                          {selectedCard.value.toLocaleString("de-DE", {
                            style: "currency",
                            currency: "EUR",
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Wahrscheinlichkeit:
                        </span>{" "}
                        <span className="font-medium">
                          {selectedCard.probability}%
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Erwarteter Abschluss:
                        </span>{" "}
                        <span className="font-medium">
                          {selectedCard.expected_close_date.toLocaleDateString(
                            "de-DE",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedCard.notes && (
                  <div>
                    <Label className="text-sm font-medium">Notizen</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <p className="text-sm">{selectedCard.notes}</p>
                    </div>
                  </div>
                )}

                {/* Todos */}
                <div>
                  <Label className="text-sm font-medium">Aufgaben</Label>
                  <div className="mt-1 space-y-2">
                    {(() => {
                      const cardTodos = getTodosForCard(selectedCard);
                      if (cardTodos.length === 0) {
                        return (
                          <p className="text-sm text-muted-foreground">
                            Keine Aufgaben vorhanden
                          </p>
                        );
                      }

                      return cardTodos.map((todo) => (
                        <div
                          key={todo.id}
                          className={`p-3 rounded-md border ${
                            todo.status === "completed"
                              ? "bg-green-50 border-green-200"
                              : todo.priority === "high"
                                ? "bg-red-50 border-red-200"
                                : todo.priority === "medium"
                                  ? "bg-yellow-50 border-yellow-200"
                                  : "bg-blue-50 border-blue-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`text-sm font-medium ${
                                    todo.status === "completed"
                                      ? "line-through text-muted-foreground"
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
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    todo.status === "completed"
                                      ? "border-green-200 text-green-700 bg-green-50"
                                      : todo.status === "in_progress"
                                        ? "border-blue-200 text-blue-700 bg-blue-50"
                                        : "border-gray-200 text-gray-700 bg-gray-50"
                                  }`}
                                >
                                  {todo.status === "completed"
                                    ? "Erledigt"
                                    : todo.status === "in_progress"
                                      ? "In Bearbeitung"
                                      : "Offen"}
                                </Badge>
                              </div>
                              {todo.description && (
                                <p className="text-xs text-muted-foreground mb-2">
                                  {todo.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                Fällig:{" "}
                                {todo.due_date.toLocaleDateString("de-DE")}
                              </div>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCardDialogOpen(false)}
                >
                  Schließen
                </Button>
                <Button>Bearbeiten</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New Pipeline Dialog */}
      <Dialog
        open={isNewPipelineDialogOpen}
        onOpenChange={setIsNewPipelineDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Pipeline erstellen</DialogTitle>
            <DialogDescription>
              Erstellen Sie eine neue Pipeline für Ihr Kanban Board.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pipeline-name">Name *</Label>
              <Input
                id="pipeline-name"
                value={newPipelineName}
                onChange={(e) => setNewPipelineName(e.target.value)}
                placeholder="Pipeline-Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pipeline-color">Farbe</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="pipeline-color"
                  type="color"
                  value={newPipelineColor}
                  onChange={(e) => setNewPipelineColor(e.target.value)}
                  className="w-16 h-10"
                />
                <div className="flex gap-2">
                  {[
                    "#3b82f6",
                    "#8b5cf6",
                    "#f59e0b",
                    "#ef4444",
                    "#22c55e",
                    "#6b7280",
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-400"
                      style={{ backgroundColor: color }}
                      onClick={() => setNewPipelineColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewPipelineDialogOpen(false)}
            >
              Abbrechen
            </Button>
            <Button onClick={handleCreatePipeline}>Pipeline erstellen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
