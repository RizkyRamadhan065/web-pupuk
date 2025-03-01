"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "@/app/services/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import DashboardLayout from "@/app/components/DashboardLayout";
import EditStockModal from "@/app/components/EditStockModal";
import Meta from "@/app/components/Meta";

interface Product {
  id: string;
  nama_produk: string;
}

interface Stock {
  id: string;
  id_produk: string;
  nama_toko: string;
  lokasi: string;
  jumlah: number;
}

export default function StokPage() {
  const [stokList, setStokList] = useState<Stock[]>([]);
  const [produkList, setProdukList] = useState<Product[]>([]);
  const [newStock, setNewStock] = useState({
    id_produk: "",
    nama_toko: "",
    lokasi: "",
    jumlah: "",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      const stokSnapshot = await getDocs(collection(db, "stok"));
      const produkSnapshot = await getDocs(collection(db, "produk"));

      const stokData = stokSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Stock, "id">),
      }));

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
    if (!newStock.id_produk || !newStock.nama_toko || !newStock.lokasi || !newStock.jumlah) {
      return alert("Semua bidang harus diisi!");
    }

    const docRef = await addDoc(collection(db, "stok"), {
      ...newStock,
      jumlah: Number(newStock.jumlah),
    });

    setStokList([...stokList, { id: docRef.id, ...newStock, jumlah: Number(newStock.jumlah) }]);
    setNewStock({ id_produk: "", nama_toko: "", lokasi: "", jumlah: "" });
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteStock = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "stok", deleteId));
    setStokList(stokList.filter((stock) => stock.id !== deleteId));
    setDeleteId(null);
  };

  const handleOpenEditModal = (stock: Stock) => {
    setSelectedStock(stock);
    setIsEditModalOpen(true);
  };

  const handleUpdateStock = (updatedStock: Stock) => {
    setStokList(stokList.map((s) => (s.id === updatedStock.id ? updatedStock : s)));
  };
  
  

  return (
    <DashboardLayout activePage="Stok">
      <Meta title="Manajemen Stok | Toko Pupuk Online" description="Pantau dan atur ketersediaan stok pupuk di berbagai lokasi penyimpanan." />
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Manajemen Stok</h1>

        <div className="mb-6">
          <select className="border p-2 rounded w-full mb-2" value={newStock.id_produk} onChange={(e) => setNewStock({ ...newStock, id_produk: e.target.value })}>
            <option value="">Pilih Produk</option>
            {produkList.map((produk) => (
              <option key={produk.id} value={produk.id}>{produk.nama_produk}</option>
            ))}
          </select>
          <input type="text" placeholder="Nama Toko" className="border p-2 rounded w-full mb-2" value={newStock.nama_toko} onChange={(e) => setNewStock({ ...newStock, nama_toko: e.target.value })} />
          <input type="text" placeholder="Lokasi" className="border p-2 rounded w-full mb-2" value={newStock.lokasi} onChange={(e) => setNewStock({ ...newStock, lokasi: e.target.value })} />
          <input type="number" placeholder="Jumlah" className="border p-2 rounded w-full mb-2" value={newStock.jumlah} onChange={(e) => setNewStock({ ...newStock, jumlah: e.target.value })} />
          <button className="bg-blue-500 text-white p-2 rounded mt-2" onClick={handleAddStock}>Tambah Stok</button>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">No</th>
              <th className="border p-2">Produk</th>
              <th className="border p-2">Nama Toko</th>
              <th className="border p-2">Lokasi</th>
              <th className="border p-2">Jumlah</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {stokList.map((stok, index) => (
              <tr key={stok.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{produkList.find(p => p.id === stok.id_produk)?.nama_produk || "-"}</td>
                <td className="border p-2">{stok.nama_toko}</td>
                <td className="border p-2">{stok.lokasi}</td>
                <td className="border p-2">{stok.jumlah}</td>
                <td className="border p-2 flex justify-center space-x-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => handleOpenEditModal(stok)}>Edit</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => confirmDelete(stok.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-center">Konfirmasi Hapus</h2>
            <p className="text-center mb-4">Apakah Anda yakin ingin menghapus stok ini?</p>
            <div className="flex justify-center space-x-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Batal</button>
              <button onClick={handleDeleteStock} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Hapus</button>
            </div>
          </motion.div>
        </div>
      )}
      <EditStockModal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  stock={selectedStock!}
  onUpdate={handleUpdateStock}
  products={produkList}
/>
    </DashboardLayout>
  );
}