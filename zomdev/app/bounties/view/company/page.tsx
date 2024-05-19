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

export default async function ViewCompany() {
  noStore();
  const { data: profileData } = await getProfile();
  const { data } = await getBountiesForCompany(profileData.company);
  return (
    <>
      <Navbar />
      <div className="space-y-6 px-20 mb-10 mt-40 min-h-screen">
        <header className="text-4xl font-bold px-2">Bounties</header>
        <p className="text-lg font-light px-2">View your company's bounties</p>
        <section className="flex flex-col space-y-4">
          {data && data.bounties?.length! > 0 ? (
            data.bounties?.map((bounty: Bounty, i: number) => (
              <BountyComponent key={i} company={data.company} bounty={bounty} />
            ))
          ) : (
            <div className="text-center text-gray-500">
              Your company has no bounties.
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
