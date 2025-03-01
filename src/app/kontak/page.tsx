"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Meta from "@/app/components/Meta";




export default function KontakPage() {
  const [form, setForm] = useState({ nama: "", email: "", pesan: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Pesan berhasil dikirim! 📩");
    setForm({ nama: "", email: "", pesan: "" });
  };

  return (

    <>

    <div className="bg-gray-100 min-h-screen flex flex-col">
    <Meta title="Kontak | Toko Pupuk Online" description="Hubungi kami untuk informasi lebih lanjut mengenai produk pupuk kami." />
      <Navbar />
      
      <div className="flex flex-col items-center justify-center px-6 py-12 flex-grow">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-green-700 mb-6 text-center"
        >
          Hubungi Kami 📞
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl"
        >
          <p className="text-gray-600 text-center mb-4">
            Ada pertanyaan? Kirim pesan atau hubungi kami melalui informasi di bawah ini.
          </p>

          {/* Formulir Kontak */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="nama"
              placeholder="Nama Anda"
              value={form.nama}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Anda"
              value={form.email}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <textarea
              name="pesan"
              placeholder="Pesan Anda"
              rows={4}
              value={form.pesan}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition"
            >
              <Send size={20} /> Kirim Pesan
            </motion.button>
          </form>
        </motion.div>

        {/* Informasi Kontak */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-center">
          <h3 className="text-xl font-semibold text-green-700 mb-4">Informasi Kontak</h3>
          <div className="flex flex-col gap-3 text-gray-800">
            <div className="flex items-center justify-center gap-2">
              <Mail size={20} className="text-green-600" /> 
              <span>tokopupuk@email.com</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone size={20} className="text-green-600" /> 
              <span>+62 812-3456-7890</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin size={20} className="text-red-600" /> 
              <span>Kopelma Darussalam, Banda Aceh</span>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mt-6 w-full max-w-2xl">
          <iframe
            className="w-full h-64 rounded-lg shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.457258012345!2d95.36682337415614!3d5.564704695949425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304037f2264df2cf%3A0xf1a2e8d9a8e8e123!2sDarussalam%2C%20Banda%20Aceh!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <Footer />
    </div>
    </>
  );
}
