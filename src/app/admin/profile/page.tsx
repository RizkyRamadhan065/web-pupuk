"use client";
import { useState } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    nama: "Admin Pupuk",
    email: "admin@example.com",
    phone: "081234567890",
    foto: "https://via.placeholder.com/150", // Placeholder gambar
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, foto: imageUrl });
    }
  };

  const handlePasswordUpdate = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Konfirmasi password baru tidak cocok!");
      return;
    }
    alert("Password berhasil diubah!");
    setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
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
            onChange={handleProfileChange}
            className="w-full p-2 border rounded mt-1"
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

        {/* Ganti Password */}
        <div className="mt-6">
          <h2 className="text-lg font-bold">Ganti Password</h2>

          <label className="block text-sm font-semibold mt-3">Password Lama</label>
          <input
            type="password"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handlePasswordChange}
            className="w-full p-2 border rounded mt-1"
          />

          <label className="block text-sm font-semibold mt-3">Password Baru</label>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            className="w-full p-2 border rounded mt-1"
          />

          <label className="block text-sm font-semibold mt-3">Konfirmasi Password Baru</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full p-2 border rounded mt-1"
          />

          <button
            onClick={handlePasswordUpdate}
            className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
