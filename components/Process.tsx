"use client";

/**
 * Process.tsx — ПРЕМИУМ-ВЕРСИЯ
 * Цель: меньше “серых карточек”, больше премиум-иерархии.
 * - шаги как “timeline”
 * - правая заявка — как аккуратный callout (без ощущения рекламы)
 */

const steps = [
  { n: "01", title: "Заявка", text: "Оставляете заявку — уточняем город, ЖК, удобное время и задачи." },
  { n: "02", title: "Выезд и проверка", text: "Осмотр по чек-листу: отделка, инженерия, геометрия, площадь (при необходимости)." },
  { n: "03", title: "Фиксация дефектов", text: "Фото/видео + понятные комментарии. Ничего не теряется и не “на словах”." },
  { n: "04", title: "Документ для застройщика", text: "Готовим акт замечаний, с которым проще требовать устранения дефектов." },
];

export default function Process() {
  return (
    <section id="process" className="relative bg-white">
      {/* мягкий фон (дороже, но тихо) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-[#ffc400]/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-black/5 blur-3xl" />
      </div>

      <div className="site-container relative py-20 md:py-24">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_520px] md:items-start">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-extrabold text-white">
              <span className="inline-block h-2 w-2 rounded-full bg-[#ffc400]" />
              Как работаем
            </div>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-4xl">
              Быстро. Чётко. <span className="text-[#ffc400]">С фиксацией.</span>
            </h2>

            <p className="mt-4 max-w-xl text-black/60">
              Главная цель — чтобы у вас были аргументы и документ, который действительно работает.
            </p>

            {/* timeline */}
            <div className="mt-10 space-y-6">
              {steps.map((s, idx) => (
                <div key={s.n} className="relative pl-12">
                  {/* линия */}
                  <div className="absolute left-4 top-0 h-full w-px bg-black/10" />
                  {/* точка */}
                  <div className="absolute left-2.25 top-1.5 h-3 w-3 rounded-full bg-[#ffc400]" />


                  <div className="rounded-3xl bg-white p-6 shadow-[0_14px_45px_rgba(0,0,0,0.06)] ring-1 ring-black/10">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-extrabold text-black/40">ШАГ {s.n}</div>
                        <div className="mt-2 text-lg font-extrabold">{s.title}</div>
                        <div className="mt-2 text-sm leading-relaxed text-black/60">{s.text}</div>
                      </div>

                      {/* маленький номер как “маркер” */}
                      <div className="shrink-0 rounded-2xl bg-black px-3 py-2 text-xs font-extrabold text-white">
                        {idx + 1}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — callout */}
          <div className="relative">
            {/* подложка — вокруг, не “таблично” */}
            <div className="absolute -left-4 top-4 h-[calc(100%-16px)] w-[calc(100%+16px)] rounded-3xl bg-[#ffc400]" />

            <div className="relative rounded-3xl bg-white p-8 shadow-[0_22px_70px_rgba(0,0,0,0.12)] ring-1 ring-black/10">
              <div className="text-xl font-extrabold">Оставить заявку</div>
              <p className="mt-3 text-sm leading-relaxed text-black/60">
                Напишите город и ЖК — подскажем, как подготовиться и что проверить в первую очередь.
              </p>

              <div className="mt-7 grid gap-3">
                <a href="#form" className="btn-primary w-full text-center">
                  Записаться
                </a>
                <a href="tel:+79787043316" className="btn-outline w-full text-center">
                  Позвонить: +7 (978) 704-33-16
                </a>
              </div>

              <div className="mt-6 rounded-2xl bg-black/3 p-4 text-xs text-black/70 ring-1 ring-black/10">
                <span className="font-extrabold text-black">Крым:</span> Севастополь, Симферополь, Ялта, Алушта и др.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
