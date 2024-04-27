import { motion } from "framer-motion";
export default function BottomButtonContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        height: 0,
        overflow: "hidden",
        marginTop: 0,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        height: "auto",
        overflow: "initial",
        marginTop: 8,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        height: 0,
        overflow: "hidden",
        marginTop: 0,
      }}
      className="flex flex-col gap-2"
    >
      {children}
    </motion.div>
  );
}
