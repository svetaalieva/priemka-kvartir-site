"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import Advantages from "@/components/Advantages";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Docs from "@/components/Docs";

type Social = {
  name: string;
  href: string;
  icon: "tg" | "vk" | "ig";
};

export default function Home() {
  const phoneDisplay = "+7 (978) 704-33-16";
  const phoneLink = "tel:+79787043316";
  const email = "i@snegoda.ru";

  const socials: Social[] = useMemo(
    () => [
      { name: "Telegram", href: "#", icon: "tg" },
      { name: "VK", href: "#", icon: "vk" },
      { name: "Instagram", href: "#", icon: "ig" },
    ],
    []
  );

  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* ========================= HEADER ========================= */}
      <header className="z-40">
        {/* Верхняя белая полоса */}
        <div className="border-b border-black/10 bg-white">
          <div className="site-container">
            <div className="flex items-center justify-between gap-4 py-3 md:py-4">
              {/* Логотип */}
              <a href="#" className="flex items-center">
                <Image
                  src="/brand/logo-horizontal.png"
                  alt="Контроль качества"
                  width={520}
                  height={140}
                  priority
                  className="h-12 w-auto md:h-16"
                />
              </a>

              {/* Телефон + соцсети (десктоп) */}
              <div className="hidden items-center justify-end gap-5 md:flex">
                <a
                  href={phoneLink}
                  className="whitespace-nowrap text-lg font-extrabold tracking-tight text-black hover:underline"
                >
                  {phoneDisplay}
                </a>

                <div className="flex items-center gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:opacity-90"
                      aria-label={s.name}
                      title={s.name}
                    >
                      {s.icon === "tg" && (
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                          <path d="M9.9 16.6l-.4 4.2c.6 0 .9-.3 1.2-.6l2.8-2.6 5.8 4.2c1.1.6 1.8.3 2.1-1l3.8-17.8c.4-1.6-.6-2.2-1.6-1.8L1.6 9.3c-1.5.6-1.5 1.5-.3 1.9l5.6 1.8 13-8.2c.6-.4 1.2-.2.8.2L9.9 16.6z" />
                        </svg>
                      )}
                      {s.icon === "vk" && (
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                          <path d="M12.8 17.3h1.2s.4 0 .6-.2c.2-.2.2-.5.2-.5s0-1.6.7-1.8c.7-.2 1.6 1.5 2.5 2.1.7.5 1.3.4 1.3.4l2.6-.1s1.4-.1.7-1.2c-.1-.1-.5-1-2.6-3-.2-.2-.5-.6-.2-1.1.3-.4 2.2-3 2.5-4 .2-.7-.3-.7-.3-.7l-2.9.1s-.4-.1-.7.1c-.3.2-.4.5-.4.5s-.5 1.4-1.2 2.6c-1.5 2.4-2.1 2.5-2.4 2.3-.7-.4-.5-1.6-.5-2.4 0-2.6.4-3.7-.8-4-.4-.1-.7-.2-1.7-.2-1.3 0-2.3 0-2.9.3-.4.2-.7.6-.5.6.3 0 .9.2 1.2.6.4.6.4 1.9.4 1.9s.2 3.1-.4 3.5c-.4.3-.9-.3-2-2.3-.6-1.2-1-2.5-1-2.5s-.1-.3-.4-.5c-.3-.2-.7-.2-.7-.2l-2.7.1s-.4 0-.5.2c-.2.2 0 .6 0 .6s2.1 4.8 4.6 7.2c2.3 2.2 4.9 2 4.9 2z" />
                        </svg>
                      )}
                      {s.icon === "ig" && (
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2zM17.7 6.1a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
                        </svg>
                      )}
                    </a>
                  ))}
                  <span className="text-lg font-black text-black">*</span>
                </div>
              </div>

              {/* Мобилка */}
              <div className="flex items-center justify-end gap-3 md:hidden">
                <a href={phoneLink} className="btn-outline px-4 py-3 text-sm">
                  Позвонить
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenu(true)}
                  className="btn-outline px-4 py-3"
                  aria-label="Открыть меню"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Чёрная полоса меню (sticky) */}
        <div className="sticky top-0 bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          <div className="site-container">
            <nav className="hidden items-center gap-8 py-3 text-sm font-extrabold uppercase tracking-wide md:flex">
              <a className="relative pb-2 text-white" href="#">
                Главная
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#ffc400]" />
              </a>

              <a className="pb-2 text-white/80 hover:text-white" href="#services">
                Услуги
              </a>
              <a className="pb-2 text-white/80 hover:text-white" href="#process">
                Как работаем
              </a>
              <a className="pb-2 text-white/80 hover:text-white" href="#docs">
                Документы
              </a>
              <a className="pb-2 text-white/80 hover:text-white" href="#faq">
                FAQ
              </a>

              <div className="ml-auto">
                <a href="#form" className="btn-primary">
                  Оставить заявку
                </a>
              </div>
            </nav>

            <div className="flex items-center justify-between py-3 md:hidden">
              <span className="text-xs font-extrabold uppercase tracking-wide text-white/70">Меню</span>
              <a href="#form" className="btn-primary" onClick={() => setMobileMenu(false)}>
                Заявка
              </a>
            </div>
          </div>
        </div>

        {/* Мобильное меню */}
        {mobileMenu ? (
          <div className="md:hidden">
            <button
              type="button"
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setMobileMenu(false)}
              aria-label="Закрыть меню"
            />
            <div className="fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="text-lg font-extrabold">Меню</div>
                <button type="button" className="btn-outline px-3 py-2" onClick={() => setMobileMenu(false)}>
                  ✕
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-3 text-sm font-bold uppercase">
                <a href="#" onClick={() => setMobileMenu(false)} className="py-2">
                  Главная
                </a>
                <a href="#services" onClick={() => setMobileMenu(false)} className="py-2">
                  Услуги
                </a>
                <a href="#process" onClick={() => setMobileMenu(false)} className="py-2">
                  Как работаем
                </a>
                <a href="#docs" onClick={() => setMobileMenu(false)} className="py-2">
                  Документы
                </a>
                <a href="#faq" onClick={() => setMobileMenu(false)} className="py-2">
                  FAQ
                </a>

                <div className="mt-4">
                  <a href="#form" onClick={() => setMobileMenu(false)} className="btn-primary w-full text-center">
                    Оставить заявку
                  </a>
                </div>

                <div className="mt-6 text-base font-extrabold normal-case">
                  <a href={phoneLink} className="hover:underline">
                    {phoneDisplay}
                  </a>
                  <div className="mt-1 text-sm text-black/60">{email}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {/* ========================= CONTENT ========================= */}
      <main>
        {/* HERO */}
        <section className="relative bg-white pt-6 md:pt-8">
          {/* лёгкий фон (только CSS) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-28 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[#ffc400]/16 blur-3xl" />
            <div className="absolute -top-32 -left-24 h-105 w-105 rounded-full bg-black/5 blur-3xl" />
            <div className="absolute right-0 top-24 h-130 w-130 rounded-full bg-black/5 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-white via-white to-transparent" />
          </div>

          {/* ВАЖНО:
              - Отступ от чёрной навигации делаем через padding секции (pt-6/pt-8)
              - Пилюли и рамка фото стартуют с одной линии (items-start + без отрицательных margin)
          */}
          <div className="site-container relative pb-16 md:pb-24">
            <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_380px] md:items-start">
              {/* ЛЕВО */}
              <div>
                {/* Пилюльки (подняты максимально “вверх”, но с безопасным отступом от навигации) */}
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-bold text-white">
                    Работаем по всему Крыму
                  </span>
                  <span className="inline-flex rounded-full bg-[#ffc400] px-4 py-2 text-xs font-bold text-black">
                    Акт замечаний для застройщика
                  </span>
                </div>

                <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight md:mt-5 md:text-6xl">
                  Профессиональная <span className="text-[#ffc400]">приёмка</span> квартир в новостройках
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-black/70">
                  Проверим качество отделки, инженерные системы и площадь. Составим акт замечаний для застройщика и
                  подскажем, как добиться устранения дефектов.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="#form" className="btn-primary">
                    Записаться
                  </a>
                  <a href={phoneLink} className="btn-outline">
                    Позвонить
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm text-black/60">
                  <div>
                    <span className="font-extrabold text-black">2–3 часа</span> осмотр
                  </div>
                  <div>
                    <span className="font-extrabold text-black">50+ пунктов</span> проверки
                  </div>
                  <div>
                    <span className="font-extrabold text-black">Фото/видео</span> фиксация
                  </div>
                </div>
              </div>

              {/* ПРАВО — рамка фото на уровне пилюль, фото меньше */}
              <div className="relative mx-auto w-full max-w-95">
                {/* жёлтый акцент */}
                <div className="absolute -left-3 top-3 h-[calc(100%-12px)] w-[calc(100%+12px)] rounded-3xl bg-[#ffc400]" />

                <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_22px_70px_rgba(0,0,0,0.14)] ring-1 ring-black/10">
                  <div className="p-4 md:p-5">
                    <div className="mx-auto w-full max-w-85">
                      <div className="relative overflow-hidden rounded-3xl bg-black/5">
                        {/* ВАЖНО: без query-string, чтобы Next/Image не падал */}
                        <Image
                          src="/brand/sergey.jpg"
                          alt="Негода Сергей Владимирович"
                          width={340}
                          height={420}
                          priority
                          className="h-auto w-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 px-5 pb-5">
                    <div className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-bold text-white">
                      Выезд в день обращения • Крым
                    </div>
                    <div className="hidden text-xs font-bold text-black/50 md:block">Документ • Гарантия • Опыт</div>
                  </div>
                </div>

                <div className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-56 -translate-x-1/2 rounded-full bg-black/10 blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        <div className="h-10 md:h-14" />

        <Advantages />

        <div className="h-10 md:h-14" />

        <Services />

        <div className="h-10 md:h-14" />

        <Process />

        <div className="h-10 md:h-14" />

        <Docs />

        <div className="h-10 md:h-14" />

        {/* FAQ */}
        <section id="faq" className="bg-white">
          <div className="site-container py-16 md:py-20">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">FAQ</h2>
            <p className="mt-3 max-w-2xl text-black/60">Добавим вопросы/ответы. Косметику позже.</p>
          </div>
        </section>

        <div className="h-10 md:h-14" />

        {/* Форма */}
        <section id="form" className="bg-white">
          <div className="site-container py-16 md:py-20">
            <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)] md:p-10">
              <div className="grid gap-8 md:grid-cols-2 md:items-start">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-extrabold text-white">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#ffc400]" />
                    Заявка
                  </div>

                  <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
                    Оставьте заявку — перезвоним и уточним детали
                  </h2>

                  <p className="mt-3 max-w-xl text-black/60">
                    Город, ЖК и удобное время — этого достаточно, чтобы договориться о выезде.
                  </p>

                  <div className="mt-6 space-y-2 text-sm text-black/70">
                    <div>
                      <span className="font-extrabold text-black">Телефон:</span>{" "}
                      <a className="hover:underline" href={phoneLink}>
                        {phoneDisplay}
                      </a>
                    </div>
                    <div>
                      <span className="font-extrabold text-black">Почта:</span>{" "}
                      <a className="hover:underline" href={`mailto:${email}`}>
                        {email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* по твоей просьбе: без реальной отправки */}
                <form className="grid gap-3">
                  <input className="input" placeholder="Ваше имя" />
                  <input className="input" placeholder="Телефон" />
                  <input className="input" placeholder="Город / ЖК" />
                  <textarea className="input min-h-30 resize-none" placeholder="Комментарий (необязательно)" />
                  <button type="button" className="btn-primary w-full">
                    Отправить
                  </button>
                  <div className="text-xs text-black/50">
                    Нажимая «Отправить», вы соглашаетесь на обработку персональных данных.
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <div className="h-10 md:h-14" />
      </main>
    </div>
  );
}
