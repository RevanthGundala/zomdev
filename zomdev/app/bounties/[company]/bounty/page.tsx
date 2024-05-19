"use client";
import {
  CardContent,
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Clock4, Dot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import SuccessPopup from "@/components/popup/success";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { Company, Bounty, Submission } from "@/utils/types/contract";
import { getProfile } from "@/app/actions/auth/getProfile";
import { getUsers } from "@/app/actions/auth/getUsers";
import { getBountyById } from "@/app/actions/contract/indexer/getBounties";
import { unstable_noStore as noStore } from "next/cache";
import { submitBounty } from "@/app/actions/contract/calls/bounty";
import { useZkLoginState } from "@/utils/contexts/zkLoginState";
import { useZkLoginSession } from "@/utils/contexts/zkLoginSession";
import PaymentPopup from "@/components/popup/payment";
import { useSessionStorage } from "usehooks-ts";
import Link from "next/link";
import { useZkp } from "@/utils/hooks/useZkp";

export default function BountyId() {
  const id = useSearchParams().get("id");
  const { company: companyName } = useParams();
  const { error } = useZkp();
  const { zkLoginState } = useZkLoginState();
  const { zkLoginSession } = useZkLoginSession();

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [githubLink, setGithubLink] = useState("");
  const [winner, setWinner] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [company, setCompany] = useState<Company | null | undefined>(null);
  const [bounty, setBounty] = useState<Bounty | null | undefined>(null);
  const [submissions, setSubmissions] = useState<UiSubmission[]>([]);

  const [checkout, setCheckout, removeCheckout] = useSessionStorage(
    "checkout",
    ""
  );

  type UiSubmission = {
    email: string;
    submissionLink: string;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // can cache this
      const { data: profileData } = await getProfile();
      if (profileData?.company === decodeURIComponent(companyName as string))
        setIsOwner(true);

      noStore();
      const { data } = await getBountyById(
        id,
        decodeURIComponent(companyName as string)
      );
      setCompany(data?.company);
      setBounty(data?.bounty);

      const { data: users } = await getUsers();
      const contractSubmissions = data?.bounty?.bountyData.submissions;
      // console.log("submissions", submissions);
      // match emails to zkLoginAddress
      const updatedSubmissions =
        contractSubmissions && contractSubmissions.length > 0
          ? contractSubmissions
              .map((submission: Submission) => {
                const address = submission.address;
                const user = users?.find((user) => user.address === address);
                return user ? { ...submission, email: user.email } : null;
              })
              .filter(
                (cleanedSubmission: UiSubmission) =>
                  cleanedSubmission.email !== null
              )
          : [];

      setSubmissions(updatedSubmissions);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  async function handleSubmitCompany() {
    setCheckout(
      JSON.stringify({
        companyId: company?.companyId,
        bountyId: bounty?.bountyId,
        winner,
        reward: bounty?.bountyData.reward,
      })
    );
    setSubmitted(true);
  }

  async function handleSubmitUser() {
    const { error } = await submitBounty(
      zkLoginState,
      zkLoginSession,
      company?.companyId,
      bounty?.bountyId,
      githubLink
    );
    if (!error) setSubmitted(true);
  }

  return (
    <>
      <Navbar />
      <div className="space-y-6 px-20 mb-10 mt-40 min-h-screen">
        <div className="flex justify-center">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Card className="w-1/2 min-h-3/4">
              <CardHeader>
                <CardTitle className="space-y-4">
                  <div className="flex">
                    <h1 className="flex flex-1 text-green-600">
                      ${bounty?.bountyData.reward}
                    </h1>
                    <div className="flex font-normal text-sm text-gray-500 items-center">
                      <Clock4 />
                      <div>{bounty?.bountyData.deadline.substring(0, 10)}</div>
                      <Dot />
                      <div className="font-bold">open</div>
                    </div>
                  </div>
                  <div>{bounty?.bountyData.title}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <h1 className="font-semibold text-lg">Description</h1>
                <p>{bounty?.bountyData.description}</p>
              </CardContent>
              <CardContent className="space-y-3">
                <h1 className="font-semibold text-lg">
                  Submission Requirements
                </h1>
                <p>{bounty?.bountyData.requirements}</p>
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
                        <Button
                          variant="outline"
                          onClick={handleSubmitUser}
                          disabled={githubLink === ""}
                        >
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
                    <Label
                      className="font-semibold text-lg"
                      htmlFor="applicants"
                    >
                      Applicants
                    </Label>
                    <ul>
                      {submissions && submissions.length > 0 ? (
                        submissions.map((submission, i) => (
                          <li key={i}>
                            {submission.email} :{" "}
                            <Link
                              href={
                                submission.submissionLink.substring(0, 4) ===
                                "http"
                                  ? submission.submissionLink
                                  : `https://${submission.submissionLink}`
                              }
                              className="text-blue-600 underline"
                              passHref
                            >
                              {submission.submissionLink}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <div>No applicants</div>
                      )}
                    </ul>
                  </CardContent>
                  <CardContent className="space-y-3">
                    <Label
                      className="font-semibold text-lg"
                      htmlFor="applicants"
                    >
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
                        <Button
                          variant="outline"
                          onClick={handleSubmitCompany}
                          disabled={winner === ""}
                        >
                          Submit
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent hidden={!submitted}>
                        <PaymentPopup />
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </>
              )}
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
