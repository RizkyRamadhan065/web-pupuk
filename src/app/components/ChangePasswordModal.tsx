"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

export default function ChangePasswordModal({ isOpen, onClose, onSubmit }: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !retypePassword) {
      setAlert({ type: "error", message: "Semua kolom harus diisi!" });
      return;
    }
    if (newPassword !== retypePassword) {
      setAlert({ type: "error", message: "Password baru tidak cocok!" });
      return;
    }

    const success = await onSubmit(oldPassword, newPassword);
    if (success) {
      setAlert({ type: "success", message: "Password berhasil diperbarui!" });
      setOldPassword("");
      setNewPassword("");
      setRetypePassword("");

      setTimeout(() => {
        onClose();
        setAlert(null);
      }, 2000);
    } else {
      setAlert({ type: "error", message: "Password lama salah!" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Ganti Password</h2>

        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-2 mb-3 text-sm rounded-lg text-center ${
              alert.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {alert.message}
          </motion.div>
        )}

        <input
          type="password"
          placeholder="Password Lama"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-2 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password Baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Ketik Ulang Password Baru"
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
            Batal
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Simpan
          </button>
        </div>
      </motion.div>
    </div>
  );
}
