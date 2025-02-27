import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/app/services/firebaseConfig";
import axios from "axios";

interface Product {
  id: string;
  nama_produk: string;
  id_kategori: string;
  harga: number;
  deskripsi: string;
  gambar: string;
}

interface Kategori {
  id: string;
  nama_kategori: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, product, onUpdate }) => {
  const [editData, setEditData] = useState<Product>(product);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);

  useEffect(() => {
    if (product) setEditData(product);
  }, [product]);

  useEffect(() => {
    const fetchKategori = async () => {
      const kategoriSnapshot = await getDocs(collection(db, "kategori"));
      const kategoriData = kategoriSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Kategori[];
      setKategoriList(kategoriData);
    };
    fetchKategori();
  }, []);

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return editData.gambar;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "webPupuk");

    try {
      const response = await axios.post("https://api.cloudinary.com/v1_1/dly9dkvgy/image/upload", formData);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return editData.gambar;
    }
  };

  const handleUpdate = async () => {
    const imageUrl = await uploadImage();
    const productRef = doc(db, "produk", product.id);
    await updateDoc(productRef, { ...editData, gambar: imageUrl });
    onUpdate({ ...editData, gambar: imageUrl });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Produk</h2>
        <input type="text" placeholder="Nama Produk" className="border p-2 rounded w-full mb-2" value={editData.nama_produk} onChange={(e) => setEditData({ ...editData, nama_produk: e.target.value })} />
        <select className="border p-2 rounded w-full mb-2" value={editData.id_kategori} onChange={(e) => setEditData({ ...editData, id_kategori: e.target.value })}>
          <option value="">Pilih Kategori</option>
          {kategoriList.map((kategori) => (
            <option key={kategori.id} value={kategori.id}>{kategori.nama_kategori}</option>
          ))}
        </select>
        <input type="number" placeholder="Harga" className="border p-2 rounded w-full mb-2" value={editData.harga} onChange={(e) => setEditData({ ...editData, harga: Number(e.target.value) })} />
        <textarea placeholder="Deskripsi" className="border p-2 rounded w-full mb-2" value={editData.deskripsi} onChange={(e) => setEditData({ ...editData, deskripsi: e.target.value })}></textarea>
        <input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="mb-2" />
        <div className="flex justify-end space-x-2">
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>Batal</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpdate}>Simpan</button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProductModal;
