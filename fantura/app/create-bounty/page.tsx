/**
 * v0 by Vercel.
 * @see https://v0.dev/t/MeSpDnKyjpf
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, Card, CardHeader } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function Bounties() {
  return (
    <div>
      <Navbar />
      {/* <ErrorBoundary fallback={<Error />} */}
      <div className="space-y-6 px-20 mb-10 mt-40 min-h-screen">
        <header className="text-4xl font-bold px-2">Create Bounty</header>
        <p className="text-lg font-light p-2">
          Submit a new bounty for your fans to purchase with their points. Click
          publish when you're finished.
        </p>
        <div className="space-y-8">
          <Card>
            <CardContent className="space-y-6 py-5">
              <div className="space-y-2">
                <Label htmlFor="name">Challenge</Label>
                <Input
                  defaultValue="Meadow Richardson"
                  id="challenge"
                  placeholder="E.g. Jane Doe"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reward">Reward</Label>
                <Input
                  id="reward"
                  placeholder="E.g. jane@example.com"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <div className="flex space-x-20">
                  <div>
                    <Label htmlFor="cost">Cost</Label>
                    <Input
                      id="cost"
                      placeholder="E.g. jane@example.com"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost">Deadline</Label>
                    <Input id="cost" placeholder="E.g." />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  className="mt-1"
                  id="bio"
                  placeholder="Enter your bio"
                  style={{
                    minHeight: "100px",
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="pt-6">
          <Button>Publish</Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
