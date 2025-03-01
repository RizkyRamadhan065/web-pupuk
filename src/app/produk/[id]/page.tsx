"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/app/services/firebaseConfig";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Store, MapPin } from "lucide-react"; // Import ikon dari Lucide
import Meta from "@/app/components/Meta"

interface Product {
  id: string;
  nama_produk: string;
  harga: number;
  deskripsi: string;
  gambar: string;
}

interface Stock {
  id: string;
  jumlah: number;
  lokasi: string;
  nama_toko: string;
}

export default function DetailProduk() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [stockList, setStockList] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const productRef = doc(db, "produk", id as string);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        setProduct({ id: productSnap.id, ...productSnap.data() } as Product);
      }
    };

    const fetchStock = async () => {
      const stockQuery = query(collection(db, "stok"), where("id_produk", "==", id));
      const stockSnap = await getDocs(stockQuery);
      const stockData = stockSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Stock[];
      setStockList(stockData);
    };

    Promise.all([fetchProduct(), fetchStock()]).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10 text-red-500">Produk tidak ditemukan.</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <Meta title={`${product.nama_produk} | Toko Pupuk Online`} description={product.deskripsi} />
      <div className="container mx-auto py-10 px-6">
        {/* Detail Produk */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <Image src={product.gambar} alt={product.nama_produk} width={300} height={200} className="rounded-lg mx-auto" />
          <h2 className="text-2xl font-bold mt-4">{product.nama_produk}</h2>
          <p className="text-green-700 font-bold text-lg">Rp {product.harga.toLocaleString()}</p>
          <p className="text-gray-700 mt-2">{product.deskripsi}</p>
        </div>

        {/* Daftar Stok */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ketersediaan Stok</h3>
          {stockList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stockList.map((stock) => (
                <div key={stock.id} className="bg-white p-4 rounded-lg shadow flex flex-col gap-2 border border-gray-300">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Store size={20} className="text-green-600" /> {stock.nama_toko}
                  </div>
                  <p className="text-gray-700">Jumlah: <span className="font-bold">{stock.jumlah}</span></p>
                  <a
                    href={stock.lokasi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-500 hover:underline"
                  >
                    <MapPin size={20} className="text-red-500" /> Lihat Lokasi
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Stok tidak tersedia.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
