"use client";
import { useState, useEffect } from "react";
import { db } from "@/app/services/firebaseConfig"; // Pastikan sudah ada konfigurasi Firebase
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import DashboardLayout from "@/app/components/DashboardLayout";
import Meta from "@/app/components/Meta";

export default function KategoriPage() {
  const [kategoriList, setKategoriList] = useState<{ id: string; nama_kategori: string }[]>([]);
  const [newKategori, setNewKategori] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  // Ambil data kategori dari Firestore
  useEffect(() => {
    const fetchKategori = async () => {
      const querySnapshot = await getDocs(collection(db, "kategori"));
      const kategoriData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; nama_kategori: string }[];
      setKategoriList(kategoriData);
    };

    fetchKategori();
  }, []);

  // Tambah kategori
  const handleAddKategori = async () => {
    if (!newKategori) return alert("Nama kategori tidak boleh kosong!");

    const docRef = await addDoc(collection(db, "kategori"), {
      nama_kategori: newKategori,
    });

    setKategoriList([...kategoriList, { id: docRef.id, nama_kategori: newKategori }]);
    setNewKategori("");
  };

  // Edit kategori
  const handleEditKategori = async (id: string) => {
    if (!editedName) return alert("Nama kategori tidak boleh kosong!");

    const kategoriRef = doc(db, "kategori", id);
    await updateDoc(kategoriRef, { nama_kategori: editedName });

    setKategoriList(
      kategoriList.map((kat) => (kat.id === id ? { ...kat, nama_kategori: editedName } : kat))
    );
    setEditingId(null);
  };

  // Hapus kategori
  const handleDeleteKategori = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;

    await deleteDoc(doc(db, "kategori", id));
    setKategoriList(kategoriList.filter((kat) => kat.id !== id));
  };

  return (
    <DashboardLayout activePage="Kategori">
      <Meta title="Kategori Produk | Toko Pupuk Online" description="Jelajahi berbagai kategori pupuk untuk kebutuhan pertanian dan perkebunan Anda." />
      <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Manajemen Kategori</h1>

        {/* Form Tambah Kategori */}
        <div className="mb-4 flex">
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder="Nama kategori baru"
            value={newKategori}
            onChange={(e) => setNewKategori(e.target.value)}
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleAddKategori}
          >
            Tambah
          </button>
        </div>

        {/* Daftar Kategori */}
        <ul className="space-y-2">
          {kategoriList.map((kategori) => (
            <li key={kategori.id} className="flex justify-between items-center p-2 border rounded">
              {editingId === kategori.id ? (
                <input
                  type="text"
                  value={editedName}
                  className="flex-1 p-1 border rounded"
                  onChange={(e) => setEditedName(e.target.value)}
                />
              ) : (
                <span>{kategori.nama_kategori}</span>
              )}

              <div className="space-x-2">
                {editingId === kategori.id ? (
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    onClick={() => handleEditKategori(kategori.id)}
                  >
                    Simpan
                  </button>
                ) : (
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                    onClick={() => {
                      setEditingId(kategori.id);
                      setEditedName(kategori.nama_kategori);
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => handleDeleteKategori(kategori.id)}
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
}
