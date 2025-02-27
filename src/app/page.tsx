"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/app/services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  nama_produk: string;
  harga: number;
  deskripsi: string;
  gambar: string;
  id_kategori: string;
}

interface Category {
  id: string;
  nama_kategori: string;
}

export default function HomePage() {
  const [produkList, setProdukList] = useState<Product[]>([]);
  const [kategoriList, setKategoriList] = useState<Category[]>([]);
  const [filterKategori, setFilterKategori] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      const produkSnapshot = await getDocs(collection(db, "produk"));
      const produkData = produkSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
      setProdukList(produkData);
    };
    
    const fetchCategories = async () => {
      const kategoriSnapshot = await getDocs(collection(db, "kategori"));
      const kategoriData = kategoriSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Category[];
      setKategoriList(kategoriData);
    };
    
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = produkList.filter((produk) => 
    (filterKategori ? produk.id_kategori === filterKategori : true) &&
    produk.nama_produk.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      {/* Animated Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-gradient-to-br from-green-300 to-green-600 opacity-30"
      />
      
      <motion.header 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="relative bg-green-700 text-white text-center p-6 text-3xl font-bold shadow-lg"
      >
        Toko Pupuk Online
      </motion.header>
      
      <div className="relative container mx-auto py-8 px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-2xl font-semibold text-gray-800 mb-6 text-center"
        >
          Temukan Pupuk Berkualitas untuk Tanaman Anda
        </motion.h2>
        
        {/* Search Input */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 border rounded-lg bg-white shadow-sm w-full max-w-md"
          />
        </div>
        
        {/* Kategori Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button 
            className={`p-3 border rounded-lg shadow-sm transition-all ${filterKategori === "" ? "bg-green-600 text-white" : "bg-white hover:bg-gray-200"}`}
            onClick={() => setFilterKategori("")}
          >
            Semua Kategori
          </button>
          {kategoriList.map((kategori) => (
            <button 
              key={kategori.id}
              className={`p-3 border rounded-lg shadow-sm transition-all ${filterKategori === kategori.id ? "bg-green-600 text-white" : "bg-white hover:bg-gray-200"}`}
              onClick={() => setFilterKategori(kategori.id)}
            >
              {kategori.nama_kategori}
            </button>
          ))}
        </div>
        
        {/* Produk List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {filteredProducts.map((produk) => (
            <motion.div 
              key={produk.id} 
              className="bg-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105"
              whileHover={{ scale: 1.05 }}
            >
              <Image src={produk.gambar} alt={produk.nama_produk} width={300} height={200} className="rounded-lg" />
              <h3 className="text-xl font-bold mt-4 text-gray-900">{produk.nama_produk}</h3>
              <p className="text-gray-600 mt-2">{produk.deskripsi}</p>
              <p className="text-green-700 font-bold text-lg mt-2">Rp {produk.harga.toLocaleString()}</p>
              <Link href={`/produk/${produk.id}`}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
                >
                  Lihat Detail
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
