import Navbar from "@/components/Navbar";
import BountyComponent from "@/components/BountyComponent";
import Footer from "@/components/Footer";
import { getBounties } from "../actions/contract/indexer/getBounties";
import { unstable_noStore as noStore } from "next/cache";

export default async function Bounties() {
  noStore();
  const { data } = await getBounties();
  return (
    <>
      <Navbar />
      <div className="space-y-6 px-20 mb-10 mt-40 min-h-screen">
        <header className="text-4xl font-bold px-2">Bounties</header>
        <p className="text-lg font-light px-2">
          View different bounties from companies
        </p>
        <section className="flex flex-col space-y-4">
          {data && data.length > 0 ? (
            data.map((company: any) =>
              company.bounties.map((bounty: any) => (
                <BountyComponent company={company} bounty={bounty} />
              ))
            )
          ) : (
            <div className="text-center text-gray-500">No bounties.</div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
