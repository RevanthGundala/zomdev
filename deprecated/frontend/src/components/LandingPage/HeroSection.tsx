import React from "react";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";

// export default function HeroSection({ isInView1 }: { isInView1: boolean }) {
//   return (
//     <motion.div
//       initial={{
//         backgroundColor: "#FFFFFF",
//       }}
//       animate={{
//         backgroundColor: isInView1 ? "#000000" : "#FFFFFF",
//       }}
//       transition={{ duration: 1 }}
//       className="min-h-screen mt-80"
//     >
//       <motion.h1
//         initial={{
//           opacity: 0,
//           y: 20,
//         }}
//         animate={{
//           opacity: 1,
//           y: [20, -5, 0],
//         }}
//         transition={{
//           duration: 0.5,
//           ease: [0.4, 0.0, 0.2, 1],
//         }}
//         className="px-20 text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-3xl leading-relaxed lg:leading-snug"
//       >
//         Earn rewards for supporting the people you love
//       </motion.h1>
//       <motion.p
//         initial={{
//           opacity: 0,
//           y: 20,
//         }}
//         animate={{
//           opacity: 1,
//           y: [20, -5, 0],
//         }}
//         transition={{
//           duration: 0.5,
//           ease: [0.4, 0.0, 0.2, 1],
//         }}
//         className="py-8 px-20 md:text-2xl max-w-2xl"
//       >
//         {/* A Fan Engagement Platform built for entertainers and fans */}
//         {/* Loyalty Programs for Entertainers */}
//         Fantura is the first platform that turns your engagement into assets
//       </motion.p>
//       <motion.div
//         initial={{
//           opacity: 0,
//           y: 20,
//         }}
//         animate={{
//           opacity: 1,
//           y: [20, -5, 0],
//         }}
//         transition={{
//           duration: 0.5,
//           ease: [0.4, 0.0, 0.2, 1],
//         }}
//       ></motion.div>

//       {/* <CreatorsAnimation /> */}
//     </motion.div>
//   );
// }

export default function HeroSection() {
  return (
    // <>
    //   <iframe
    //     src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&loop=1&playlist=dQw4w9WgXcQ"
    //     frameBorder="0"
    //     allowFullScreen
    //     allow="autoplay"
    //   />
    //   <div className="min-h-screen mt-80">
    //     <h1 className="px-20 text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-3xl leading-relaxed lg:leading-snug">
    //       Earn rewards for supporting the people you love
    //     </h1>
    //     <p className="py-8 px-20 md:text-2xl max-w-2xl">

    //       Fantura is the first platform that turns your engagement into assets
    //     </p>
    //   </div>
    // </>
    <div className="relative min-h-screen">
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&loop=1&playlist=dQw4w9WgXcQ"
        allowFullScreen
        allow="autoplay"
        className="absolute top-0 left-0 w-full h-full"
      ></iframe>

      <div className="relative z-10 pt-80 px-20 ">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-3xl leading-relaxed lg:leading-snug">
          Earn rewards for supporting the people you love
        </h1>
        <p className="mt-8 md:text-2xl max-w-2xl">
          Fantura is the first platform that turns your engagement into assets
        </p>
      </div>
    </div>
  );
}

{
  /* A Fan Engagement Platform built for entertainers and fans */
}
{
  /* Loyalty Programs for Entertainers */
}
