"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

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

  const current = docs[idx];

  const close = () => setOpen(false);

  const go = (next: number) => {
    const n = (next + docs.length) % docs.length;
    setIdx(n);
  };

  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    document.addEventListener("keydown", onKey);

    // блокируем скролл страницы под модалкой
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idx]);

  return (
    <section id="docs" className="bg-white">
      <div className="site-container py-16 md:py-20">
        <div className="text-sm font-semibold text-black/50">Документы</div>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">Подтверждения квалификации</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/60">
          Сертификаты, допуски и документы — чтобы доверие было ещё до выезда.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {docs.map((d, i) => (
            <button
              key={d.src}
              type="button"
              onClick={() => {
                setIdx(i);
                setOpen(true);
              }}
              className={[
                "group relative overflow-hidden rounded-3xl border border-black/10 bg-white text-left",
                "shadow-[0_16px_60px_rgba(0,0,0,0.06)] transition",
                "hover:-translate-y-[2px] hover:shadow-[0_24px_90px_rgba(0,0,0,0.10)]",
              ].join(" ")}
              style={{ cursor: "pointer" }}
              aria-label={`Открыть документ: ${d.title}`}
            >
              <div className="relative aspect-[4/5] w-full bg-black/[0.02]">
                <Image
                  src={d.src}
                  alt={d.title}
                  fill
                  sizes="(max-width: 768px) 90vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-black ring-1 ring-black/10 backdrop-blur">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#ffc400]" />
                  Открыть
                </div>
              </div>

              <div className="p-4">
                <div className="text-sm font-extrabold">{d.title}</div>
                {d.subtitle ? <div className="mt-1 text-xs text-black/55">{d.subtitle}</div> : null}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ================= MODAL (без зума) ================= */}
      {open ? (
        <div className="fixed inset-0 z-[100]">
          {/* фон */}
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={close}
            aria-label="Закрыть"
          />

          {/* окно */}
          <div className="absolute inset-0 flex items-center justify-center p-3 md:p-8">
            <div
              className={[
                "relative w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white",
                "shadow-[0_30px_120px_rgba(0,0,0,0.35)]",
                "animate-[docsIn_220ms_ease-out]",
              ].join(" ")}
              role="dialog"
              aria-modal="true"
            >
              {/* шапка */}
              <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3 md:px-6">
                <div className="min-w-0">
                  <div className="truncate text-sm font-extrabold">{current.title}</div>
                  <div className="truncate text-xs text-black/55">
                    {current.subtitle ? current.subtitle : "Документ"}
                    <span className="mx-2">•</span>
                    <span className="font-semibold">{idx + 1}</span> / {docs.length}
                    <span className="mx-2">•</span>
                    <span className="text-black/45">Листай ← → • Esc — закрыть • Скролл внутри окна</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" className="btn-outline px-3 py-2 text-sm" onClick={prev} aria-label="Предыдущий">
                    ←
                  </button>
                  <button type="button" className="btn-outline px-3 py-2 text-sm" onClick={next} aria-label="Следующий">
                    →
                  </button>
                  <button type="button" className="btn-outline px-3 py-2 text-sm" onClick={close} aria-label="Закрыть">
                    ✕
                  </button>
                </div>
              </div>

              {/* тело: внутри есть скролл */}
              <div className="max-h-[78vh] overflow-auto bg-black/[0.02] p-3 md:p-6">
                <div className="mx-auto max-w-4xl">
                  <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_70px_rgba(0,0,0,0.12)]">
                    {/* просто картинка — без трансформаций */}
                    <Image
                      src={current.src}
                      alt={current.title}
                      width={1400}
                      height={1800}
                      className="h-auto w-full"
                      priority
                    />

                    {/* мягкий премиум-свет */}
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#ffc400]/12 blur-3xl" />
                      <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-black/45">
                    Если документ длинный — просто скролль вниз внутри окна.
                  </div>
                </div>
              </div>

              {/* анимация */}
              <style jsx>{`
                @keyframes docsIn {
                  from {
                    transform: translateY(10px) scale(0.985);
                    opacity: 0;
                  }
                  to {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                  }
                }
              `}</style>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
