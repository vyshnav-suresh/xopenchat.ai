import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin inline-block"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 0.8 }}
    />
  );
}
