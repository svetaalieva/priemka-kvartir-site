"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Docs.tsx — вставь целиком
 *
 * Есть:
 * - Модалка: плавное появление/закрытие
 * - Листание: стрелки + клавиши ←/→
 * - ESC закрывает
 * - Скролл внутри модалки (док не обрезается)
 * - Zoom колесом + drag панорама (как “премиум”)
 * - Курсор-пальчик на карточках
 * - Без ESLint ругани на refs during render
 */

type DocItem = {
  src: string;
  title: string;
  subtitle: string;
};

const docs: DocItem[] = [
  { src: "/docs/nostroy.jpg", title: "НОСТРОЙ", subtitle: "Включение в реестр специалистов" },
  { src: "/docs/diplom.jpg", title: "Диплом", subtitle: "Профпереподготовка" },
  { src: "/docs/technonikol.jpg", title: "ТехноНИКОЛЬ", subtitle: "Сертификат семинара" },
  { src: "/docs/poverki.jpg", title: "Поверки", subtitle: "Свидетельства и сертификаты" },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Docs() {
  const items = useMemo(() => docs, []);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // для анимации
  const [index, setIndex] = useState(0);

  // zoom/pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // dragging state (чтобы не читать ref в render)
  const [dragging, setDragging] = useState(false);

  // refs только для координат
  const draggingRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  const viewportRef = useRef<HTMLDivElement | null>(null);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const close = () => {
    setMounted(false);
    window.setTimeout(() => {
      setOpen(false);
      resetView();
    }, 180);
  };

  const go = (next: number) => {
    const safe = (next + items.length) % items.length;
    setIndex(safe);
    resetView();
  };

  // lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // hotkeys
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, index]); // eslint-disable-line react-hooks/exhaustive-deps

  // open animation
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setMounted(true), 10);
    return () => window.clearTimeout(t);
  }, [open]);

  const onWheel = (e: React.WheelEvent) => {
    if (!open) return;
    e.preventDefault();

    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
    const nextZoom = clamp(zoom * factor, 1, 3);

    const k = nextZoom / zoom;
    const nextPanX = (pan.x - cx) * k + cx;
    const nextPanY = (pan.y - cy) * k + cy;

    setZoom(nextZoom);
    setPan({ x: nextPanX, y: nextPanY });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!open || zoom <= 1) return;
    draggingRef.current = true;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!open) return;
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy });
  };

  const stopDrag = () => {
    draggingRef.current = false;
    setDragging(false);
  };

  const zoomIn = () => setZoom((z) => clamp(z * 1.15, 1, 3));
  const zoomOut = () => setZoom((z) => clamp(z / 1.15, 1, 3));

  return (
    <section id="docs" className="bg-white">
      <div className="site-container py-20 md:py-24">
        {/* Header */}
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-extrabold text-white">
              <span className="inline-block h-2 w-2 rounded-full bg-[#ffc400]" />
              Документы
            </div>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-5xl">
              Подтверждения <span className="text-[#ffc400]">квалификации</span>
            </h2>

            <p className="mt-3 max-w-2xl text-black/60">
              Сертификаты, допуски и документы — чтобы у вас было доверие ещё до выезда.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <span className="inline-flex rounded-full bg-black/5 px-4 py-2 text-xs font-extrabold text-black/70">
              Официально
            </span>
            <span className="inline-flex rounded-full bg-[#ffc400] px-4 py-2 text-xs font-extrabold text-black">
              Проверяем по делу
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((d, i) => (
            <button
              key={d.title}
              type="button"
              onClick={() => {
                setIndex(i);
                setOpen(true);
                resetView();
              }}
              className="group overflow-hidden rounded-3xl border border-black/10 bg-white text-left shadow-[0_14px_45px_rgba(0,0,0,0.06)]
                         transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.10)]"
              aria-label={`Открыть документ: ${d.title}`}
            >
              <div className="relative aspect-4/5 cursor-pointer bg-black/5">
                <Image
                  src={d.src}
                  alt={d.title}
                  fill
                  className="object-cover object-top transition duration-300 group-hover:scale-[1.02]"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
              </div>

              <div className="p-6">
                <div className="text-sm font-extrabold">{d.title}</div>
                <div className="mt-1 text-sm text-black/60">{d.subtitle}</div>

                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-black/70">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#ffc400]" />
                  Нажмите, чтобы посмотреть
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-3xl border border-black/10 bg-[#fffdf6] p-7 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-extrabold">
                Нужно больше подтверждений? <span className="text-[#ffc400]">Покажем по запросу</span>
              </div>
              <div className="mt-1 text-sm text-black/60">
                По запросу отправим дополнительные материалы и примеры актов замечаний.
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#form" className="btn-primary">
                Запросить
              </a>
              <a href="tel:+79787043316" className="btn-outline">
                Позвонить
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-60">
          {/* backdrop */}
          <button
            type="button"
            onClick={close}
            className={[
              "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200",
              mounted ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-label="Закрыть"
          />

          <div className="absolute inset-0 flex items-center justify-center p-3 md:p-6">
            <div
              className={[
                "w-full max-w-6xl overflow-hidden rounded-3xl bg-white ring-1 ring-black/10 shadow-[0_30px_90px_rgba(0,0,0,0.45)]",
                "transition duration-200 ease-out",
                mounted ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]",
              ].join(" ")}
            >
              {/* topbar */}
              <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3 md:px-5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-extrabold">{items[index].title}</div>
                  <div className="truncate text-xs text-black/50">{items[index].subtitle}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={zoomOut} className="btn-outline px-3 py-2 text-sm" aria-label="Уменьшить">
                    −
                  </button>
                  <button type="button" onClick={resetView} className="btn-outline px-3 py-2 text-sm" aria-label="Сбросить">
                    100%
                  </button>
                  <button type="button" onClick={zoomIn} className="btn-outline px-3 py-2 text-sm" aria-label="Увеличить">
                    +
                  </button>

                  <button type="button" onClick={close} className="btn-outline px-3 py-2" aria-label="Закрыть">
                    ✕
                  </button>
                </div>
              </div>

              {/* body */}
              <div className="relative bg-black/5">
                {/* arrows */}
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xl font-black shadow-md ring-1 ring-black/10 hover:bg-white"
                  aria-label="Предыдущий документ"
                  title="Предыдущий (←)"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xl font-black shadow-md ring-1 ring-black/10 hover:bg-white"
                  aria-label="Следующий документ"
                  title="Следующий (→)"
                >
                  ›
                </button>

                {/* scroll area */}
                <div className="max-h-[82vh] overflow-auto p-3 md:p-6" onWheel={onWheel}>
                  <div
                    ref={viewportRef}
                    className="relative mx-auto w-full select-none overflow-hidden rounded-2xl bg-white shadow-[0_16px_60px_rgba(0,0,0,0.14)] ring-1 ring-black/10"
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={stopDrag}
                    onMouseLeave={stopDrag}
                    title="Колесо — зум, перетаскивание — панорамирование"
                    style={{
                      cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
                    }}
                  >
                    <div className="relative aspect-4/5 min-h-130 md:min-h-180">
                      <div
                        className="absolute inset-0"
                        style={{
                          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                          transformOrigin: "0 0",
                          transition: dragging ? "none" : "transform 120ms ease-out",
                        }}
                      >
                        <Image
                          src={items[index].src}
                          alt={items[index].title}
                          fill
                          sizes="(min-width: 1024px) 1000px, 100vw"
                          className="object-contain"
                          priority
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-center text-xs text-black/50">
                    ←/→ листание • ESC закрыть • колесо — зум • перетаскивание — панорама
                  </div>
                </div>
              </div>

              {/* bottombar */}
              <div className="flex items-center justify-between gap-3 border-t border-black/10 px-4 py-3 text-xs text-black/50 md:px-5">
                <div>
                  Документ {index + 1} из {items.length}
                </div>
                <button type="button" onClick={resetView} className="underline underline-offset-4">
                  Сбросить масштаб
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
