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
import ConnectedAccounts from "./ConnectedAccounts";
import { getAuthProfile } from "../actions/profile/getAuthProfile";
import Error from "./error";

export default async function Profile() {
  // const { data, error } = await getAuthProfile();

  return (
    <div>
      <Navbar />
      {/* <ErrorBoundary fallback={<Error />} */}
      <div className="space-y-6 px-20 mb-10 mt-40 min-h-screen">
        {/* <header className="space-y-2 py-5">
          <div className="flex items-center space-x-3">
            <img
              alt="Avatar"
              className="rounded-full"
              height="96"
              src="/placeholder.svg"
              style={{
                aspectRatio: "96/96",
                objectFit: "cover",
              }}
              width="96"
            />
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Meadow Richardson</h1>
              <Button size="sm">Change photo</Button>
            </div>
          </div>
        </header> */}
        <header className="text-4xl font-bold px-2">Profile</header>
        <div className="space-y-8">
          <Card>
            <CardContent className="space-y-6 py-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  defaultValue="Meadow Richardson"
                  id="name"
                  placeholder="E.g. Jane Doe"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="E.g. jane@example.com"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Biography</Label>
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
          <Card>
            <CardHeader>
              <div>Language</div>
              <div>Choose your preferred language</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <RadioGroup defaultValue="en" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="text-2xl">Connected Accounts</div>
            </CardHeader>
            <ConnectedAccounts />
          </Card>
        </div>
        <div className="pt-6">
          <Button>Save</Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
