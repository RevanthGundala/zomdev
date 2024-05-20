import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dot, Clock4, Users } from "lucide-react";
import { MAX_LENGTH } from "@/utils/constants";
import Link from "next/link";
import { Company, Bounty } from "@/utils/types/contract";

type BountyComponentProps = {
  company: Company;
  bounty: Bounty;
};

export default function BountyComponent({
  company,
  bounty,
}: BountyComponentProps) {
  return (
    <Link
      href={`/bounties/${company.companyData.name}/bounty?id=${bounty.bountyId}`}
      passHref
    >
      <Card className="hover:border-2 hover:border-blue-200 hover:cursor-pointer">
        <CardHeader>
          <CardTitle className="space-y-4">
            <div className="flex">
              <h1 className="flex flex-1 text-green-600">
                ${bounty.bountyData.reward}
              </h1>
              <div className="hidden md:flex font-normal text-sm text-gray-500 items-center">
                <Clock4 />
                <div>{bounty.bountyData.deadline.substring(0, 10) ?? ""}</div>
                <Dot />
                <div className="font-bold">open</div>
              </div>
            </div>
            <div>{bounty.bountyData.title}</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bounty.bountyData.description.length > MAX_LENGTH
            ? bounty.bountyData.description.substring(0, MAX_LENGTH) + "..."
            : bounty.bountyData.description}
        </CardContent>
        <CardFooter className="flex">
          <div className="hidden md:flex space-x-2 flex-1">
            {/* <img src={bounty.image} className="w-6 h-6" /> */}
            <p>{company.companyData.name}</p>
            <Dot />
            <p>{bounty.bountyData.createdAt.substring(0, 10) ?? ""}</p>
          </div>
          <div className="flex">
            <Users />
            <p>{bounty.bountyData.submissions.length} Applicants</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
