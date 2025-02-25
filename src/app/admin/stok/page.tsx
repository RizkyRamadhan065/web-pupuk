"use client";
import { useState, useEffect } from "react";
import { db } from "@/app/services/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import DashboardLayout from "@/app/components/DashboardLayout";

interface Product {
  id: string;
  nama_produk: string;
}

interface Stock {
  id: string;
  id_produk: string;
  lokasi: string;
  jumlah: number;
}

export default function StokPage() {
  const [stokList, setStokList] = useState<Stock[]>([]);
  const [produkList, setProdukList] = useState<Product[]>([]);
  const [newStock, setNewStock] = useState({
    id_produk: "",
    lokasi: "",
    jumlah: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const stokSnapshot = await getDocs(collection(db, "stok"));
      const produkSnapshot = await getDocs(collection(db, "produk"));

      const stokData = stokSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Stock[];

      const produkData = produkSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setStokList(stokData);
      setProdukList(produkData);
    };

    fetchData();
  }, []);

  const handleAddStock = async () => {
    if (!newStock.id_produk || !newStock.lokasi || !newStock.jumlah) {
      return alert("Semua bidang harus diisi!");
    }

    const docRef = await addDoc(collection(db, "stok"), {
      ...newStock,
      jumlah: Number(newStock.jumlah),
    });

    setStokList([...stokList, { id: docRef.id, ...newStock, jumlah: Number(newStock.jumlah) }]);
    setNewStock({ id_produk: "", lokasi: "", jumlah: "" });
  };

  const handleDeleteStock = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus stok ini?")) return;

    await deleteDoc(doc(db, "stok", id));
    setStokList(stokList.filter((stock) => stock.id !== id));
  };

  return (
    <DashboardLayout activePage="Stok">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Manajemen Stok</h1>

        <div className="mb-6">
          <select className="border p-2 rounded w-full mb-2" value={newStock.id_produk} onChange={(e) => setNewStock({ ...newStock, id_produk: e.target.value })}>
            <option value="">Pilih Produk</option>
            {produkList.map((produk) => (
              <option key={produk.id} value={produk.id}>{produk.nama_produk}</option>
            ))}
          </select>
          <input type="text" placeholder="Lokasi" className="border p-2 rounded w-full mb-2" value={newStock.lokasi} onChange={(e) => setNewStock({ ...newStock, lokasi: e.target.value })} />
          <input type="number" placeholder="Jumlah" className="border p-2 rounded w-full mb-2" value={newStock.jumlah} onChange={(e) => setNewStock({ ...newStock, jumlah: e.target.value })} />
          <button className="bg-blue-500 text-white p-2 rounded mt-2" onClick={handleAddStock}>Tambah Stok</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
