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
import DeleteAccount from "@/components/DeleteAccountComponent";
import { updateProfile } from "../actions/forms/updateProfile";
import { getProfile } from "../actions/auth/getProfile";

export default async function Profile() {
  const { data } = await getProfile();
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
        <form className="space-y-8" action={updateProfile}>
          <Card>
            <CardContent className="space-y-6 py-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder={data?.name || "E.g. Jane Doe"}
                  name="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder={data?.email || "E.g. test@gmail.com"}
                  name="email"
                />
              </div>
              {data.company && (
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder={data?.company || "E.g. Acme Corp"}
                    name="company"
                  />
                </div>
              )}
            </CardContent>
            <div className="p-6">
              <Button type="submit" className="hover:cursor-pointer">
                Save
              </Button>
            </div>
          </Card>

          {/* <Card>
            <CardHeader>
              <div className="text-2xl">Connected Accounts</div>
            </CardHeader>
            <ConnectedAccounts />
          </Card> */}
        </form>
        <div className="p-6">
          <DeleteAccount />
        </div>
      </div>
      <Footer />
    </div>
  );
}
