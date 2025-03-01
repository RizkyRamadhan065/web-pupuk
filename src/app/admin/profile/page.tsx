"use client";
import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import { db } from "@/app/services/firebaseConfig";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import DashboardLayout from "@/app/components/DashboardLayout";
import ChangePasswordModal from "@/app/components/ChangePasswordModal";
import Meta from "@/app/components/Meta";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    id: "",
    nama: "",
    email: "",
    phone: "",
    foto: "https://via.placeholder.com/150",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const username = "admin"; // Gantilah dengan session atau state login yang benar.

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const adminRef = collection(db, "admin");
        const q = query(adminRef, where("username", "==", username));

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const data = docSnap.data();

          setProfile({
            id: docSnap.id,
            nama: data.nama || "",
            email: data.email || "",
            phone: data.phone || "",
            foto: data.foto || "https://via.placeholder.com/150",
          });

          console.log("Data admin ditemukan:", data);
        } else {
          console.log("Admin tidak ditemukan!");
        }
      } catch (error) {
        console.error("Error mengambil data admin:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 🔹 Fungsi untuk mengganti foto profil
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "webPupuk"); // Sesuaikan dengan upload preset Cloudinary

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dly9dkvgy/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        // 🔹 Update foto di state terlebih dahulu agar UI langsung berubah
        setProfile((prev) => ({ ...prev, foto: data.secure_url }));

        // 🔹 Simpan URL foto ke Firestore
        const docRef = collection(db, "admin");
        const q = query(docRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const adminDoc = querySnapshot.docs[0].ref;
          await updateDoc(adminDoc, { foto: data.secure_url });
          alert("Foto profil berhasil diperbarui!");
        }
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
    }
  };

  const handleProfileUpdate = async () => {
    const docRef = collection(db, "admin");
    const q = query(docRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const adminDoc = querySnapshot.docs[0].ref;
      await updateDoc(adminDoc, {
        nama: profile.nama,
        phone: profile.phone,
      });
      alert("Profil berhasil diperbarui!");
    }
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const docRef = collection(db, "admin");
      const q = query(docRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const adminDoc = querySnapshot.docs[0];
        const adminData = adminDoc.data();

        // 🔹 Verifikasi password lama dengan bcrypt
        const isMatch = await bcrypt.compare(oldPassword, adminData.password);
        if (!isMatch) {
          return false; // Password lama salah
        }

        // 🔹 Hash password baru sebelum menyimpannya ke Firestore
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updateDoc(adminDoc.ref, { password: hashedPassword });

        return true;
      }
    } catch (error) {
      console.error("Gagal mengupdate password:", error);
    }
    return false;
  };

  return (
    <DashboardLayout activePage="Profile">
      <Meta title="Profil Admin | Toko Pupuk Online" description="Lihat dan perbarui informasi profil admin di toko pupuk online." />
      <div className="max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>

        {/* Foto Profil */}
        <div className="flex flex-col items-center">
          <img
            src={profile.foto}
            alt="Foto Profil"
            className="w-32 h-32 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            className="mt-3 text-sm"
            onChange={handlePhotoChange}
          />
        </div>

        {/* Form Profil */}
        <div className="mt-6">
          <label className="block text-sm font-semibold">Nama</label>
          <input
            type="text"
            name="nama"
            value={profile.nama}
            onChange={handleProfileChange}
            className="w-full p-2 border rounded mt-1"
          />

          <label className="block text-sm font-semibold mt-3">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            className="w-full p-2 border rounded mt-1"
            disabled
          />

          <label className="block text-sm font-semibold mt-3">No. HP</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        <button
          onClick={handleProfileUpdate}
          className="mt-4 w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Simpan Perubahan Profil
        </button>

        {/* Tombol untuk membuka modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          Ganti Password
        </button>
      </div>

      {/* Modal Ganti Password */}
      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleChangePassword}
      />
    </DashboardLayout>
  );
}
