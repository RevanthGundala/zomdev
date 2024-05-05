"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import { getBounties } from "../../utils/move-calls/get/getBounties";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dot, Clock4, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { MAX_LENGTH } from "@/utils/constants";
import Footer from "@/components/Footer";
import { getBountiesOwnedBy } from "@/utils/move-calls/get/getBountiesOwnedBy";

export default function View() {
  const router = useRouter();
  const bounties = getBountiesOwnedBy();

  return (
    <>
      <Navbar />
      <div className="space-y-6 px-20 mb-10 mt-40 min-h-screen">
        <header className="text-4xl font-bold px-2">Bounties</header>
        <p className="text-lg font-light px-2">My Bounties</p>
        <section className="flex flex-col space-y-4">
          {bounties.map((bounty, index) => (
            <Card
              key={index}
              className="hover:border-2 hover:border-blue-200 hover:cursor-pointer"
              onClick={() =>
                router.push(
                  `/bounties/${bounty.company}/bounty?id=${bounty.id}&isOwner=${true}`,
                )
              }
            >
              <CardHeader>
                <CardTitle className="space-y-4">
                  <div className="flex">
                    <h1 className="flex flex-1 text-green-600">
                      {bounty.reward}
                    </h1>
                    <div className="flex font-normal text-sm text-gray-500 items-center">
                      <Clock4 />
                      <h1>{bounty.dateEnd}</h1>
                      <Dot />
                      <h1 className="font-bold">{bounty.status}</h1>
                    </div>
                  </div>
                  <h2>{bounty.title}</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bounty.description.length > MAX_LENGTH
                  ? bounty.description.substring(0, MAX_LENGTH) + "..."
                  : bounty.description}
              </CardContent>
              <CardFooter className="flex ">
                <div className="flex space-x-2 flex-1">
                  <img src={bounty.image} className="w-6 h-6" />
                  <p>{bounty.company}</p>
                  <Dot />
                  <p>{bounty.dateCreated}</p>
                </div>
                <div className="flex">
                  <Users />
                  <p>{bounty.applicants} Applicants</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </section>
      </div>
      <Footer />
    </>
  );
}
