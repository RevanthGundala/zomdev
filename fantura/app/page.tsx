"use client";
import Footer from "../components/Footer";
import Navbar from "@/components/Navbar";
import SignUp from "@/components/LandingPage/SignUp";
import HeroSection from "@/components/LandingPage/HeroSection";
import InfoSection from "@/components/LandingPage/InfoSection";
import { useSessionStorage } from "usehooks-ts";
import { getZkp } from "./actions/auth/zkp";
import { useEffect } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { createTeam } from "./actions/moveCalls/createTeam";

export default function Home() {
  const [state, setState, removeState] = useSessionStorage("state", "{}");
  const [session, setSession, removeSession] = useSessionStorage(
    "session",
    "{}",
  );

  // useEffect(() => {
  //   // TODO: Check if session exists - Need to refetch when signature is expired
  //   if (session !== "{}") return;

  //   noStore();
  //   getZkp(state)
  //     .then((res) => {
  //       const { data, error } = res;
  //       if (error) {
  //         console.log("Error: ", error);
  //         return;
  //       }
  //       console.log("Data: ", data);
  //       const { zkLoginUserAddress, inputs } = data;
  //       setSession(JSON.stringify({ zkLoginUserAddress, inputs }));
  //     })
  //     .catch((e) => console.log(e));
  // }, []);

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
      <SignUp />
      <Footer /> */}
    </>
  );
}
