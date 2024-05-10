import { Bounty } from "@/utils/types/bounty";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dot, Clock4, Users } from "lucide-react";
import { MAX_LENGTH } from "@/utils/constants";
import Link from "next/link";

type BountyComponentProps = {
  bounty: Bounty;
  company: string | null;
};

export default function BountyComponent({
  bounty,
  company,
}: BountyComponentProps) {
  return (
    <Link href={`/bounties/${company}/bounty?id=${bounty.id}`} passHref>
      <Card className="hover:border-2 hover:border-blue-200 hover:cursor-pointer">
        <CardHeader>
          <CardTitle className="space-y-4">
            <div className="flex">
              <h1 className="flex flex-1 text-green-600">${bounty.reward}</h1>
              <div className="flex font-normal text-sm text-gray-500 items-center">
                <Clock4 />
                <div>{bounty.deadline.substring(0, 10)}</div>
                <Dot />
                <div className="font-bold">open</div>
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
            <p>{company}</p>
            <Dot />
            <p>{bounty.createdAt.substring(0, 10)}</p>
          </div>
          <div className="flex">
            <Users />
            <p>{bounty.submissions.length} Applicants</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
