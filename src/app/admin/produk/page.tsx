"use client";
import { useState, useEffect } from "react";
import { db } from "@/app/services/firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import DashboardLayout from "@/app/components/DashboardLayout";
import EditProductModal from "@/app/components/EditProductModal"; // Sesuaikan path jika perlu
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";

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
  const [notification, setNotification] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  

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

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "webPupuk");

    try {
      const response = await axios.post("https://api.cloudinary.com/v1_1/dly9dkvgy/image/upload", formData);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

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
    setNotification("Produk berhasil ditambahkan!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    await deleteDoc(doc(db, "produk", id));
    setProdukList(produkList.filter((prod) => prod.id !== id));
    setNotification("Produk berhasil dihapus!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProdukList((prevProdukList) =>
      prevProdukList.map((prod) => (prod.id === updatedProduct.id ? updatedProduct : prod))
    );
  };
  

  return (
    <DashboardLayout activePage="Produk">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Manajemen Produk</h1>
        {notification && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-green-500 text-white p-3 rounded mb-4">
            {notification}
          </motion.div>
        )}

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

        <table className="w-full border-collapse border border-gray-200 mt-6">
        <thead>
  <tr className="bg-gray-100 text-center">
    <th className="border p-2">No</th>
    <th className="border p-2">Nama</th>
    <th className="border p-2">Kategori</th>
    <th className="border p-2">Harga</th>
    <th className="border p-2">Gambar</th>
    <th className="border p-2">Aksi</th>
  </tr>
</thead>
<tbody>
  {produkList.map((produk, index) => (
    <tr key={produk.id} className="border text-center">
      <td className="border p-2">{index + 1}</td> {/* Tambahan kolom nomor */}
      <td className="border p-2">{produk.nama_produk}</td>
      <td className="border p-2">{kategoriList.find(k => k.id === produk.id_kategori)?.nama_kategori || "-"}</td>
      <td className="border p-2">{produk.harga}</td>
      <td className="border p-2">
        <div className="flex justify-center">
          <Image src={produk.gambar} alt="Produk" width={50} height={50} />
        </div>
      </td>
      <td className="border p-2">
        <div className="flex justify-center space-x-2">
          <button onClick={() => handleEditProduct(produk)} className="bg-yellow-500 text-white px-3 py-1 rounded">
            Edit
          </button>
          <button onClick={() => handleDeleteProduct(produk.id)} className="bg-red-500 text-white px-3 py-1 rounded">
            Hapus
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {editProduct && (
  <EditProductModal
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    product={editProduct}
    onUpdate={handleUpdateProduct}
  />
)}

    </DashboardLayout>
  );
}
