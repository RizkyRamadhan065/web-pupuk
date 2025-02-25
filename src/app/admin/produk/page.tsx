"use client";
import { useState, useEffect } from "react";
import { db } from "@/app/services/firebaseConfig"; // Konfigurasi Firebase
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import DashboardLayout from "@/app/components/DashboardLayout";
import axios from "axios";

interface Product {
  id: string;
  nama_produk: string;
  id_kategori: string;
  harga: number;
  deskripsi: string;
  gambar: string;
}

export default function ProdukPage() {
  const [produkList, setProdukList] = useState<Product[]>([]);
  const [kategoriList, setKategoriList] = useState<{ id: string; nama_kategori: string }[]>([]);
  const [newProduct, setNewProduct] = useState({
    nama_produk: "",
    id_kategori: "",
    harga: "",
    deskripsi: "",
    gambar: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});

  // Ambil data produk & kategori dari Firestore
  useEffect(() => {
    const fetchData = async () => {
      const produkSnapshot = await getDocs(collection(db, "produk"));
      const kategoriSnapshot = await getDocs(collection(db, "kategori"));

      const produkData = produkSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      const kategoriData = kategoriSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; nama_kategori: string }[];

      setProdukList(produkData);
      setKategoriList(kategoriData);
    };

    fetchData();
  }, []);

  // Upload gambar ke Cloudinary
  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "your_upload_preset"); // Ganti dengan upload preset Cloudinary Anda

    try {
      const response = await axios.post("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", formData);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Tambah produk baru
  const handleAddProduct = async () => {
    if (!newProduct.nama_produk || !newProduct.id_kategori || !newProduct.harga || !newProduct.deskripsi) {
      return alert("Semua bidang harus diisi!");
    }

    const imageUrl = await uploadImage();
    if (!imageUrl) return alert("Gagal mengupload gambar!");

    const docRef = await addDoc(collection(db, "produk"), {
      ...newProduct,
      harga: Number(newProduct.harga),
      gambar: imageUrl,
    });

    setProdukList([...produkList, { id: docRef.id, ...newProduct, harga: Number(newProduct.harga), gambar: imageUrl }]);
    setNewProduct({ nama_produk: "", id_kategori: "", harga: "", deskripsi: "", gambar: "" });
    setImageFile(null);
  };

  // Hapus produk
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    await deleteDoc(doc(db, "produk", id));
    setProdukList(produkList.filter((prod) => prod.id !== id));
  };

  return (
    <DashboardLayout activePage="Produk">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Manajemen Produk</h1>

        {/* Form Tambah Produk */}
        <div className="mb-6">
          <input type="text" placeholder="Nama Produk" className="border p-2 rounded w-full mb-2" value={newProduct.nama_produk} onChange={(e) => setNewProduct({ ...newProduct, nama_produk: e.target.value })} />
          <select className="border p-2 rounded w-full mb-2" value={newProduct.id_kategori} onChange={(e) => setNewProduct({ ...newProduct, id_kategori: e.target.value })}>
            <option value="">Pilih Kategori</option>
            {kategoriList.map((kategori) => (
              <option key={kategori.id} value={kategori.id}>{kategori.nama_kategori}</option>
            ))}
          </select>
          <input type="number" placeholder="Harga" className="border p-2 rounded w-full mb-2" value={newProduct.harga} onChange={(e) => setNewProduct({ ...newProduct, harga: e.target.value })} />
          <textarea placeholder="Deskripsi" className="border p-2 rounded w-full mb-2" value={newProduct.deskripsi} onChange={(e) => setNewProduct({ ...newProduct, deskripsi: e.target.value })}></textarea>
          <input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          <button className="bg-blue-500 text-white p-2 rounded mt-2" onClick={handleAddProduct}>Tambah Produk</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
