"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/app/services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

// Definisi Interface untuk Admin
interface Admin {
  id: string;
  username: string;
  password: string;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    try {
      const adminCollection = collection(db, "admin");
      const adminSnapshot = await getDocs(adminCollection);
      const admins: Admin[] = adminSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Admin));

      const admin = admins.find((user) => user.username === username && user.password === password);

      if (admin) {
        alert("Login berhasil!");
        router.push("/dashboard"); // Ganti dengan halaman dashboard admin
      } else {
        setError("Username atau password salah.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login.");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: "100% 50%" }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 bg-[length:200%_200%]"
      />

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="relative bg-white p-6 rounded-lg shadow-lg w-80 z-10"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login Admin</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        
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
          onClick={handleLogin} 
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </motion.div>
    </div>
  );
}