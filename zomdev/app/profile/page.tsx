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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getProfile } from "../actions/auth/get-profile";

export default async function Profile() {
  await getProfile();

  return (
    <div>
      <Navbar />
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
                <Input id="name" placeholder="E.g. Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="E.g. jane@example.com" />
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
            <div className="p-6">
              <Button>Save</Button>
            </div>
          </Card>

          {/* <Card>
            <CardHeader>
              <div className="text-2xl">Connected Accounts</div>
            </CardHeader>
            <ConnectedAccounts />
          </Card> */}
        </div>
        <div className="p-6">
          <Link
            href="/delete-account"
            className="border-2 border-red-400 bg-white hover:bg-red-400"
          >
            Delete Account
          </Link>
          {/* <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="border-2 border-red-400 bg-white hover:bg-red-400">
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAccount}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog> */}
        </div>
      </div>
      <Footer />
    </div>
  );
}
