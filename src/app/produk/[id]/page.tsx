"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/app/services/firebaseConfig";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface Product {
  id: string;
  nama_produk: string;
  harga: number;
  deskripsi: string;
  gambar: string;
}

export default function DetailProduk() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const productRef = doc(db, "produk", id as string);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        setProduct({ id: productSnap.id, ...productSnap.data() } as Product);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10 px-6">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <Image src={product.gambar} alt={product.nama_produk} width={300} height={200} className="rounded-lg mx-auto" />
          <h2 className="text-2xl font-bold mt-4">{product.nama_produk}</h2>
          <p className="text-green-700 font-bold text-lg">Rp {product.harga.toLocaleString()}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
