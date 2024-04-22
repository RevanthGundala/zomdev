import { motion } from "framer-motion";
import React from "react";
import { HeroHighlight } from "../ui/hero-highlight";

const items = [
  {
    image: "./Fantura Overview.png",
    icon: "./next.svg",
    title: "Engage More Often",
    description:
      "Watch your favorite youtubers more, listen to your favorite musicians more often, and go to more games of your favorite teams",
  },
  {
    image: "./Fantura Overview.png",
    icon: "./next.svg",
    title: "Earn points from engagement",
    description:
      "Tally up points from every interaction you have with your favorite entertainers",
  },
  {
    image: "./Fantura Overview.png",
    icon: "./next.svg",
    title: "Turn your points into rewards",
    description: "Redeem your points for exclusive rewards and experiences",
  },
  {
    image: "./Fantura Overview.png",
    icon: "./next.svg",
    title: "Show off your support",
    description:
      "Let everyone know how much you support your favorite entertainers on our public leaderboard",
  },
];

interface Item {
  image: string;
  icon: string;
  title: string;
  description: string;
}

export default function InfoSection({
  isInView1,
  section1,
}: {
  isInView1: boolean;
  section1: any;
}) {
  return (
    <motion.div
      initial={{
        backgroundColor: "#FFFFFF",
      }}
      animate={{
        backgroundColor: isInView1 ? "#FFFFFF" : "#FFFFFF",
      }}
      transition={{ duration: 1 }}
      ref={section1}
      className="min-h-screen"
    >
      <HeroHighlight>
        <motion.p
          className={
            isInView1
              ? "text-black text-center text-xl md:text-4xl lg:text-6xl lg:mx-60"
              : "text-black text-center text-xl md:text-4xl lg:text-6xl lg:mx-60"
          }
        >
          {/* Turn your engagement into an asset */}A Loyalty Program for
          Entertainers
        </motion.p>
      </HeroHighlight>
      {items.map((item, i) => (
        <Info item={item} index={i} />
      ))}
    </motion.div>
  );
}

function Info({ item, index }: { item: Item; index: number }) {
  const { image, icon, title, description } = item;
  return (
    <motion.div
      className={
        index % 2 === 0
          ? "flex justify-between lg:mx-60"
          : "flex flex-row-reverse justify-between lg:mx-60"
      }
    >
      <motion.div className="flex flex-col justify-center space-y-12">
        <motion.img src={icon} alt={title} className="h-20 w-20" />
        <motion.p className="font-bold lg:text-4xl">{title}</motion.p>
        <motion.p className="lg:text-xl max-w-[400px]">{description}</motion.p>
      </motion.div>
      <motion.img src={image} alt={title} className="h-30 w-30 rounded-xl" />
    </motion.div>
  );
}
