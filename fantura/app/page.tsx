"use client";
import Footer from "../components/Footer";
import Navbar from "@/components/Navbar";
import SignUp from "@/components/LandingPage/SignUp";
import HeroSection from "@/components/LandingPage/HeroSection";
import InfoSection from "@/components/LandingPage/InfoSection";
import { useSessionStorage } from "usehooks-ts";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { getZkp } from "./actions/zkp";
import { useEffect } from "react";
import { unstable_noStore as noStore } from "next/cache";

export default function Home() {
  const [state, setState, removeState] = useSessionStorage("state", "{}");
  const [session, setSession, removeSession] = useSessionStorage(
    "session",
    "{}"
  );

  useEffect(() => {
    // TODO: Check if session exists - Need to refetch when signature is expired
    if (session !== "{}") return;

    noStore();
    getZkp(state)
      .then((res) => {
        const { data, error } = res;
        if (error) {
          console.log("Error: ", error);
          return;
        }
        console.log("Data: ", data);
        const { zkLoginUserAddress, inputs } = data;
        setSession(JSON.stringify({ zkLoginUserAddress, inputs }));
      })
      .catch((e) => console.log(e));
  }, []);

  async function signUpUser() {}
  return (
    <>
      <Navbar isConnected={session !== "{}"} />
      {/* <HeroSection /> */}
      {/* <InfoSection />
      <SignUp />
      <Footer /> */}
    </>
  );
}
