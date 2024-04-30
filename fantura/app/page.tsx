"use client";
import Footer from "../components/Footer";
import Navbar from "@/components/Navbar";
import SignUp from "@/components/LandingPage/SignUp";
import HeroSection from "@/components/LandingPage/HeroSection";
import InfoSection from "@/components/LandingPage/InfoSection";
import { useZkp } from "@/utils/hooks/useZkp";

export default function Home() {
  const { isLoading, error } = useZkp();

  return (
    <>
      <Navbar />
      {/* <div className="min-h-screen bg-black"></div>
      <button
        className="bg-black text-white"
        onClick={async () => await createTeam(state, session)}
      >
        Create Team
      </button> */}
      {/* <HeroSection /> */}
      {/* <InfoSection />
      <SignUp /> */}
      <Footer />
    </>
  );
}
