"use client";

import { useMemo } from "react";

type Advantage = {
  title: string;
  text: string;
};

export default function Advantages() {
  const items = useMemo<Advantage[]>(
    () => [
      {
        title: "Документы и квалификация",
        text: "Покажем подтверждения и допуски. Всё прозрачно — до выезда.",
      },
      {
        title: "Акт замечаний",
        text: "Пишем по нормам и фактам. Чтобы застройщик устранял дефекты, а не спорил.",
      },
      {
        title: "Фото и видео фиксация",
        text: "Фиксируем всё на месте, чтобы у вас были доказательства и спокойствие.",
      },
      {
        title: "Опыт по новостройкам",
        text: "Знаем типовые проблемы ЖК. Проверяем быстро и внимательно.",
      },
    ],
    []
  );

  return (
    <section id="advantages" className="relative bg-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#ffc400]/10 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-black/5 blur-3xl" />
      </div>

      <div className="site-container relative py-16 md:py-18">
        <div className="max-w-3xl">
          <div className="text-sm font-semibold text-black/50">Почему нам доверяют</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">
            Приёмка без лишних слов — <br className="hidden md:block" />
            только факты
          </h2>
          <p className="mt-4 text-base leading-relaxed text-black/60">
            Мы на вашей стороне: проверяем, фиксируем, оформляем так, чтобы было проще добиться устранения недостатков.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className={[
                "group relative overflow-hidden rounded-3xl border border-black/10 bg-white p-5",
                "shadow-[0_18px_60px_rgba(0,0,0,0.06)]",
                "transition duration-300",
                "hover:-translate-y-0.5 hover:shadow-[0_28px_90px_rgba(0,0,0,0.10)]",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#ffc400]/12 blur-2xl" />
              </div>

              <div className="relative flex items-start gap-4">
                {/* ✅ без овала за квадратом */}
                <div className="adv-check-wrap mt-0.5">
                  <div className="adv-check inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white ring-1 ring-black/10 shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                      <path
                        d="M20 7L10.2 16.8 5 11.6"
                        stroke="rgba(0,0,0,0.85)"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="text-base font-extrabold tracking-tight">{it.title}</div>
                  <div className="mt-2 text-sm leading-relaxed text-black/60">{it.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a href="#form" className="btn-primary">
            Оставить заявку
          </a>

          <a href="#docs" className="btn-outline">
            Посмотреть документы
          </a>

          <div className="text-sm font-semibold text-black/45">Севастополь • Симферополь • Ялта и др.</div>
        </div>
      </div>
    </section>
  );
}