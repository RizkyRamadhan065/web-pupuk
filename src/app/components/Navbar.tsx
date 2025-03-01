"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Home, Package, Phone } from "lucide-react"; // Import ikon dari Lucide

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-green-700 text-white py-4 shadow-md"
    >
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Leaf size={32} className="text-yellow-300" /> {/* Ikon daun sebagai logo */}
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold cursor-pointer"
          >
            Toko Pupuk Online
          </motion.h1>
        </Link>

        {/* Menu */}
        <div className="flex gap-6">
          <Link href="/" className="flex items-center gap-2 hover:text-gray-300 transition">
            <Home size={20} /> Home
          </Link>
          <Link href="/produk" className="flex items-center gap-2 hover:text-gray-300 transition">
            <Package size={20} /> Produk
          </Link>
          <Link href="/kontak" className="flex items-center gap-2 hover:text-gray-300 transition">
            <Phone size={20} /> Kontak
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
