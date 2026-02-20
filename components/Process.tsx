"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Process.tsx — ДОРОГОЙ ВАРИАНТ (исправленный под ESLint)
 *
 * ✅ Плавная анимация появления шагов при скролле (IntersectionObserver)
 * ✅ Лёгкий параллакс (мягкое смещение декоративных кругов)
 * ✅ Микро-анимация hover
 * ✅ Номера в бренд-цвете
 *
 * ✅ Исправлено:
 * - нет setState “синхронно” внутри effect (через rAF)
 * - нет any в ref
 */

const stepsData = [
  {
    title: "Созваниваемся и уточняем объект",
    text: "Город, ЖК, площадь и удобная дата. Подсказываем, что подготовить к приёмке.",
  },
  {
    title: "Проводим проверку на месте",
    text: "Отделка, инженерия, окна/двери, ключевые замеры. Всё фиксируем фото/видео.",
  },
  {
    title: "Составляем акт замечаний",
    text: "Формулируем по факту: что не так, где и почему это важно. Ничего лишнего.",
  },
  {
    title: "Контроль устранения (по желанию)",
    text: "Повторная приёмка: проверяем, что замечания действительно устранены.",
  },
];

function useInViewCount(total: number) {
  const [visibleCount, setVisibleCount] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;

    // Если нет IntersectionObserver — просто показываем всё (НО через rAF, чтобы ESLint не ругался)
    if (typeof IntersectionObserver === "undefined") {
      raf = requestAnimationFrame(() => setVisibleCount(total));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const idx = Number((e.target as HTMLElement).dataset.index || 0);

          // через rAF — чтобы не было “синхронного” setState внутри callback-а observer
          raf = requestAnimationFrame(() => {
            setVisibleCount((prev) => Math.max(prev, idx + 1));
          });
        });
      },
      { root: null, threshold: 0.2 }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [total]);

  return { visibleCount, itemRefs };
}

export default function Process() {
  const steps = useMemo(() => stepsData, []);
  const { visibleCount, itemRefs } = useInViewCount(steps.length);

  const sectionRef = useRef<HTMLElement | null>(null);
  const [parallax, setParallax] = useState({ a: 0, b: 0 });

  useEffect(() => {
    let raf = 0;

    const calc = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;

      const center = rect.top + rect.height / 2;
      const t = (center - viewportH / 2) / (viewportH / 2);
      const clamped = Math.max(-1, Math.min(1, t));

      setParallax({
        a: clamped * 10,
        b: clamped * -14,
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(calc);
    };

    // Первый расчёт тоже через rAF
    raf = requestAnimationFrame(calc);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-light" id="process">
      <div className="site-container py-12 md:py-16">
        {/* Заголовок */}
        <div className="max-w-2xl">
          <div className="text-sm font-semibold tracking-wide text-black/60">Как работаем</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            Понятный процесс в 4 шага
          </h2>
          <p className="mt-3 text-black/70 md:text-lg">
            Договорились → проверили → зафиксировали → оформили.
          </p>
        </div>

        <div className="relative mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Декор (параллакс) */}
          <div
            className="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full bg-black/[0.03] blur-3xl"
            style={{ transform: `translateY(${parallax.a}px)` }}
          />
          <div
            className="pointer-events-none absolute -right-12 -bottom-16 h-56 w-56 rounded-full bg-[var(--brand-yellow)]/15 blur-3xl"
            style={{ transform: `translateY(${parallax.b}px)` }}
          />

          {/* Левая колонка */}
          <div className="relative">
            <div className="pointer-events-none absolute left-[15px] top-1 bottom-1 w-px bg-black/10" />

            <div className="space-y-6">
              {steps.map((s, i) => {
                const show = i < visibleCount;
                const delay = i * 90;

                return (
                  <div
                    key={s.title}
                    data-index={i}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    className="relative pl-12"
                    style={{
                      opacity: show ? 1 : 0,
                      transform: show ? "translateY(0px)" : "translateY(14px)",
                      transition:
                        "opacity 520ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                      transitionDelay: `${delay}ms`,
                      willChange: "transform, opacity",
                    }}
                  >
                    {/* Маркер слева */}
                    <div className="absolute left-0 top-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white shadow-sm">
                        <span className="text-[11px] font-extrabold text-black">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Карточка */}
                    <div className="group rounded-3xl border border-black/10 bg-white p-6 shadow-[0_14px_45px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(0,0,0,0.10)]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="text-base font-extrabold">{s.title}</div>

                        {/* Номер в бренд-цвете */}
                        <div className="whitespace-nowrap rounded-full border border-black/10 bg-[var(--brand-yellow)] px-3 py-1 text-[11px] font-extrabold text-black shadow-[0_10px_24px_rgba(255,196,0,0.18)]">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-black/70">{s.text}</div>

                      {/* микро-индикатор hover */}
                      <div className="mt-5 h-px w-full bg-black/5">
                        <div className="h-px w-0 bg-black/20 transition-all duration-300 group-hover:w-2/3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Правая колонка — Принципы */}
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-7 shadow-[0_14px_45px_rgba(0,0,0,0.06)]">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--brand-yellow)]/12 blur-3xl"
              style={{ transform: `translateY(${parallax.a * 0.6}px)` }}
            />
            <div
              className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-black/[0.03] blur-3xl"
              style={{ transform: `translateY(${parallax.b * 0.4}px)` }}
            />

            <div className="relative">
              <div className="text-sm font-semibold tracking-wide text-black/60">Принципы</div>
              <div className="mt-2 text-2xl font-extrabold tracking-tight">
                Спокойно, понятно, по делу
              </div>

              <ul className="mt-6 space-y-3 text-sm text-black/75">
                {[
                  "Говорим человеческим языком, без «воды».",
                  "Фиксируем замечания так, чтобы застройщик не уходил в споры.",
                  "Фото/видео — чтобы у вас были доказательства.",
                  "Если нужно — проверим устранение на повторной приёмке.",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/5 border border-black/10 text-xs font-black">
                      ✓
                    </span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#lead" className="btn-primary transition hover:-translate-y-[1px]">
                  Оставить заявку
                </a>
                <a href="#docs" className="btn-outline transition hover:-translate-y-[1px]">
                  Документы
                </a>
              </div>

              <div className="mt-6 text-xs text-black/50">
                * Если нужно — объясним, как правильно передать акт застройщику.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
