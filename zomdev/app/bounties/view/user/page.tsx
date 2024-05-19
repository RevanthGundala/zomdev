import React from "react";
import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";
import {
  getBountiesForCompany,
  getBountiesForUser,
} from "@/app/actions/contract/indexer/getBounties";
import BountyComponent from "@/components/BountyComponent";
import { getProfile } from "@/app/actions/auth/getProfile";
import { Bounty } from "@/utils/types/contract";
import { unstable_noStore as noStore } from "next/cache";

export default async function ViewUser() {
  noStore();
  const { data: profileData } = await getProfile();
  const { data } = await getBountiesForUser(profileData.address);
  return (
    <>
      <Navbar />
      <div className="space-y-6 px-20 mb-10 mt-40 min-h-screen">
        <header className="text-4xl font-bold px-2">Bounties</header>
        <p className="text-lg font-light px-2">Your bounties</p>
        <section className="flex flex-col space-y-4">
          {data && data.bounties?.length! > 0 ? (
            data.bounties?.map((bounty: Bounty, i: number) => (
              <BountyComponent key={i} company={data.company} bounty={bounty} />
            ))
          ) : (
            <div className="text-center text-gray-500">
              You have not submitted any bounties
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
