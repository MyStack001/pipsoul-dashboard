"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function AnimatedCard({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        delay,
      }}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: {
          type: "spring",
          stiffness: 300,
        },
      }}
    >
      {children}
    </motion.div>
  );
}