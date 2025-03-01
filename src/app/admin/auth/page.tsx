"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/app/services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import Meta from "@/app/components/Meta";

interface Admin {
  id: string;
  username: string;
  password: string;
  nama: string;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Mencegah reload saat submit form

    setError("");

    try {
      const adminCollection = collection(db, "admin");
      const adminSnapshot = await getDocs(adminCollection);
      const admins: Admin[] = adminSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Admin));

      const admin = admins.find((user) => user.username === username);

      if (admin && bcrypt.compareSync(password, admin.password)) {
        const sessionData = {
          id: admin.id,
          name: admin.nama,
          username: admin.username,
          token: btoa(`${admin.id}:${new Date().getTime()}`),
        };

        localStorage.setItem("authSession", JSON.stringify(sessionData));

        setShowModal(true); // Tampilkan modal login sukses
      } else {
        setError("Username atau password salah.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login.");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <Meta title="Login Admin | Toko Pupuk Online" description="Masuk ke halaman admin untuk mengelola toko pupuk online dengan mudah dan cepat." />

      <motion.div 
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: "100% 50%" }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 bg-[length:200%_200%]"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="relative bg-white p-6 rounded-lg shadow-lg w-80 z-10"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login Admin</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button 
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </motion.div>

      {/* Modal Pop-Up untuk Login Sukses */}
      {showModal && (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
  >
    <motion.div 
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-white p-6 rounded-lg shadow-lg text-center w-80"
    >
      <h2 className="text-xl font-bold mb-2">Login Berhasil!</h2>
      <p className="text-gray-600">Anda akan diarahkan ke dashboard...</p>
      <button 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        onClick={() => router.push("/admin/dashboard")}
      >
        OK
      </button>
    </motion.div>
  </motion.div>
)}

    </div>
  );
}
