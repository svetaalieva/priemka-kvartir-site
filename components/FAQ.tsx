"use client";

import { useMemo, useState } from "react";

type FAQItem = {
  q: string;
  a: string;
  meta?: string;
  tag?: string;
};

export default function FAQ() {
  const items: FAQItem[] = useMemo(
    () => [
      {
        q: "Сколько длится приёмка квартиры?",
        a: "Обычно 2–3 часа. Точное время зависит от площади, типа отделки и количества инженерных точек (электрика/сантехника).",
        meta: "В среднем 2–3 часа",
        tag: "Время",
      },
      {
        q: "Что я получу по итогу?",
        a: "Список замечаний (акт/перечень дефектов) для передачи застройщику + фото/видео фиксацию спорных мест. Подскажем, как правильно формулировать требования.",
        meta: "Акт + фото/видео",
        tag: "Результат",
      },
      {
        q: "Нужно ли моё присутствие на приёмке?",
        a: "Желательно, но не обязательно. Можем провести приёмку без вас и передать материалы удалённо — согласуем формат заранее.",
        meta: "Можно без присутствия",
        tag: "Формат",
      },
      {
        q: "Работаете по всему Крыму?",
        a: "Да. Севастополь, Симферополь, Ялта и другие города/посёлки. Если вашего города нет в списке — всё равно напишите, подскажем по выезду.",
        meta: "Выезд по Крыму",
        tag: "География",
      },
      {
        q: "Сколько стоит приёмка?",
        a: "Стоимость зависит от площади и формата (с отделкой/без, дом/квартира). Точную сумму подтверждаем по телефону после уточнения объекта.",
        meta: "Зависит от площади",
        tag: "Цена",
      },
      {
        q: "Что нужно подготовить перед приездом?",
        a: "Доступ в квартиру, документы от застройщика (если есть), ручку/лист для отметок. Если есть список обещаний застройщика — тоже пригодится.",
        meta: "Доступ + документы",
        tag: "Подготовка",
      },
    ],
    []
  );

  const [openIndex, setOpenIndex] = useState<number>(1);

  return (
    <section id="faq" className="relative bg-white">
      {/* фон/глоу */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-120 w-120 -translate-x-1/2 rounded-full bg-[#ffc400]/12 blur-3xl" />
        <div className="absolute right-[-120px] top-[120px] h-120 w-120 rounded-full bg-black/5 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white via-white to-transparent" />
      </div>

      <div className="site-container relative py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,520px)] md:items-start">
          {/* ЛЕВО: заголовок/чипы/CTA */}
          <div className="md:sticky md:top-24">
            <div className="text-sm font-semibold tracking-wide text-black/50">FAQ</div>

            <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-6xl">
              Частые <span className="text-[#ffc400]">вопросы</span>
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-black/60">
              Коротко отвечаем на то, что спрашивают чаще всего. Если вопроса нет — напишите, добавим.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-black shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#ffc400]" />
                Понятно и по делу
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-black shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <span className="inline-block h-2 w-2 rounded-full bg-black/30" />
                Без «воды»
              </span>
            </div>

            <div className="mt-8 rounded-3xl border border-black/10 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
              <div className="text-sm font-extrabold">Не нашли свой вопрос?</div>
              <div className="mt-1 text-sm text-black/60">Оставьте заявку — уточним за 2–3 минуты.</div>

              <div className="mt-4 flex flex-wrap gap-3">
                <a href="#form" className="btn-primary transition hover:-translate-y-[1px]">
                  Оставить заявку
                </a>
                <a href="#services" className="btn-outline transition hover:-translate-y-[1px]">
                  Посмотреть услуги
                </a>
              </div>

              <div className="mt-4 text-xs text-black/50">Ответим быстро • Выезд по Крыму</div>
            </div>
          </div>

          {/* ПРАВО: “дорогой” аккордеон */}
          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-[0_22px_70px_rgba(0,0,0,0.08)] md:p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold text-black/70">Вопросы и ответы</div>
              <div className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-xs font-bold text-black/60">
                6 вопросов
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {items.map((it, idx) => {
                const open = idx === openIndex;

                return (
                  <div
                    key={it.q}
                    className={[
                      "group rounded-2xl border transition",
                      open
                        ? "border-black/10 bg-[#ffc400]/10 shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
                        : "border-black/10 bg-white hover:bg-black/[0.02] hover:shadow-[0_14px_40px_rgba(0,0,0,0.06)]",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? -1 : idx)}
                      className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={open}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {it.tag ? (
                            <span className="inline-flex rounded-full bg-black px-3 py-1 text-[11px] font-extrabold text-white">
                              {it.tag}
                            </span>
                          ) : null}

                          {it.meta ? (
                            <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-extrabold text-black/70">
                              {it.meta}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-2 text-base font-extrabold leading-snug tracking-tight md:text-lg">
                          {it.q}
                        </div>
                      </div>

                      {/* иконка */}
                      <span
                        className={[
                          "mt-1 inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border border-black/10 bg-white transition",
                          open ? "rotate-45" : "rotate-0",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 5v14M5 12h14"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </button>

                    {/* плавное раскрытие без max-height дерготни */}
                    <div className={["grid transition-[grid-template-rows] duration-300 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"].join(" ")}>
                      <div className="overflow-hidden">
                        <div className="px-5 pb-5">
                          <div className="h-px w-full bg-black/10" />
                          <p className="mt-4 text-sm leading-relaxed text-black/65">{it.a}</p>

                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <a
                              href="#form"
                              className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-extrabold text-white transition hover:-translate-y-[1px]"
                            >
                              Задать вопрос
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#ffc400]" />
                            </a>

                            <span className="text-xs text-black/45">
                              Можно уточнить по телефону — отвечаем быстро
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* микро-подсветка снизу */}
                    <div className="pointer-events-none relative">
                      <div className="absolute inset-x-6 -bottom-1 h-6 rounded-full bg-[#ffc400]/0 blur-xl transition group-hover:bg-[#ffc400]/10" />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
