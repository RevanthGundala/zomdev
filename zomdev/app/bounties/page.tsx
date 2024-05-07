import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dot, Clock4, Users } from "lucide-react";
import Link from "next/link";
import { MAX_LENGTH } from "@/utils/constants";
import Footer from "@/components/Footer";
import { getAllBounties } from "../actions/contract/get/getAllBounties";
import { Bounty } from "@/utils/types/bounty";

export default async function Bounties() {
  const bounties: Bounty[] = await getAllBounties();

  return (
    <>
      <Navbar />
      <div className="space-y-6 px-20 mb-10 mt-40 min-h-screen">
        <header className="text-4xl font-bold px-2">Bounties</header>
        <p className="text-lg font-light px-2">
          View different bounties from companies
        </p>
        <section className="flex flex-col space-y-4">
          {bounties.length > 0 ? (
            bounties.map((bounty: Bounty, index: number) => (
              <Card
                key={index}
                className="hover:border-2 hover:border-blue-200 hover:cursor-pointer"
              >
                <Link
                  href={`/bounties/${bounty.company}/bounty?id=${bounty.id}`}
                />
                <CardHeader>
                  <CardTitle className="space-y-4">
                    <div className="flex">
                      <h1 className="flex flex-1 text-green-600">
                        {bounty.reward}
                      </h1>
                      <div className="flex font-normal text-sm text-gray-500 items-center">
                        <Clock4 />
                        <h1>{bounty.deadline}</h1>
                        <Dot />
                        {/*TODO: */}
                        <h1 className="font-bold">open</h1>
                      </div>
                    </div>
                    <div>{bounty.title}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bounty.description.length > MAX_LENGTH
                    ? bounty.description.substring(0, MAX_LENGTH) + "..."
                    : bounty.description}
                </CardContent>
                <CardFooter className="flex ">
                  <div className="flex space-x-2 flex-1">
                    {/* <img src={bounty.image} className="w-6 h-6" /> */}
                    <p>{bounty.company}</p>
                    <Dot />
                    <p>{bounty.createdAt}</p>
                  </div>
                  <div className="flex">
                    <Users />
                    <p>{bounty.numSubmissions} Applicants</p>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center text-2xl">
              No bounties available. Come back Later!
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
