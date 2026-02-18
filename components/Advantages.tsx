"use client";

const items = [
  { title: "50+ параметров проверки", text: "Проверяем отделку, инженерные системы и скрытые дефекты." },
  { title: "Проверка площади", text: "Сверяем фактическую площадь с проектной документацией." },
  { title: "Фото и видеофиксация", text: "Каждый дефект фиксируется и передаётся вам в отчёте." },
  { title: "Акт замечаний", text: "Подготавливаем официальный документ для застройщика." },
];

export default function Advantages() {
  return (
    <section
  id="advantages"
  className="section-dark pt-10 pb-10 md:pt-14 md:pb-14"
>
  <div className="site-container py-16 md:py-20">

        {/* Верх */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-extrabold text-white ring-1 ring-white/10">
              <span className="h-2 w-2 rounded-full bg-(--brand-yellow)" />
              Почему нам доверяют
            </div>

            <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Аргументы и документ, <span className="text-(--brand-yellow)">которые работают</span>
            </h2>

            <p className="mt-4 max-w-2xl text-base text-white/70">
              Выявляем дефекты до подписания акта приёма-передачи. Защищаем ваши интересы перед застройщиком.
            </p>
          </div>

          {/* Пилюли (не режутся) */}
          <div className="flex flex-wrap gap-2 md:justify-end">
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-extrabold text-black">
              Фото/видео
            </span>
            <span className="inline-flex rounded-full bg-(--brand-yellow) px-4 py-2 text-xs font-extrabold text-black">
              Акт замечаний
            </span>
          </div>
        </div>

        {/* Карточки */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-1"
            >
              {/* Свечение на ховер */}
              <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-(--brand-yellow)/20 blur-3xl opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

              <div className="flex items-start justify-between gap-3">
                <div className="h-12 w-12 rounded-2xl bg-(--brand-yellow)" />
                <div className="text-xs font-extrabold text-white/40">Контроль качества</div>
              </div>

              <div className="mt-7 text-xl font-extrabold tracking-tight">{it.title}</div>
              <div className="mt-3 text-sm leading-relaxed text-white/70">{it.text}</div>

              <div className="mt-8 h-px w-full bg-white/10" />

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white/75">
                <span className="h-2 w-2 rounded-full bg-(--brand-yellow)" />
                Без «воды», только по делу
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
