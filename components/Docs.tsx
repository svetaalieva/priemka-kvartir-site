"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type DocItem = {
  src: string;
  title: string;
  subtitle?: string;
};

export default function Docs() {
  const docs = useMemo<DocItem[]>(
    () => [
      { src: "/docs/nostroy.jpg", title: "НОСТРОЙ", subtitle: "Включение в реестр специалистов" },
      { src: "/docs/diplom.jpg", title: "Диплом", subtitle: "Профпереподготовка" },
      { src: "/docs/technonikol.jpg", title: "ТехноНИКОЛЬ", subtitle: "Сертификат семинара" },
      { src: "/docs/poverki.jpg", title: "Поверки", subtitle: "Свидетельства и сертификаты" },
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const openAt = (i: number) => {
    setIdx(i);
    setOpen(true);
  };

  const close = () => setOpen(false);
  const prev = () => setIdx((s) => (s - 1 + docs.length) % docs.length);
  const next = () => setIdx((s) => (s + 1) % docs.length);

  // блокируем скролл страницы
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // esc + стрелки
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section id="docs" className="bg-white">
      <div className="site-container py-16 md:py-20">
        <div className="mb-8">
          <div className="text-sm font-semibold text-black/50">Документы</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">
            Подтверждение квалификации
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/60">
            Нажмите на документ — откроется просмотр.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {docs.map((d, i) => (
            <button
              key={d.src}
              type="button"
              onClick={() => openAt(i)}
              className={[
                "group relative overflow-hidden rounded-3xl border border-black/10 bg-white text-left",
                "shadow-[0_22px_70px_rgba(0,0,0,0.08)] transition",
                "hover:-translate-y-0.5 hover:shadow-[0_28px_90px_rgba(0,0,0,0.12)]",
                "focus:outline-none focus:ring-2 focus:ring-[#ffc400]/40",
              ].join(" ")}
              style={{ cursor: "pointer" }}
            >
              <div className="relative aspect-[3/4] w-full bg-black/[0.02]">
                <Image
                  src={d.src}
                  alt={d.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="p-4">
                <div className="text-sm font-extrabold tracking-tight">{d.title}</div>
                {d.subtitle && (
                  <div className="mt-1 text-xs font-semibold text-black/55">{d.subtitle}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center">
          {/* backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
            onClick={close}
            aria-label="Закрыть"
          />

          {/* окно */}
          <div className="relative z-[91] mx-auto w-[94vw] max-w-4xl">
            <div className="overflow-hidden rounded-4xl border border-white/10 bg-white shadow-[0_30px_120px_rgba(0,0,0,0.35)] animate-[fadeIn_.3s_ease]">
              
              {/* topbar */}
              <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-3">
                <div>
                  <div className="text-sm font-extrabold text-black">{docs[idx].title}</div>
                  <div className="text-xs font-semibold text-black/50">
                    {docs[idx].subtitle ?? "Документ"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="btn-outline px-3 py-2" onClick={prev}>
                    ←
                  </button>
                  <button className="btn-outline px-3 py-2" onClick={next}>
                    →
                  </button>
                  <button
                    ref={closeBtnRef}
                    className="btn-outline px-3 py-2"
                    onClick={close}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* красивый скролл */}
              <div className="max-h-[78vh] overflow-y-auto docs-scroll bg-black/[0.02] p-6">
                <div className="relative mx-auto w-full max-w-[900px] overflow-hidden rounded-3xl bg-white shadow-[0_24px_90px_rgba(0,0,0,0.12)] ring-1 ring-black/10">
                  <Image
                    src={docs[idx].src}
                    alt={docs[idx].title}
                    width={1200}
                    height={1600}
                    className="h-auto w-full"
                    priority
                  />
                </div>
              </div>

              <div className="border-t border-black/10 px-5 py-3 text-xs font-semibold text-black/50">
                {idx + 1} / {docs.length}
              </div>
            </div>
          </div>

          {/* стили скролла */}
          <style jsx>{`
            .docs-scroll::-webkit-scrollbar {
              width: 8px;
            }
            .docs-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .docs-scroll::-webkit-scrollbar-thumb {
              background: rgba(255, 196, 0, 0.7);
              border-radius: 20px;
              transition: background 0.3s ease;
            }
            .docs-scroll::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 196, 0, 1);
            }

            /* Firefox */
            .docs-scroll {
              scrollbar-width: thin;
              scrollbar-color: rgba(255,196,0,0.7) transparent;
            }

            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </section>
  );
}