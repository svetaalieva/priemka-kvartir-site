"use client";

/**
 * Services.tsx — ПРЕМИУМ-ВЕРСИЯ
 * Цель: убрать ощущение бухгалтерии (табличек), дать иерархию и воздух.
 * - 1 главный оффер (с акцентом)
 * - остальные услуги — проще и “легче”
 * - города — как “плашки на поверхности”, без тяжёлых рамок
 */

const cities = [
  "Севастополь",
  "Симферополь",
  "Ялта",
  "Партенит",
  "Алушта",
  "Евпатория",
  "Коктебель",
];

const services = [
  {
    tag: "Основная услуга",
    title: "Приёмка квартиры в новостройке",
    desc:
      "Проверка отделки, инженерии и геометрии. Фиксация дефектов и акт замечаний — чтобы застройщик устранил всё по делу.",
    points: ["50+ пунктов чек-листа", "Фото/видео фиксация", "Акт замечаний для застройщика"],
    price: "По запросу",
  },
  {
    tag: "После исправлений",
    title: "Повторная приёмка",
    desc: "Проверим устранение замечаний и подтвердим качество выполненных работ.",
    points: ["Контроль исправлений", "Сверка по акту", "Экономия времени"],
    price: "По запросу",
  },
  {
    tag: "Метры • деньги",
    title: "Проверка площади",
    desc: "Сверим фактическую площадь с проектной документацией и замерами.",
    points: ["Точные замеры", "Сравнение с документами", "Понятные выводы"],
    price: "По запросу",
  },
  {
    tag: "Подготовка",
    title: "Консультация перед приёмкой",
    desc: "Подскажем, как подготовиться, что взять с собой и на что смотреть в первую очередь.",
    points: ["Чек-лист", "Разбор кейса", "Советы по застройщику"],
    price: "По запросу",
  },
];

export default function Services() {
  const main = services[0];
  const rest = services.slice(1);

  return (
    <section id="services" className="relative bg-white">
      {/* мягкая подложка (не кричит, но “дороже”) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-[#ffc400]/12 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-black/5 blur-3xl" />
      </div>

      <div className="site-container relative py-16 md:py-20">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-extrabold text-white">
              <span className="inline-block h-2 w-2 rounded-full bg-[#ffc400]" />
              Услуги • Крым
            </div>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-5xl">
              Услуги, которые дают <span className="text-[#ffc400]">результат</span>
            </h2>

            <p className="mt-4 max-w-2xl text-black/60">
              Без лишних слов: проверка + фиксация + документ. Всё, чтобы застройщик устранял замечания по существу.
            </p>
          </div>

          {/* меньше “пилюль” — но статусность сохраняем */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-extrabold text-black ring-1 ring-black/10">
              Документы
            </span>
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-extrabold text-black ring-1 ring-black/10">
              Гарантия
            </span>
            <span className="inline-flex rounded-full bg-[#ffc400] px-4 py-2 text-xs font-extrabold text-black">
              Опыт
            </span>
          </div>
        </div>

        {/* Layout */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {/* Main offer */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_22px_70px_rgba(0,0,0,0.10)] ring-1 ring-black/10">
              {/* верхняя “полоса статуса” */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-8 py-6">
                <span className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-extrabold text-white">
                  {main.tag}
                </span>

                <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-xs font-extrabold text-black">
                  <span className="text-black/50">Стоимость</span>
                  <span className="inline-flex rounded-full bg-[#ffc400] px-3 py-1 text-xs font-extrabold text-black">
                    {main.price}
                  </span>
                </div>
              </div>

              <div className="px-8 py-8">
                <h3 className="text-2xl font-extrabold tracking-tight md:text-3xl">{main.title}</h3>
                <p className="mt-3 max-w-2xl text-black/60">{main.desc}</p>

                {/* вместо “табличек” — 3 аккуратных пункта в одну линию */}
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {main.points.map((p) => (
                    <div
                      key={p}
                      className="rounded-2xl bg-black/3 px-4 py-4 text-sm font-semibold text-black/80 ring-1 ring-black/10"
                    >
                      <div className="mb-2 inline-flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#ffc400]" />
                        <span className="text-xs font-extrabold text-black/60">Включено</span>
                      </div>
                      <div className="leading-snug">{p}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#form" className="btn-primary">
                    Оставить заявку
                  </a>
                  <a href="#docs" className="btn-outline">
                    Документы
                  </a>
                </div>
              </div>

              {/* премиальный акцент — только фон, не “желтизна” */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#ffc400]/14 blur-3xl" />
            </div>
          </div>

          {/* Secondary offers — меньше рамок, больше воздуха */}
          <div className="lg:col-span-5">
            <div className="grid gap-6">
              {rest.map((it) => (
                <div
                  key={it.title}
                  className="rounded-3xl bg-white p-7 shadow-[0_16px_50px_rgba(0,0,0,0.07)] ring-1 ring-black/10"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <span className="inline-flex rounded-full bg-black/5 px-3 py-1.5 text-xs font-extrabold text-black/70">
                        {it.tag}
                      </span>

                      <h4 className="mt-4 text-xl font-extrabold tracking-tight">{it.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-black/60">{it.desc}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-xs font-bold text-black/35">Стоимость</div>
                      <div className="mt-2 inline-flex rounded-full bg-[#ffc400] px-3 py-1 text-xs font-extrabold text-black">
                        {it.price}
                      </div>
                    </div>
                  </div>

                  {/* пункты — как список, без “плашек-табличек” */}
                  <div className="mt-5 space-y-2">
                    {it.points.map((p) => (
                      <div key={p} className="flex items-center gap-2 text-sm text-black/70">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#ffc400]" />
                        <span className="font-semibold text-black/80">{p}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <a href="#form" className="btn-primary">
                      Оставить заявку
                    </a>
                    <a href="#docs" className="btn-outline">
                      Документы
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Geography — как “премиальная панель”, без тяжёлой рамки */}
        <div className="mt-12 rounded-3xl bg-white shadow-[0_16px_55px_rgba(0,0,0,0.06)] ring-1 ring-black/10">
          <div className="flex flex-col gap-2 border-b border-black/10 px-7 py-6 md:flex-row md:items-center md:justify-between">
            <div className="text-sm font-extrabold">
              География работы: <span className="text-[#ffc400]">Крым</span>
            </div>
            <div className="text-xs font-bold text-black/40">Основные города присутствия</div>
          </div>

          <div className="px-7 py-6">
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <span
                  key={c}
                  className="inline-flex rounded-full bg-black/3 px-3 py-2 text-xs font-extrabold text-black/70 ring-1 ring-black/10"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
