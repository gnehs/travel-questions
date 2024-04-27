import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
export default function Button({
  children,
  className,
  color,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      className={twMerge(
        "rounded-xl p-2 md:p-3 w-full md:text-xl flex items-center justify-center gap-2 font-bold transition-colors group",
        color === "blue"
          ? "bg-blue-200 hover:bg-blue-300 active:bg-blue-400 text-blue-800"
          : "",
        color === "red"
          ? "bg-red-200 hover:bg-red-300 active:bg-red-400 text-red-800"
          : "",
        color === "green"
          ? "bg-green-200 hover:bg-green-300 active:bg-green-400 text-green-800"
          : "",
        color === "teal"
          ? "bg-teal-200 hover:bg-teal-300 active:bg-teal-400 text-teal-800"
          : "",
        color === "stone"
          ? "bg-stone-200 hover:bg-stone-300 active:bg-stone-400 text-stone-800"
          : "",
        className
      )}
      onClick={onClick}
      whileTap={{
        scale: 0.95,
      }}
    >
      {children}
    </motion.button>
  );
}
