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

// Mock data for initial pipelines
const initialPipelines: Pipeline[] = [
  {
    id: "1",
    name: "Neue Leads",
    color: "#3b82f6",
    order: 0,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "2",
    name: "Qualifiziert",
    color: "#8b5cf6",
    order: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "3",
    name: "Angebot erstellt",
    color: "#f59e0b",
    order: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "4",
    name: "Verhandlung",
    color: "#ef4444",
    order: 3,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "5",
    name: "Abgeschlossen",
    color: "#22c55e",
    order: 4,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// Mock contacts for Kanban cards
const mockKanbanContacts: Contact[] = [
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
    created_at: new Date(),
    updated_at: new Date(),
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
    created_at: new Date(),
    updated_at: new Date(),
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
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// Mock todos
const mockTodos: Todo[] = [
  {
    id: "todo-1",
    title: "Angebot erstellen",
    description: "Premium-Paket Angebot für Musterfirma erstellen",
    status: "open",
    priority: "high",
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "todo-2",
    title: "Lizenz-Angebot vorbereiten",
    description: "50 Lizenzen für TechSolutions AG kalkulieren",
    status: "in_progress",
    priority: "high",
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "todo-3",
    title: "Nachfassgespräch führen",
    description: "Budget und Anforderungen mit StartUp Inc. klären",
    status: "open",
    priority: "medium",
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// Initial Kanban cards
const initialCards: KanbanCard[] = [
  {
    id: "card-1",
    contact: mockKanbanContacts[0],
    todo: mockTodos[0],
    pipelineId: "1",
    position: 0,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "card-2",
    contact: mockKanbanContacts[1],
    todo: mockTodos[1],
    pipelineId: "2",
    position: 0,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "card-3",
    contact: mockKanbanContacts[2],
    todo: mockTodos[2],
    pipelineId: "3",
    position: 0,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

function KanbanPageContent() {
  const [pipelines, setPipelines] = useState<Pipeline[]>(initialPipelines);
  const [cards, setCards] = useState<KanbanCard[]>(initialCards);
  const [isNewPipelineDialogOpen, setIsNewPipelineDialogOpen] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  const [newPipelineName, setNewPipelineName] = useState("");
  const [newPipelineColor, setNewPipelineColor] = useState("#3b82f6");
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-background p-6 h-full">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Kanban Board</h1>
            <p className="text-muted-foreground mt-1">
              Verwalten Sie Ihre Leads durch verschiedene Pipeline-Stufen
            </p>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          <div className="flex-shrink-0 w-72 bg-muted/30 rounded-lg p-3 border border-border/50 animate-pulse">
            <div className="h-6 bg-muted rounded mb-3"></div>
            <div className="min-h-[200px] p-2 rounded-md border-2 border-dashed border-muted-foreground/25 bg-background/50">
              <div className="space-y-2">
                <div className="h-24 bg-muted rounded"></div>
                <div className="h-24 bg-muted rounded"></div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-72 bg-muted/30 rounded-lg p-3 border border-border/50 animate-pulse">
            <div className="h-6 bg-muted rounded mb-3"></div>
            <div className="min-h-[200px] p-2 rounded-md border-2 border-dashed border-muted-foreground/25 bg-background/50">
              <div className="space-y-2">
                <div className="h-24 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Color options for pipelines
  const colorOptions = [
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#22c55e", // Green
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#84cc16", // Lime
  ];

  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If no destination, do nothing
    if (!destination) return;

    // If dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the card being moved
    const card = cards.find((c) => c.id === draggableId);
    if (!card) return;

    // Get all cards in the destination pipeline
    const destinationCards = cards.filter(
      (c) => c.pipelineId === destination.droppableId && c.id !== draggableId,
    );

    // Get all cards in the source pipeline (excluding the moved card)
    const sourceCards = cards.filter(
      (c) => c.pipelineId === source.droppableId && c.id !== draggableId,
    );

    // Get all cards in other pipelines
    const otherCards = cards.filter(
      (c) =>
        c.pipelineId !== destination.droppableId &&
        c.pipelineId !== source.droppableId,
    );

    // Update positions in destination pipeline
    const updatedDestinationCards = destinationCards.map((c, index) => {
      const newPosition = index >= destination.index ? index + 1 : index;
      return { ...c, position: newPosition };
    });

    // Update positions in source pipeline
    const updatedSourceCards = sourceCards.map((c, index) => ({
      ...c,
      position: index,
    }));

    // Update the moved card
    const movedCard = {
      ...card,
      pipelineId: destination.droppableId,
      position: destination.index,
      updated_at: new Date(),
    };

    // Combine all cards
    const updatedCards = [
      ...otherCards,
      ...updatedSourceCards,
      ...updatedDestinationCards,
      movedCard,
    ];

    setCards(updatedCards);

    // Show success message
    const sourcePipeline = pipelines.find((p) => p.id === source.droppableId);
    const destPipeline = pipelines.find(
      (p) => p.id === destination.droppableId,
    );

    toast({
      title: "Karte verschoben",
      description: `${card.contact.first_name} ${card.contact.last_name} wurde von "${sourcePipeline?.name}" zu "${destPipeline?.name}" verschoben.`,
    });
  };

  // Get cards for a specific pipeline
  const getCardsForPipeline = (pipelineId: string) => {
    return cards
      .filter((card) => card.pipelineId === pipelineId)
      .sort((a, b) => a.position - b.position);
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
      id: `pipeline-${Date.now()}`,
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

  // Handle edit pipeline
  const handleEditPipeline = (pipeline: Pipeline) => {
    setEditingPipeline(pipeline);
    setNewPipelineName(pipeline.name);
    setNewPipelineColor(pipeline.color);
    setIsNewPipelineDialogOpen(true);
  };

  // Handle update pipeline
  const handleUpdatePipeline = () => {
    if (!editingPipeline || !newPipelineName.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Namen für die Pipeline ein.",
        variant: "destructive",
      });
      return;
    }

    const updatedPipelines = pipelines.map((p) =>
      p.id === editingPipeline.id
        ? {
            ...p,
            name: newPipelineName.trim(),
            color: newPipelineColor,
            updated_at: new Date(),
          }
        : p,
    );

    setPipelines(updatedPipelines);
    setEditingPipeline(null);
    setNewPipelineName("");
    setNewPipelineColor("#3b82f6");
    setIsNewPipelineDialogOpen(false);

    toast({
      title: "Pipeline aktualisiert",
      description: `Die Pipeline wurde erfolgreich aktualisiert.`,
      variant: "success",
    });
  };

  // Handle delete pipeline
  const handleDeletePipeline = (pipelineId: string) => {
    const pipeline = pipelines.find((p) => p.id === pipelineId);
    if (!pipeline) return;

    // Check if pipeline has cards
    const pipelineCards = getCardsForPipeline(pipelineId);
    if (pipelineCards.length > 0) {
      toast({
        title: "Pipeline kann nicht gelöscht werden",
        description:
          "Die Pipeline enthält noch Karten. Verschieben Sie diese zuerst in andere Pipelines.",
        variant: "destructive",
      });
      return;
    }

    setPipelines(pipelines.filter((p) => p.id !== pipelineId));

    toast({
      title: "Pipeline gelöscht",
      description: `Die Pipeline "${pipeline.name}" wurde erfolgreich gelöscht.`,
      variant: "success",
    });
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setIsNewPipelineDialogOpen(false);
    setEditingPipeline(null);
    setNewPipelineName("");
    setNewPipelineColor("#3b82f6");
  };

  // Handle card click
  const handleCardClick = (card: KanbanCard, event: React.MouseEvent) => {
    // Prevent drag from interfering with click
    event.stopPropagation();
    setSelectedCard(card);
    setEditingTodo({ ...card.todo });
    setIsCardDialogOpen(true);
  };

  // Handle close card dialog
  const handleCloseCardDialog = () => {
    setIsCardDialogOpen(false);
    setSelectedCard(null);
    setEditingTodo(null);
  };

  // Handle save todo
  const handleSaveTodo = () => {
    if (!selectedCard || !editingTodo) return;

    // Update the todo in the card
    const updatedCards = cards.map((card) => {
      if (card.id === selectedCard.id) {
        return {
          ...card,
          todo: {
            ...editingTodo,
            updated_at: new Date(),
          },
          updated_at: new Date(),
        };
      }
      return card;
    });

    setCards(updatedCards);
    handleCloseCardDialog();

    toast({
      title: "Todo aktualisiert",
      description: `Das Todo "${editingTodo.title}" wurde erfolgreich aktualisiert.`,
      variant: "success",
    });
  };

  // Handle todo field changes
  const handleTodoChange = (field: keyof Todo, value: any) => {
    if (!editingTodo) return;
    setEditingTodo({
      ...editingTodo,
      [field]: value,
    });
  };

  return (
    <div className="bg-background p-6 h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kanban Board</h1>
          <p className="text-muted-foreground mt-1">
            Verwalten Sie Ihre Leads durch verschiedene Pipeline-Stufen
          </p>
        </div>
        <Button onClick={() => setIsNewPipelineDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Neue Pipeline
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipelines
            .sort((a, b) => a.order - b.order)
            .map((pipeline) => {
              const pipelineCards = getCardsForPipeline(pipeline.id);
              return (
                <div
                  key={pipeline.id}
                  className="flex-shrink-0 w-72 bg-muted/30 rounded-lg p-3 border border-border/50"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: pipeline.color }}
                      />
                      <h3 className="font-semibold text-foreground">
                        {pipeline.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {pipelineCards.length}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditPipeline(pipeline)}
                        >
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

                  <Droppable droppableId={pipeline.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] p-2 rounded-md border-2 border-dashed transition-colors ${
                          snapshot.isDraggingOver
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 bg-background/50"
                        }`}
                      >
                        <div className="space-y-2">
                          {pipelineCards.map((card, index) => (
                            <Draggable
                              key={card.id}
                              draggableId={card.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`transition-transform ${
                                    snapshot.isDragging
                                      ? "rotate-2 scale-105"
                                      : ""
                                  }`}
                                >
                                  <Card
                                    className={`cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1 ${
                                      card.contact.is_vip
                                        ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
                                        : "bg-background border-border"
                                    }`}
                                    onClick={(e) => handleCardClick(card, e)}
                                  >
                                    <CardContent className="p-3">
                                      <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <User className="h-3 w-3 text-muted-foreground" />
                                              <h4 className="font-medium text-foreground text-sm truncate">
                                                {card.contact.first_name}{" "}
                                                {card.contact.last_name}
                                              </h4>
                                              {card.contact.is_vip && (
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs px-1 py-0 bg-amber-50 text-amber-700 border-amber-200"
                                                >
                                                  VIP
                                                </Badge>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-1 mb-2">
                                              <Building className="h-3 w-3 text-muted-foreground" />
                                              <p className="text-xs text-muted-foreground truncate">
                                                {card.contact.company_name}
                                              </p>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="bg-muted/50 p-2 rounded text-xs border border-muted/30">
                                          <div className="font-medium text-foreground mb-1 flex items-center gap-1">
                                            <span
                                              className={`w-2 h-2 rounded-full ${
                                                card.todo.status === "completed"
                                                  ? "bg-green-500"
                                                  : card.todo.status ===
                                                      "in_progress"
                                                    ? "bg-blue-500"
                                                    : "bg-gray-400"
                                              }`}
                                            />
                                            {card.todo.title}
                                          </div>
                                          {card.todo.description && (
                                            <div className="text-muted-foreground text-xs mb-2 line-clamp-2">
                                              {card.todo.description}
                                            </div>
                                          )}
                                          <div className="flex items-center justify-between mt-2">
                                            <Badge
                                              variant="outline"
                                              className={`text-xs ${
                                                card.todo.priority === "high"
                                                  ? "border-red-200 text-red-700 bg-red-50"
                                                  : card.todo.priority ===
                                                      "medium"
                                                    ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                                                    : "border-green-200 text-green-700 bg-green-50"
                                              }`}
                                            >
                                              {card.todo.priority === "high"
                                                ? "Hoch"
                                                : card.todo.priority ===
                                                    "medium"
                                                  ? "Mittel"
                                                  : "Niedrig"}
                                            </Badge>
                                            {card.todo.due_date && (
                                              <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                  {new Date(
                                                    card.todo.due_date,
                                                  ).toLocaleDateString("de-DE")}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <Mail className="h-3 w-3" />
                                          <span className="truncate flex-1">
                                            {card.contact.email}
                                          </span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
        </div>
      </DragDropContext>

      {/* New/Edit Pipeline Dialog */}
      <Dialog open={isNewPipelineDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPipeline
                ? "Pipeline bearbeiten"
                : "Neue Pipeline erstellen"}
            </DialogTitle>
            <DialogDescription>
              {editingPipeline
                ? "Bearbeiten Sie die Pipeline-Einstellungen."
                : "Erstellen Sie eine neue Pipeline für Ihre Leads."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pipeline-name">Pipeline-Name</Label>
              <Input
                id="pipeline-name"
                value={newPipelineName}
                onChange={(e) => setNewPipelineName(e.target.value)}
                placeholder="z.B. Neue Leads"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pipeline-color">Farbe</Label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      newPipelineColor === color
                        ? "border-foreground scale-110"
                        : "border-muted-foreground/30 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewPipelineColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Abbrechen
            </Button>
            <Button
              onClick={
                editingPipeline ? handleUpdatePipeline : handleCreatePipeline
              }
            >
              {editingPipeline ? "Aktualisieren" : "Erstellen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Card/Todo Edit Dialog */}
      <Dialog open={isCardDialogOpen} onOpenChange={handleCloseCardDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Todo bearbeiten - {selectedCard?.contact.first_name}{" "}
              {selectedCard?.contact.last_name}
            </DialogTitle>
            <DialogDescription>
              Bearbeiten Sie das Todo für diesen Lead.
            </DialogDescription>
          </DialogHeader>

          {editingTodo && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="todo-title">Titel</Label>
                  <Input
                    id="todo-title"
                    value={editingTodo.title}
                    onChange={(e) => handleTodoChange("title", e.target.value)}
                    placeholder="Todo-Titel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="todo-status">Status</Label>
                  <Select
                    value={editingTodo.status}
                    onValueChange={(value) => handleTodoChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Offen</SelectItem>
                      <SelectItem value="in_progress">
                        In Bearbeitung
                      </SelectItem>
                      <SelectItem value="completed">Abgeschlossen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="todo-priority">Priorität</Label>
                  <Select
                    value={editingTodo.priority}
                    onValueChange={(value) =>
                      handleTodoChange("priority", value)
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

                <div className="space-y-2">
                  <Label htmlFor="todo-due-date">Fälligkeitsdatum</Label>
                  <Input
                    id="todo-due-date"
                    type="date"
                    value={
                      editingTodo.due_date
                        ? new Date(editingTodo.due_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleTodoChange(
                        "due_date",
                        e.target.value ? new Date(e.target.value) : null,
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="todo-description">Beschreibung</Label>
                <Textarea
                  id="todo-description"
                  value={editingTodo.description || ""}
                  onChange={(e) =>
                    handleTodoChange("description", e.target.value)
                  }
                  placeholder="Todo-Beschreibung"
                  rows={3}
                />
              </div>

              {/* Contact Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Kontakt-Informationen</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Unternehmen</Label>
                    <p>{selectedCard?.contact.company_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">E-Mail</Label>
                    <p>{selectedCard?.contact.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Telefon</Label>
                    <p>{selectedCard?.contact.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="flex items-center gap-2">
                      <p>{selectedCard?.contact.status}</p>
                      {selectedCard?.contact.is_vip && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                        >
                          VIP
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCardDialog}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveTodo}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Export the component with dynamic import to prevent SSR issues
export default dynamic(() => Promise.resolve(KanbanPageContent), {
  ssr: false,
});
