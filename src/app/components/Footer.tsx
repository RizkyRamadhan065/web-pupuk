"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-gray-800 text-white py-6 mt-12"
    >
      <div className="container mx-auto text-center">
        <p className="text-lg font-semibold">Toko Pupuk Online</p>
        <p className="text-sm mt-2">
          &copy; {new Date().getFullYear()} Semua Hak Dilindungi.
        </p>
        <p className="text-sm mt-2">Hubungi kami di: support@tokopupuk.com</p>
      </div>
    </motion.footer>
  );
}
