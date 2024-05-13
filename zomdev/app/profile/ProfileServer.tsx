/**
 * v0 by Vercel.
 * @see https://v0.dev/t/MeSpDnKyjpf
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardContent, Card } from "@/components/ui/card";
import { getProfile } from "../actions/auth/getProfile";

export default async function ProfileServer() {
  const { data } = await getProfile();
  return (
    <>
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
      </Card>

      {/* <Card>
            <CardHeader>
              <div className="text-2xl">Connected Accounts</div>
            </CardHeader>
            <ConnectedAccounts />
          </Card> */}
    </>
  );
}
