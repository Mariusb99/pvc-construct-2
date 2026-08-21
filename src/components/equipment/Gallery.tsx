"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryImage = { imageUrl: string; altText: string | null };

export function Gallery({ images, model }: { images: GalleryImage[]; model: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasImages = images.length > 0;

  const goTo = useCallback(
    (i: number) => {
      if (!hasImages) return;
      setActiveIndex(((i % images.length) + images.length) % images.length);
    },
    [images.length, hasImages]
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, activeIndex, goTo]);

  if (!hasImages) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-cards bg-mist-gray text-fog">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 16l4.5-6 3.5 4 3-4L21 16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="3" y="4" width="18" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  const active = images[activeIndex];

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-cards bg-mist-gray"
      >
        <Image
          src={active.imageUrl}
          alt={active.altText || model}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 640px"
          className="object-cover"
        />
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-tags bg-carbon-black/70 px-2.5 py-1.5 text-[12px] text-pure-white opacity-0 transition-opacity group-hover:opacity-100">
          <Expand size={14} /> Extinde
        </span>
      </button>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.imageUrl + i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-images border-2",
                i === activeIndex ? "border-peloton-red" : "border-transparent"
              )}
            >
              <Image src={img.imageUrl} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-carbon-black/95 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="Închide"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-pure-white hover:bg-white/10"
          >
            <X size={22} />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Imaginea anterioară"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex - 1);
              }}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-pure-white hover:bg-white/10 sm:left-6"
            >
              <ChevronLeft size={26} />
            </button>
          )}

          <div
            className="relative h-[70vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.imageUrl}
              alt={active.altText || model}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Imaginea următoare"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex + 1);
              }}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-pure-white hover:bg-white/10 sm:right-6"
            >
              <ChevronRight size={26} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
