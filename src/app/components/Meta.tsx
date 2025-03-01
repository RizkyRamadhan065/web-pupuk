"use client";
import { useEffect } from "react";

interface MetaProps {
  title: string;
  description?: string;
}

export default function Meta({ title, description }: MetaProps) {
  useEffect(() => {
    document.title = title;

    // Set meta description
    if (description) {
      let metaDesc = document.querySelector("meta[name='description']");
      if (metaDesc) {
        metaDesc.setAttribute("content", description);
      } else {
        const newMeta = document.createElement("meta");
        newMeta.name = "description";
        newMeta.content = description;
        document.head.appendChild(newMeta);
      }
    }

    // Set favicon dari URL online
    let link: HTMLLinkElement | null = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png"; // Sesuaikan dengan format gambar favicon
      document.head.appendChild(link);
    }
    link.href = "https://cdn-icons-png.flaticon.com/512/5903/5903885.png"; // URL ikon daun

  }, [title, description]);

  return null;
}
