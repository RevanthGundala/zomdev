"use client";
import {
  CardContent,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
import { useSearchParams } from "next/navigation";
import { getBounty } from "@/app/actions/contract/get/getBounty";
import { Button } from "@/components/ui/button";
import { Clock4, Dot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import SuccessPopup from "@/components/popup/success";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useStripeProduct } from "@/utils/hooks/useStripeProduct";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Bounty() {
  const id = useSearchParams().get("id");
  const isOwner = true;
  const bounty = getBounty();

  const [submitted, setSubmitted] = useState(false);
  const [githubLink, setGithubLink] = useState("");
  const [winner, setWinner] = useState("");

  const { clientSecret } = useStripeProduct(id);

  useEffect(() => {
    console.log("Client Secret Updated:", clientSecret);
  }, [clientSecret]);

  function handleSubmit() {
    setSubmitted(true);
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="flex justify-center mt-60 mb-20">
          <Card className="w-1/2 min-h-3/4">
            <CardHeader>
              <CardTitle className="space-y-4">
                <div className="flex">
                  <h1 className="flex flex-1 text-green-600">
                    {bounty.reward}
                  </h1>
                  <div className="flex font-normal text-sm text-gray-500 items-center">
                    <Clock4 />
                    <div>{bounty.dateEnd}</div>
                    <Dot />
                    <div className="font-bold">{bounty.status}</div>
                  </div>
                </div>
                <div>{bounty.title}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <h1 className="font-semibold text-lg">Description</h1>
              <p>{bounty.description}</p>
            </CardContent>
            <CardContent className="space-y-3">
              <h1 className="font-semibold text-lg">Submission Requirements</h1>
              <p>{bounty.description}</p>
            </CardContent>
            {!isOwner ? (
              <>
                <CardContent className="space-y-3">
                  <Label
                    className="font-semibold text-lg"
                    htmlFor="github-link"
                  >
                    Link to Project
                  </Label>
                  <Input
                    id="github-link"
                    type="text"
                    placeholder="https://github.com/your-repo"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    required
                  />
                </CardContent>
                <CardFooter>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" onClick={handleSubmit}>
                        Submit
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent hidden={!submitted}>
                      <SuccessPopup />
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </>
            ) : (
              <>
                <CardContent className="space-y-3">
                  <Label className="font-semibold text-lg" htmlFor="applicants">
                    Applicants
                  </Label>
                  <ul id="applicants">
                    <li>Applicant 1</li>
                    <li>Applicant 2</li>
                    <li>Applicant 3</li>
                  </ul>
                </CardContent>
                <CardContent className="space-y-3">
                  <Label className="font-semibold text-lg" htmlFor="applicants">
                    Choose Winner
                  </Label>
                  <Input
                    id="winner"
                    type="text"
                    placeholder="Winner's Email"
                    value={winner}
                    onChange={(e) => setWinner(e.target.value)}
                    required
                  />
                </CardContent>
                <CardFooter>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" onClick={handleSubmit}>
                        Submit
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent hidden={!submitted}>
                      {clientSecret && (
                        <div id="checkout">
                          <EmbeddedCheckoutProvider
                            stripe={stripePromise}
                            options={{ clientSecret }}
                          >
                            <EmbeddedCheckout />
                          </EmbeddedCheckoutProvider>
                        </div>
                      )}
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
