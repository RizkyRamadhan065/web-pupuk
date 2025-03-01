"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import DashboardLayout from "@/app/components/DashboardLayout";
import Meta from "@/app/components/Meta";

export default function DashboardPage() {
  const [adminName, setAdminName] = useState<string | null>(null);
  const [counts, setCounts] = useState({ produk: 0, kategori: 0, stok: 0 });

  useEffect(() => {
    // Ambil nama admin dari session
    const session = localStorage.getItem("authSession");
    if (session) {
      const { name } = JSON.parse(session); // Mengambil "nama" dari session, bukan username
      setAdminName(name);
    }

    // Ambil jumlah data dari Firestore
    const fetchData = async () => {
      const produkSnapshot = await getDocs(collection(db, "produk"));
      const kategoriSnapshot = await getDocs(collection(db, "kategori"));
      const stokSnapshot = await getDocs(collection(db, "stok"));

      setCounts({
        produk: produkSnapshot.size,
        kategori: kategoriSnapshot.size,
        stok: stokSnapshot.size,
      });
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout activePage="Beranda">
      <Meta title="Dashboard Admin | Toko Pupuk Online" description="Pantau dan kelola produk, stok, serta kategori pupuk dengan dashboard admin." />
      <h1 className="text-2xl font-bold mb-6">
        Selamat Datang, <span className="text-blue-600">{adminName || "Admin"}!</span>
      </h1>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-500 text-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Total Produk</h2>
          <p className="text-3xl font-bold">{counts.produk}</p>
        </div>

        <div className="p-6 bg-green-500 text-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Total Kategori</h2>
          <p className="text-3xl font-bold">{counts.kategori}</p>
        </div>

        <div className="p-6 bg-red-500 text-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Total Stok</h2>
          <p className="text-3xl font-bold">{counts.stok}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
