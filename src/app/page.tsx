"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/app/services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface Product {
  id: string;
  nama_produk: string;
  harga: number;
  deskripsi: string;
  gambar: string;
}

export default function HomePage() {
  const [produkList, setProdukList] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const produkSnapshot = await getDocs(collection(db, "produk"));
      const produkData = produkSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
      setProdukList(produkData);
    };

    fetchProducts();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100">
      <Navbar />
      <motion.header className="relative bg-green-700 text-white text-center p-6 text-3xl font-bold">
        Toko Pupuk Online
      </motion.header>

      <div className="container mx-auto py-8 px-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Produk Unggulan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {produkList.slice(0, 3).map((produk) => (
            <motion.div key={produk.id} className="bg-white p-6 rounded-lg shadow-lg transform transition hover:scale-105">
              <Image src={produk.gambar} alt={produk.nama_produk} width={300} height={200} className="rounded-lg" />
              <h3 className="text-xl font-bold mt-4">{produk.nama_produk}</h3>
              <p className="text-green-700 font-bold text-lg">Rp {produk.harga.toLocaleString()}</p>
              <Link href={`/produk`}>
                <motion.button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">
                  Lihat Semua Produk
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
