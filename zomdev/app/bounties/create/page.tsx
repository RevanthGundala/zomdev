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
import { createBounty } from "@/app/actions/contract/post/createBounty";
import { createProduct } from "@/app/actions/stripe/create-product";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useZkLoginState } from "@/utils/contexts/zkLoginState";
import { useZkLoginSession } from "@/utils/contexts/zkLoginSession";
import { useZkp } from "@/utils/hooks/useZkp";
import { getProfile } from "@/app/actions/auth/get-profile";
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Create() {
  const [title, setTitle] = useState("");
  const [reward, setReward] = useState(0);
  const [deadline, onChange] = useState<Value>(new Date());
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const { zkLoginSession } = useZkLoginSession();
  const { zkLoginState } = useZkLoginState();

  async function publish() {
    const { data } = await getProfile();
    const { error } = await createBounty(
      zkLoginState,
      zkLoginSession,
      data?.company,
      title,
      description,
      requirements,
      reward,
      new Date().toString(),
      deadline?.toString()
    );
    if (error) {
      return;
    }
    const id = "1";
    // const priceId = await createProduct(id, title, reward);
    toast({
      title: "Success!",
      description: "Your bounty has been created successfully.",
      action: (
        <ToastAction
          altText="View Bounty"
          onClick={() => router.push(`/bounty/${id}`)}
        >
          View Bounty
        </ToastAction>
      ),
    });
  }

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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                        value={deadline}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="pt-6">
          <Button type="submit" onClick={publish}>
            Publish
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
