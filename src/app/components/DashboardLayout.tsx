"use client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
  activePage: string;
}

const menuItems = [
  { name: "Beranda", path: "/admin/dashboard" },
  { name: "Profile", path: "/admin/profile" },
  { name: "Kategori", path: "/admin/kategori" },
  { name: "Produk", path: "/admin/produk" },
  { name: "Stok", path: "/admin/stok" }
];

export default function DashboardLayout({ children, activePage }: DashboardLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const authSession = localStorage.getItem("authSession");

    if (!authSession) {
      router.replace("/admin/auth"); // Redirect ke login jika tidak ada sesi
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authSession"); // Hapus sesi
    router.replace("/admin/auth"); // Redirect ke login
  };

  if (loading) {
    return <p className="text-center mt-10">Memuat...</p>; // Menampilkan loading sebelum validasi selesai
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -200 }} 
        animate={{ x: 0 }} 
        transition={{ duration: 0.5 }}
        className="w-64 bg-gray-800 text-white p-5 space-y-4 flex flex-col justify-between"
      >
        <div>
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
        </div>

        {/* Tombol Logout */}
        <button 
          onClick={() => setShowLogoutModal(true)} 
          className="w-full px-4 py-2 mt-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        {children}
      </div>

      {/* Modal Logout */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-lg w-80 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-lg font-bold mb-4">Konfirmasi Logout</h3>
              <p className="text-gray-600 mb-4">Apakah Anda yakin ingin keluar?</p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Ya, Keluar
                </button>
                <button 
                  onClick={() => setShowLogoutModal(false)} 
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
