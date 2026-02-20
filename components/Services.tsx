"use client";

/**
 * Услуги — премиальные карточки
 * - без картинок из public (чтобы ничего не ломалось)
 * - цена не переносится
 * - аккуратные иконки через CSS
 */

type ServiceItem = {
  title: string;
  price: string;
  note: string;
  bullets: string[];
  badge?: string;
  icon: string;
};

const services: ServiceItem[] = [
  {
    title: "Приёмка квартиры с отделкой",
    price: "от 5 000 ₽",
    note: "Оптимально для большинства новостроек",
    badge: "ХИТ",
    icon: "🏠",
    bullets: [
      "Отделка: стены, пол, потолок",
      "Окна/двери, откосы, подоконники",
      "Сантехника и электрика",
      "Фото/видео фиксация",
      "Акт замечаний",
    ],
  },
  {
    title: "Приёмка без отделки",
    price: "от 4 000 ₽",
    note: "Когда важно проверить основание и инженерию",
    icon: "📐",
    bullets: [
      "Геометрия, уровни, плоскости",
      "Стяжка/штукатурка",
      "Инженерные выводы",
      "Фото/видео фиксация",
      "Акт замечаний",
    ],
  },
  {
    title: "Повторная приёмка",
    price: "от 3 000 ₽",
    note: "Контроль устранения замечаний",
    icon: "🔁",
    bullets: [
      "Проверка устранения дефектов",
      "Сравнение «до/после»",
      "Дополнение акта",
      "Фото/видео фиксация",
    ],
  },
];

export default function Services() {
  return (
    <section className="section-light" id="services">
      <div className="site-container py-12 md:py-16">

        {/* Заголовок */}
        <div className="max-w-2xl">
          <div className="text-sm font-semibold tracking-wide text-black/60">
            Услуги
          </div>

          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            Выберите формат приёмки
          </h2>

          <p className="mt-3 text-black/70 md:text-lg">
            Проверка → фиксация → акт замечаний для застройщика.
          </p>
        </div>

        {/* Карточки */}
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white p-6 shadow-[0_14px_45px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(0,0,0,0.10)]"
            >
             

              {/* Верхняя часть */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Иконка */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-black/5 text-lg">
                    {s.icon}
                  </div>

                  <div>
                   <div className="flex flex-wrap items-center gap-2">
  <div className="text-lg font-extrabold">{s.title}</div>

  {s.badge && (
    <span className="rounded-full bg-[var(--brand-yellow)] px-2.5 py-1 text-[11px] font-extrabold text-black shadow-[0_10px_24px_rgba(255,196,0,0.25)]">
      {s.badge}
    </span>
  )}
</div>

                    <div className="mt-1 text-sm text-black/60">
                      {s.note}
                    </div>
                  </div>
                </div>

                {/* Цена — НЕ переносится */}
                <div className="text-right whitespace-nowrap">
                  <div className="text-lg font-extrabold">
                    {s.price}
                  </div>
                  <div className="mt-1 text-xs text-black/50">
                    выезд по Крыму
                  </div>
                </div>
              </div>

              {/* Список */}
              <ul className="mt-5 space-y-2 text-sm text-black/75">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/5 border border-black/10 text-xs font-black">
                      ✓
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Кнопки */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#lead" className="btn-primary">
                  Записаться
                </a>
                <a href="#process" className="btn-outline">
                  Как работаем
                </a>
              </div>

              {/* Мягкий световой акцент */}
              <div className="pointer-events-none absolute -bottom-24 -right-24 h-[260px] w-[260px] rounded-full bg-[var(--brand-yellow)]/20 blur-3xl opacity-0 transition group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* Подпись */}
        <div className="mt-6 text-xs text-black/50">
          * Цена зависит от площади и формата отделки. Точную стоимость подтверждаем по телефону.
        </div>

      </div>
    </section>
  );
}
