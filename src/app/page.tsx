"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/app/services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Meta from "@/app/components/Meta";

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
       <Meta 
        title="Toko Pupuk Online | Solusi Terbaik untuk Tanaman Anda" 
        description="Temukan berbagai pupuk berkualitas tinggi untuk meningkatkan hasil pertanian Anda. Toko Pupuk Online menyediakan produk terbaik untuk tanaman Anda." 
      />
      <Navbar />
      
      {/* Hero Carousel */}
      <Carousel
  showThumbs={false}
  autoPlay
  infiniteLoop
  className="w-full max-w-4xl mx-auto mt-6 rounded-lg overflow-hidden"
>
  <div className="relative w-full h-[300px] md:h-[400px]">
    <Image src="/banner.webp" alt="Promo Toko Pupuk" layout="fill" objectFit="cover" className="rounded-lg" />
  </div>
  <div className="relative w-full h-[300px] md:h-[400px]">
    <Image src="/produk-terlaris.webp" alt="Produk Pupuk Terlaris" layout="fill" objectFit="cover" className="rounded-lg" />
  </div>
  <div className="relative w-full h-[300px] md:h-[400px]">
    <Image src="/testimoni.webp" alt="Testimoni Pelanggan" layout="fill" objectFit="cover" className="rounded-lg" />
  </div>
  <div className="relative w-full h-[300px] md:h-[400px]">
    <Image src="/edukasi.webp" alt="Informasi Edukasi Pupuk" layout="fill" objectFit="cover" className="rounded-lg" />
  </div>
</Carousel>



      {/* Produk Unggulan */}
      <div className="container mx-auto py-12 px-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Produk Unggulan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {produkList.slice(0, 3).map((produk) => (
            <motion.div 
              key={produk.id} 
              className="bg-white p-6 rounded-lg shadow-lg transform transition hover:scale-105"
              whileHover={{ scale: 1.05 }}
            >
              <Image src={produk.gambar} alt={produk.nama_produk} width={300} height={200} className="rounded-lg" />
              <h3 className="text-xl font-bold mt-4">{produk.nama_produk}</h3>
              <p className="text-green-700 font-bold text-lg">Rp {produk.harga.toLocaleString()}</p>
              <Link href={`/produk/${produk.id}`}>
                <motion.button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">
                  Lihat Detail
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Keunggulan Kami */}
      <div className="bg-green-700 text-white py-12 text-center">
        <h2 className="text-3xl font-semibold mb-6">Kenapa Belanja di Toko Kami?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 bg-white text-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">100% Organik</h3>
            <p>Kami menjual pupuk berkualitas tinggi yang ramah lingkungan.</p>
          </div>
          <div className="p-6 bg-white text-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Harga Terbaik</h3>
            <p>Harga bersaing dengan kualitas yang terjamin.</p>
          </div>
          <div className="p-6 bg-white text-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Pengiriman Cepat</h3>
            <p>Pesanan dikirim dalam waktu singkat ke seluruh Indonesia.</p>
          </div>
        </div>
      </div>

      {/* Testimoni Pelanggan */}
      <div className="container mx-auto py-12 px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Testimoni Pelanggan</h2>
        <p className="text-lg text-gray-600">"Pupuk dari toko ini sangat bagus, tanaman saya tumbuh lebih subur!" - Andi, Jakarta</p>
      </div>

      {/* CTA */}
      <div className="bg-green-600 text-white py-12 text-center">
        <h2 className="text-3xl font-bold">Mulai Berbelanja Sekarang!</h2>
        <p className="text-lg mt-4">Dapatkan pupuk berkualitas dengan harga terbaik.</p>
        <Link href="/produk">
          <motion.button
            className="mt-6 bg-white text-green-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-gray-200"
            whileHover={{ scale: 1.1 }}
          >
            Lihat Produk
          </motion.button>
        </Link>
      </div>

      <Footer />
    </div>
  );
}
