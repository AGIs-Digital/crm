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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleRequestOTP = () => {
    // Hier würde die Logik zur OTP-Anforderung implementiert werden
    setOtpSent(true);
  };

  const handleLogin = () => {
    // Hier würde die Logik zur OTP-Validierung implementiert werden
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            callflows CRM
          </CardTitle>
          <CardDescription className="text-center">
            Bitte melden Sie sich mit Ihrer E-Mail-Adresse an
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail-Adresse</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@beispiel.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!otpSent ? (
            <Button
              className="w-full"
              onClick={handleRequestOTP}
              disabled={!email}
            >
              OTP anfordern
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Einmal-Passwort (OTP)</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Geben Sie den Code ein"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleLogin} disabled={!otp}>
                Anmelden
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            {otpSent && (
              <Button
                variant="link"
                className="p-0"
                onClick={() => setOtpSent(false)}
              >
                Zurück zur E-Mail-Eingabe
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
