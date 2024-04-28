"use client";
import Footer from "../components/Footer";
import Navbar from "@/components/Navbar";
import SignUp from "@/components/LandingPage/SignUp";
import HeroSection from "@/components/LandingPage/HeroSection";
import InfoSection from "@/components/LandingPage/InfoSection";
import { useSessionStorage } from "usehooks-ts";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { getZkp } from "./actions/zkp";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { useEffect } from "react";

interface State {
  maxEpoch: number;
  ephemeralKey: Ed25519Keypair;
  jwtRandomness: string;
}

export default function Home() {
  const [state, setState, removeState] = useSessionStorage("state", "{}");

  const [session, setSession, removeSession] = useSessionStorage(
    "session",
    "{}"
  );

  // const supabase = createClient();
  // const jwt = cookies().get("jwt")?.value;
  // const res = await supabase.auth.signInWithIdToken({
  //   provider: "google",
  //   token: jwt ?? "",
  // });
  // console.log("Res: ", res);

  useEffect(() => {
    // Check if session exists
    if (session) return;

    const decodedState = JSON.parse(state) as State;
    getZkp(decodedState)
      .then((res) => {
        const { data, error } = res;
        if (error) {
          console.log("Error: ", error);
          return;
        }
        console.log("Data: ", data);
        setSession(data);
      })
      .catch((e) => console.log(e));
  }, []);

  async function signOut() {}
  async function signUpUser() {}
  return (
    <>
      <Navbar />
      {/* <HeroSection /> */}
      {/* <InfoSection />
      <SignUp />
      <Footer /> */}
    </>
  );
}
