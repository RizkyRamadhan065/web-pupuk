'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/app/services/firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

//   const handleLogin = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       alert("Login successful");
//     } catch (err) {
//       setError("Login failed. Check your credentials.");
//     }
//   };

const handleLogin = async () => {

}

return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: "100% 50%" }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 bg-[length:200%_200%]"
      ></motion.div>
      
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
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleLogin} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Login</button>
      </motion.div>
    </div>
  );
}
