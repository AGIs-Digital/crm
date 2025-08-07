"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("test@callflows.de");
  const [password, setPassword] = useState("test123");

  const handleLogin = () => {
    // Hardcoded credentials for testing
    if (email === "test@callflows.de" && password === "test123") {
      window.location.href = "/dashboard";
    } else {
      alert(
        "Ungültige Anmeldedaten. Verwenden Sie test@callflows.de / test123",
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Image
              src="/images/callflows_brand_small.png"
              alt="callflows CRM"
              width={200}
              height={60}
              className="h-12 w-auto"
            />
          </div>
          <CardDescription className="text-center">
            Bitte melden Sie sich mit Ihren Zugangsdaten an
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail-Adresse</Label>
            <Input
              id="email"
              type="email"
              placeholder="test@callflows.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              type="password"
              placeholder="test123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={!email || !password}
          >
            Anmelden
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Testzugangsdaten: test@callflows.de / test123
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
