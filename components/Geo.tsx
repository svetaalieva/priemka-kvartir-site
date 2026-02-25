"use client";

import { useMemo, useState } from "react";

type City = { name: string };

export default function Geo() {
  const phoneLink = "tel:+79787043316";

  const cities = useMemo<City[]>(
    () => [
      { name: "Севастополь" },
      { name: "Симферополь" },
      { name: "Ялта" },
      { name: "Алушта" },
      { name: "Евпатория" },
      { name: "Саки" },
      { name: "Бахчисарай" },
      { name: "Феодосия" },
      { name: "Коктебель" },
      { name: "Судак" },
      { name: "Керчь" },
      { name: "Джанкой" },
      { name: "Красноперекопск" },
      { name: "Армянск" },
      { name: "Раздольное" },
      { name: "Черноморское" },
      { name: "Ленино" },
      { name: "Гурзуф" },
      { name: "Партенит" },
      { name: "Алупка" },
      { name: "Симеиз" },
      { name: "Форос" },
      { name: "Балаклава" },
      { name: "Инкерман" },
      { name: "Николаевка" },
      { name: "Белогорск" },
      { name: "Нижнегорский" },
    ],
    []
  );

  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return cities;
    return cities.filter((c) => c.name.toLowerCase().includes(query));
  }, [cities, q]);

  const pickCity = (name: string) => {
    window.dispatchEvent(new CustomEvent("geo:city", { detail: { city: name } }));
  };

  return (
    <section id="geo" className="relative bg-white">
      {/* мягкая подсветка секции */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-0 h-140 w-140 rounded-full bg-[#ffc400]/12 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-140 w-140 rounded-full bg-black/5 blur-3xl" />
      </div>

      <div className="site-container relative py-16 md:py-20">
        <div className="mb-7">
          <div className="text-sm font-semibold text-black/50">География</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">
            Работаем по всему <span className="text-[#ffc400]">Крыму</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/60">
            Обычная карта + удобный выбор города. Нажмите на город — он подставится в заявку.
          </p>
        </div>

        {/* ✅ ВАУ-БЛОК: карта во всю ширину */}
        <div className="relative overflow-hidden rounded-4xl border border-black/10 bg-white shadow-[0_28px_100px_rgba(0,0,0,0.10)]">
          {/* декоративные слои */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-linear-to-br from-[#ffc400]/10 via-transparent to-black/5" />
            <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#ffc400]/14 blur-3xl" />
            <div className="absolute -right-40 top-10 h-120 w-120 rounded-full bg-black/5 blur-3xl" />
          </div>

          <div className="relative flex flex-wrap items-center justify-between gap-4 px-6 pt-6 md:px-10 md:pt-8">
            <div>
              <div className="text-lg font-extrabold tracking-tight md:text-xl">Карта выездов</div>
              <div className="mt-1 text-sm text-black/50">Обычная карта — максимально стабильно</div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-xs font-bold text-black/60">
                Крым
              </span>
              <a href={phoneLink} className="btn-outline px-4 py-3 text-sm">
                Позвонить
              </a>
            </div>
          </div>

          <div className="relative mt-6 grid gap-6 px-6 pb-6 md:px-10 md:pb-10 lg:grid-cols-[1.35fr_0.65fr]">
            {/* КАРТА */}
            <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_22px_70px_rgba(0,0,0,0.08)]">
              <div className="relative h-[360px] w-full md:h-[520px] overflow-hidden">
                {/* лёгкая “встройка” карты в дизайн */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffc400]/10 via-transparent to-black/5" />

                <iframe
                  title="Карта Крыма"
                  className="absolute inset-0 h-full w-full scale-[1.02] transition duration-700 hover:scale-[1.03]"
                  src="https://yandex.ru/map-widget/v1/?ll=34.1024%2C45.2916&z=7&l=map"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* мягкое затемнение краёв */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.10))]" />

                <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/85 px-4 py-2 text-xs font-bold text-black/60 ring-1 ring-black/10 backdrop-blur">
                  Выберите город справа — подставим в форму
                </div>
              </div>

              <div className="flex items-center justify-between px-5 py-4 text-xs text-black/45">
                <span>Карта справочная</span>
                <a href="#form" className="font-bold text-black/60 hover:underline">
                  Перейти к заявке
                </a>
              </div>
            </div>

            {/* ГОРОДА */}
            <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_22px_70px_rgba(0,0,0,0.08)]">
              <div className="border-b border-black/10 px-5 py-4">
                <div className="text-lg font-extrabold tracking-tight">Города</div>
                <div className="mt-1 text-sm text-black/50">Нажмите — подставим в заявку</div>

                <div className="relative mt-4">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35">
                    🔎
                  </span>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Поиск (например, Ялта)"
                    className="w-full rounded-2xl border border-black/10 bg-white px-11 py-3 text-sm font-semibold text-black shadow-[0_14px_40px_rgba(0,0,0,0.06)] outline-none transition focus:border-black/25"
                  />
                </div>
              </div>

              <div className="max-h-[420px] overflow-auto p-2">
                {filtered.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => pickCity(c.name)}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-black/[0.03]"
                  >
                    <span className="text-sm font-extrabold">{c.name}</span>
                    <span className="text-xs font-bold text-black/45">выбрать</span>
                  </button>
                ))}

                {!filtered.length ? (
                  <div className="px-4 py-6 text-sm text-black/55">Ничего не найдено.</div>
                ) : null}
              </div>

              <div className="border-t border-black/10 px-5 py-4">
                <a href="#form" className="btn-primary w-full text-center">
                  Оставить заявку
                </a>
                <div className="mt-2 text-xs font-semibold text-black/40">
                  Можно указать город и ЖК вручную — как удобнее.
                </div>
              </div>
            </div>
          </div>

          {/* лёгкая “тень снизу” */}
          <div className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-80 -translate-x-1/2 rounded-full bg-black/10 blur-2xl" />
        </div>
      </div>
    </section>
  );
}