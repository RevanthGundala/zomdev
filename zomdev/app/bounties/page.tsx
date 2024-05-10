import Navbar from "@/components/Navbar";
import BountyComponent from "@/components/BountyComponent";
import Footer from "@/components/Footer";
import { getBounties } from "../actions/contract/get/getBounties";
import { Bounty, BountyInfo } from "@/utils/types/bounty";

export default async function Bounties() {
  const { data: bounties } = await getBounties();

  return (
    <>
      <Navbar />
      <div className="space-y-6 px-20 mb-10 mt-40 min-h-screen">
        <header className="text-4xl font-bold px-2">Bounties</header>
        <p className="text-lg font-light px-2">
          View different bounties from companies
        </p>
        <section className="flex flex-col space-y-4">
          {bounties && bounties.length > 0 ? (
            bounties.map((bountyInfo: BountyInfo, index: number) => (
              <BountyComponent
                key={index}
                bounty={bountyInfo.bounty}
                company={bountyInfo.company}
              />
            ))
          ) : (
            <div className="text-center text-gray-500">
              You have no bounties.
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
