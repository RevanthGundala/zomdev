/**
 * v0 by Vercel.
 * @see https://v0.dev/t/MeSpDnKyjpf
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, Card, CardHeader } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DollarSign } from "lucide-react";
import React, { useState } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { createBounty } from "@/utils/move-calls/post/createBounty";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Create() {
  const [value, onChange] = useState<Value>(new Date());
  return (
    <div>
      <Navbar />
      <div className="space-y-6 px-20 mb-10 mt-40 min-h-screen">
        <header className="text-4xl font-bold px-2">Create Bounty</header>
        <p className="text-lg font-light p-2">
          Submit a new bounty for users to complete. Click publish when you're
          finished.
        </p>
        <div className="space-y-8">
          <Card>
            <CardContent className="space-y-6 py-5">
              <div className="space-y-2">
                <Label htmlFor="name">Title</Label>
                <Input
                  placeholder="Meadow Richardson"
                  id="challenge"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex space-x-20">
                  <div>
                    <Label htmlFor="cost">Reward</Label>
                    <div className="flex items-center">
                      <DollarSign className="w-6 h-10 bg-gray-200" />
                      <Input id="cost" placeholder="10,000" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="date">Deadline</Label>
                    <div>
                      <DatePicker
                        id="date"
                        className="py-2"
                        onChange={onChange}
                        value={value}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  className="mt-1"
                  id="bio"
                  placeholder="Enter a description"
                  style={{
                    minHeight: "100px",
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Submission Requirements</Label>
                <Textarea
                  className="mt-1"
                  id="bio"
                  placeholder="Enter the submission requirements"
                  style={{
                    minHeight: "100px",
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="pt-6">
          <Button type="submit" onClick={createBounty}>
            Publish
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
