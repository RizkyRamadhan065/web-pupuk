"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
  activePage: string; // Menerima nama halaman aktif dari props
}

const menuItems = [
  { name: "Beranda", path: "/admin/dashboard" },
  { name: "Profile", path: "/admin/profile" },
  { name: "Kategori", path: "/admin/kategori" },
  { name: "Produk", path: "/admin/produk" },
  { name: "Stok", path: "/admin/stok" }
];

export default function DashboardLayout({ children, activePage }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -200 }} 
        animate={{ x: 0 }} 
        transition={{ duration: 0.5 }}
        className="w-64 bg-gray-800 text-white p-5 space-y-4"
      >
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.path}>
              <div 
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  activePage === item.name ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
              >
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        {children}
      </div>
    </div>
  );
}
