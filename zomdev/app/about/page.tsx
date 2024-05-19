import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import React from "react";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="w-full max-w-2xl space-y-8 mt-40 mx-auto">
          <Card className="p-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">About Zomdev</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Zomdev is a platform that makes it easy for developers to find
                work and for companies to find developers.
                <br />
                <br />
                Here’s how it works: Companies post a bounty and developers
                complete the task. The developer receives a monetary reward for
                their work, but more importantly, companies gain direct evidence
                of how this person might contribute to their team.
                <br />
                <br />
                We currently only support crypto for paying out bounties, please
                contact us if you have any questions.
              </p>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
