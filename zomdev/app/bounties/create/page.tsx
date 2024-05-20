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
import { CardContent, Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DollarSign } from "lucide-react";
import React, { useState } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { addBounty } from "@/app/actions/contract/calls/bounty";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useZkLoginState } from "@/utils/contexts/zkLoginState";
import { useZkLoginSession } from "@/utils/contexts/zkLoginSession";
import { getProfile } from "@/app/actions/auth/getProfile";
import { useZkp } from "@/utils/hooks/useZkp";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Create() {
  const [title, setTitle] = useState("");
  const [reward, setReward] = useState("");
  const [deadline, onChange] = useState<Value>(new Date());
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const { error, isLoading } = useZkp();

  const { zkLoginSession } = useZkLoginSession();
  const { zkLoginState } = useZkLoginState();

  async function publish() {
    const { data } = await getProfile();
    const { data: id, error } = await addBounty(
      zkLoginState,
      zkLoginSession,
      data?.company_id,
      title,
      description,
      requirements,
      parseFloat(reward),
      new Date().toString(),
      deadline?.toString()
    );
    if (error) router.push(`/error?message=${error}`);
    else {
      toast({
        title: "Success!",
        description: "Your bounty has been created successfully.",
        action: (
          <ToastAction
            altText="View Bounty"
            onClick={() =>
              router.push(`/bounties/${data?.company}/bounty?id=${id}`)
            }
          >
            View Bounty
          </ToastAction>
        ),
      });
    }
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
                  placeholder="Fix a bug in the codebase"
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
                      <Input
                        id="cost"
                        placeholder="100"
                        value={reward}
                        onChange={(e) => setReward(e.target.value)}
                        required
                      />
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
          <Button type="submit" onClick={publish} disabled={isLoading}>
            Publish
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
