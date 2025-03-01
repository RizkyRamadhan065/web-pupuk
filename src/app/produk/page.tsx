"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Meta from "@/app/components/Meta";

interface Product {
  id: string;
  nama_produk: string;
  harga: number;
  deskripsi: string;
  gambar: string;
  id_kategori: string;
  nama_kategori?: string; // Ditambahkan untuk menyimpan nama kategori setelah pemetaan
}

export default function ProdukPage() {
  const [produkList, setProdukList] = useState<Product[]>([]);
  const [filteredProduk, setFilteredProduk] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [kategoriList, setKategoriList] = useState<string[]>(["Semua"]);

  useEffect(() => {
    const fetchData = async () => {
      // Ambil kategori dan buat pemetaan id_kategori -> nama_kategori
      const kategoriSnapshot = await getDocs(collection(db, "kategori"));
      const kategoriMap: Record<string, string> = {};
      kategoriSnapshot.docs.forEach((doc) => {
        kategoriMap[doc.id] = doc.data().nama_kategori;
      });

      // Perbarui daftar kategori yang tersedia
      setKategoriList(["Semua", ...Object.values(kategoriMap)]);

      // Ambil produk
      const produkSnapshot = await getDocs(collection(db, "produk"));
      const produkData = produkSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nama_produk: data.nama_produk,
          harga: data.harga,
          deskripsi: data.deskripsi,
          gambar: data.gambar,
          id_kategori: data.id_kategori,
          nama_kategori: kategoriMap[data.id_kategori] || "Tidak Diketahui",
        };
      }) as Product[];

      setProdukList(produkData);
      setFilteredProduk(produkData);
    };

    fetchData();
  }, []);

  // Filter produk berdasarkan pencarian & kategori
  useEffect(() => {
    let filtered = produkList;

    if (searchQuery) {
      filtered = filtered.filter((produk) =>
        produk.nama_produk.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "Semua") {
      filtered = filtered.filter((produk) => produk.nama_kategori === selectedCategory);
    }

    setFilteredProduk(filtered);
  }, [searchQuery, selectedCategory, produkList]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Meta title="Produk | Toko Pupuk Online" description="Lihat berbagai pilihan pupuk berkualitas tinggi untuk tanaman Anda." />
      <Navbar />
      <div className="container mx-auto py-8 px-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Daftar Produk
        </h2>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Cari produk..."
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Kategori Filter */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {kategoriList.map((kategori) => (
            <button
              key={kategori}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === kategori ? "bg-green-600 text-white" : "bg-white border border-gray-300"
              } hover:bg-green-700 transition`}
              onClick={() => setSelectedCategory(kategori)}
            >
              {kategori}
            </button>
          ))}
        </div>

        {/* Produk List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProduk.length > 0 ? (
            filteredProduk.map((produk) => (
              <div key={produk.id} className="bg-white p-6 rounded-lg shadow-lg">
                <Image src={produk.gambar} alt={produk.nama_produk} width={300} height={200} className="rounded-lg" />
                <h3 className="text-xl font-bold mt-4">{produk.nama_produk}</h3>
                <p className="text-green-700 font-bold text-lg">Rp {produk.harga.toLocaleString()}</p>
                <p className="text-gray-600">Kategori: {produk.nama_kategori}</p>
                <Link href={`/produk/${produk.id}`}>
                  <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Lihat Detail
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Produk tidak ditemukan.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
