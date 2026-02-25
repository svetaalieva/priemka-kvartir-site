"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type DocItem = {
  src: string;
  title: string;
  subtitle: string;
};

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function useLockBodyScroll(open: boolean) {
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);
}

export default function Docs() {
  // ✅ ТВОИ АКТУАЛЬНЫЕ ДОКИ (без золотых плашек/годов)
  const docs: DocItem[] = useMemo(
    () => [
      {
        src: "/docs/diploms.jpg",
        title: "Реестр специалистов",
        subtitle: "Официальное включение в НРС",
      },
      {
        src: "/docs/diploms2.jpg",
        title: "Судебная экспертиза",
        subtitle: "Строительно-техническое направление",
      },
      {
        src: "/docs/diploms3.jpg",
        title: "Промышленное и гражданское строительство",
        subtitle: "Профессиональная переподготовка",
      },
      {
        src: "/docs/diploms4.jpg",
        title: "Поверки оборудования",
        subtitle: "Действующие сертификаты и калибровки",
      },
    ],
    []
  );

  // ===== reveal on scroll (как в сервисах) =====
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-doc-card]"));
    if (!cards.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const idxStr = (e.target as HTMLElement).dataset.docCard;
          const idx = idxStr ? Number(idxStr) : NaN;
          if (!Number.isNaN(idx)) {
            setSeen((s) => (s[idx] ? s : { ...s, [idx]: true }));
          }
          io.unobserve(e.target);
        }
      },
      { threshold: 0.18, rootMargin: "80px 0px -10% 0px" }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  // ===== modal viewer =====
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useLockBodyScroll(open);

  const current = docs[active];

  const goPrev = () => setActive((i) => (i - 1 + docs.length) % docs.length);
  const goNext = () => setActive((i) => (i + 1) % docs.length);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // ✅ фикс твоей ошибки: зависимости всегда одинаковые по размеру
  }, [open, docs.length]);

  return (
    <section id="docs" className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-[12px] uppercase tracking-[0.18em] text-black/45">Документы</div>
          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Подтверждение квалификации</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60 md:text-[15px]">
            Дипломы, уведомления и поверки оборудования. Нажмите на документ — откроется просмотр.
          </p>
        </div>
      </div>

      <div ref={wrapRef} className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {docs.map((d, idx) => {
          const isSeen = !!seen[idx];

          return (
            <button
              key={d.src}
              type="button"
              data-doc-card={idx}
              className={cx(
                "group relative overflow-hidden rounded-3xl border border-black/10 bg-white/70 text-left",
                "shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl",
                "transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(0,0,0,0.10)]",
                "focus:outline-none focus:ring-2 focus:ring-black/10",
                // reveal
                "motion-reduce:transform-none motion-reduce:transition-none",
                isSeen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
              style={{ transitionDelay: `${Math.min(idx * 70, 280)}ms` }}
              onClick={() => {
                setActive(idx);
                setOpen(true);
              }}
              aria-label={`Открыть документ: ${d.title}`}
            >
              {/* мягкий “премиум” блик при ховере + свечение ТОЛЬКО снизу */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                <div className="absolute -left-24 top-0 h-full w-40 rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)] blur-[0.6px]" />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-[radial-gradient(ellipse_at_bottom,rgba(255,196,0,0.22),transparent_70%)]" />
              </div>

              <div className="relative aspect-[4/5] w-full bg-black/[0.03]">
                <Image
                  src={d.src}
                  alt={d.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 280px"
                  className="object-cover"
                  priority={idx < 2}
                />
              </div>

              <div className="relative border-t border-black/10 p-4">
                <div className="text-sm font-semibold leading-snug">{d.title}</div>
                <div className="mt-1 text-sm text-black/60">{d.subtitle}</div>

                <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-black/70">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#ffc400]" />
                  Смотреть
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ===== MODAL ===== */}
      {open && current ? (
        <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true">
          <button
            aria-label="Закрыть"
            className="absolute inset-0 cursor-pointer bg-black/55 backdrop-blur-[6px]"
            onClick={() => setOpen(false)}
          />

          <div className="relative mx-auto mt-6 w-[min(1100px,calc(100%-20px))] md:mt-10">
            <div className="animate-in fade-in zoom-in-95 duration-200 rounded-3xl border border-black/10 bg-white/90 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-4 md:px-7">
                <div className="min-w-0">
                  <div className="text-[12px] uppercase tracking-[0.18em] text-black/45">
                    Документы • {active + 1} / {docs.length}
                  </div>
                  <div className="mt-1 text-lg font-semibold leading-tight md:text-xl">{current.title}</div>
                  <div className="mt-1 text-sm text-black/55">{current.subtitle}</div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={goPrev}
                    className="cursor-pointer rounded-full border border-black/10 bg-white/70 px-3 py-2 text-sm font-medium transition hover:bg-white"
                    aria-label="Предыдущий документ"
                  >
                    ←
                  </button>
                  <button
                    onClick={goNext}
                    className="cursor-pointer rounded-full border border-black/10 bg-white/70 px-3 py-2 text-sm font-medium transition hover:bg-white"
                    aria-label="Следующий документ"
                  >
                    →
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="cursor-pointer rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium transition hover:bg-white"
                  >
                    Закрыть
                  </button>
                </div>
              </div>

              <div className="max-h-[78vh] overflow-auto p-4 md:p-6">
                <div className="relative mx-auto w-full max-w-[920px] overflow-hidden rounded-2xl border border-black/10 bg-white">
                  <div className="group relative">
                    <Image
                      src={current.src}
                      alt={current.title}
                      width={1200}
                      height={1600}
                      className="h-auto w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                      style={{ height: "auto" }}
                      priority
                    />
                    {/* лёгкая виньетка, без “засвета” */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_50%_90%,rgba(0,0,0,0.10),transparent_55%)]" />
                  </div>
                </div>

                <div className="mt-3 text-center text-xs text-black/45">Подсказка: ← → листают, Esc закрывает</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}