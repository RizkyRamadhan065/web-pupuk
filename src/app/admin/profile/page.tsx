"use client";
import { useState, useEffect } from "react";
import { db } from "@/app/services/firebaseConfig";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import DashboardLayout from "@/app/components/DashboardLayout";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    id: "",
    nama: "",
    email: "",
    phone: "",
    foto: "https://via.placeholder.com/150",
  });
  const [newPassword, setNewPassword] = useState("");

  const username = "admin"; // Harus diganti dengan cara mendapatkan username dari session atau state.

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const adminRef = collection(db, "admin");
        const q = query(adminRef, where("username", "==", username)); // Query berdasarkan username

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
        setProfile({ ...profile, foto: data.secure_url });

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

  const handleChangePassword = async () => {
    if (!newPassword) {
      alert("Masukkan password baru!");
      return;
    }

    const docRef = collection(db, "admin");
    const q = query(docRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const adminDoc = querySnapshot.docs[0].ref;
      await updateDoc(adminDoc, { password: newPassword });
      alert("Password berhasil diperbarui!");
      setNewPassword("");
    }
  };

  return (
    <DashboardLayout activePage="Profile">
      <div className="max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>

        {/* Foto Profil */}
        <div className="flex flex-col items-center">
          <img src={profile.foto} alt="Foto Profil" className="w-32 h-32 rounded-full object-cover" />
          <input type="file" accept="image/*" className="mt-3 text-sm" onChange={handlePhotoChange} />
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

        {/* Ganti Password */}
        <div className="mt-6">
          <label className="block text-sm font-semibold">Password Baru</label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />

          <button
            onClick={handleChangePassword}
            className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Ubah Password
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
