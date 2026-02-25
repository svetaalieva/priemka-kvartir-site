"use client";

import type { ComponentType } from "react";

import {
  IconNewBuildCheck,
  IconThermal,
  IconEMI,
  IconRadiation,
  IconConclusion,
  IconPlan,
} from "./service-icons";

type IconComp = ComponentType<{ className?: string }>;

type Svc = {
  title: string;
  desc: string;
  icon: IconComp;
  hit?: boolean;
};

export default function Services() {
  const services: Svc[] = [
    {
      title: "Приёмка квартиры в новостройке",
      desc: "Проверка качества отделки, инженерии и площади. Фото/видео фиксация и акт замечаний.",
      icon: IconNewBuildCheck,
      hit: true,
    },
    {
      title: "Тепловизионный осмотр",
      desc: "Проверяем теплопотери, продувания, мостики холода и скрытые дефекты.",
      icon: IconThermal,
    },
    {
      title: "Замер квартиры на ЭМИ",
      desc: "Контроль электромагнитного фона (по запросу) и рекомендации по снижению рисков.",
      icon: IconEMI,
    },
    {
      title: "Замер квартиры на радиацию",
      desc: "Проверка радиационного фона (по запросу) с фиксацией результатов.",
      icon: IconRadiation,
    },
    {
      title: "Заключение специалиста",
      desc: "Письменное заключение по выявленным дефектам и рекомендации по устранению.",
      icon: IconConclusion,
    },
    {
      title: "Подробный план квартиры",
      desc: "Детальный обмер и планировка: удобно для ремонта, мебели и понимания реальной площади.",
      icon: IconPlan,
    },
  ];

  return (
    <section id="services" className="relative bg-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-10 h-140 w-140 rounded-full bg-[#ffc400]/10 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-140 w-140 rounded-full bg-black/5 blur-3xl" />
      </div>

      <div className="site-container relative py-16 md:py-20">
        <div className="mb-10 md:mb-12">
          <div className="text-sm font-semibold text-black/50">Услуги</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">
            Что мы <span className="text-[#ffc400]">проверяем</span> и делаем
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/60">
            Формат подбираем под задачу: от приёмки в новостройке до точечных инструментальных проверок.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;

            return (
              <div
                key={s.title}
                className={[
                  "group relative overflow-hidden rounded-3xl border border-black/10 bg-white p-6",
                  "shadow-[0_22px_70px_rgba(0,0,0,0.08)]",
                  "transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_95px_rgba(0,0,0,0.12)]",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ffc400]/14 blur-3xl" />
                  <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-black/5 blur-3xl" />
                </div>

                {s.hit ? (
                  <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#ffc400] px-3 py-1 text-xs font-extrabold text-black shadow-[0_16px_40px_rgba(255,196,0,0.25)]">
                    ХИТ
                  </div>
                ) : null}

                <div className="relative flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-2xl bg-[#ffc400]/18 blur-xl opacity-0 transition duration-300 group-hover:opacity-100" />
                    <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-extrabold tracking-tight text-black">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-black/60">{s.desc}</p>
                  </div>
                </div>

                <div className="relative mt-6 flex items-center gap-3">
                  <a href="#form" className="btn-primary">
                    Записаться
                  </a>
                  <a href="#process" className="btn-outline">
                    Как работаем
                  </a>
                </div>

                {s.hit ? <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-[#ffc400]/35" /> : null}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-xs font-semibold text-black/40">
          * Формат и стоимость уточняем по телефону — зависит от площади и типа отделки.
        </div>
      </div>
    </section>
  );
}