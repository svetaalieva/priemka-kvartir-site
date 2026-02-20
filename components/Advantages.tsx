"use client";

const items = [
  {
    title: "Документы и квалификация",
    desc: "Покажем подтверждения и допуски. Всё прозрачно — до выезда.",
  },
  {
    title: "Акт замечаний",
    desc: "Пишем по нормам и фактам. Чтобы застройщик устранял дефекты, а не спорил.",
  },
  {
    title: "Фото и видео фиксация",
    desc: "Фиксируем всё на месте, чтобы у вас были доказательства и спокойствие.",
  },
  {
    title: "Опыт по новостройкам",
    desc: "Знаем типовые проблемы ЖК. Проверяем быстро и внимательно.",
  },
];

export default function Advantages() {
  return (
    <section className="section-light">
      <div className="site-container py-12 md:py-16">
        {/* Заголовок секции */}
        <div className="max-w-2xl">
          <div className="text-sm font-semibold tracking-wide text-black/60">
            Почему нам доверяют
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            Приёмка без лишних слов — только факты
          </h2>
          <p className="mt-3 text-black/70 md:text-lg">
            Мы на вашей стороне: проверяем, фиксируем, оформляем так, чтобы было проще добиться
            устранения недостатков.
          </p>
        </div>

        {/* Карточки */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((x) => (
            <div
              key={x.title}
              className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_14px_45px_rgba(0,0,0,0.06)]"
            >
              {/* “иконка” без библиотек */}
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 border border-black/10">
                <span className="text-sm font-black text-black/70">✓</span>
              </div>

              <div className="text-base font-extrabold">{x.title}</div>
              <div className="mt-2 text-sm text-black/70">{x.desc}</div>
            </div>
          ))}
        </div>

        {/* Мини CTA */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#lead" className="btn-primary">
            Оставить заявку
          </a>
          <a href="#docs" className="btn-outline">
            Посмотреть документы
          </a>
          <div className="text-xs text-black/50">Севастополь • Симферополь • Ялта и др.</div>
        </div>
      </div>
    </section>
  );
}
