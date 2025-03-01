import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/services/firebaseConfig";

interface Stock {
  id: string;
  id_produk: string;
  nama_toko: string;
  lokasi: string;
  jumlah: number;
}

interface Product {
  id: string;
  nama_produk: string;
}

interface EditStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock;
  onUpdate: (updatedStock: Stock) => void;
  products: Product[];
}

const EditStockModal: React.FC<EditStockModalProps> = ({ isOpen, onClose, stock, onUpdate, products }) => {
  const [editData, setEditData] = useState<Stock>({ ...stock });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (stock) {
      setEditData(stock);
    }
  }, [stock]);

  const handleUpdate = async () => {
    if (
      editData.id_produk === stock.id_produk &&
      editData.nama_toko === stock.nama_toko &&
      editData.lokasi === stock.lokasi &&
      editData.jumlah === stock.jumlah
    ) {
      alert("Tidak ada perubahan data.");
      return;
    }

    setLoading(true);
    try {
      const stockRef = doc(db, "stok", stock.id);
      await updateDoc(stockRef, { ...editData });
      onUpdate(editData);
      onClose();
    } catch (error) {
      console.error("Gagal memperbarui stok:", error);
      alert("Terjadi kesalahan saat memperbarui stok.");
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-white p-6 rounded-lg shadow-lg w-96"
        >
          <h2 className="text-xl font-bold mb-4">Edit Stok</h2>
          
          <select
            className="border p-2 rounded w-full mb-2"
            value={editData.id_produk}
            onChange={(e) => setEditData({ ...editData, id_produk: e.target.value })}
          >
            <option value="">Pilih Produk</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.nama_produk}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Nama Toko"
            className="border p-2 rounded w-full mb-2"
            value={editData.nama_toko}
            onChange={(e) => setEditData({ ...editData, nama_toko: e.target.value })}
          />

          <input
            type="text"
            placeholder="Lokasi"
            className="border p-2 rounded w-full mb-2"
            value={editData.lokasi}
            onChange={(e) => setEditData({ ...editData, lokasi: e.target.value })}
          />

          <input
            type="number"
            placeholder="Jumlah"
            className="border p-2 rounded w-full mb-2"
            value={editData.jumlah}
            onChange={(e) => setEditData({ ...editData, jumlah: Number(e.target.value) })}
          />

          <div className="flex justify-end space-x-2">
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose} disabled={loading}>
              Batal
            </button>
            <button className={`px-4 py-2 rounded ${loading ? "bg-blue-300" : "bg-blue-500 text-white"}`} onClick={handleUpdate} disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
};

export default EditStockModal;
