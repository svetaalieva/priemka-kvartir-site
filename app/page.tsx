"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useId, useRef } from "react";

import Advantages from "@/components/Advantages";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Docs from "@/components/Docs";
import Geo from "@/components/Geo";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

type Social = {
  name: string;
  href: string;
  icon: "tg" | "vk" | "ig";
};

type FormState = {
  name: string;
  phone: string;
  city: string;
  comment: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const maskPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  let d = digits;
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (d.startsWith("9")) d = "7" + d;

  // если вообще ничего — разрешаем пустое
  if (!d.length) return "";

  const p = d.startsWith("7") ? d.slice(1) : d; // всё кроме ведущей 7
  const a = p.slice(0, 3);
  const b = p.slice(3, 6);
  const c = p.slice(6, 8);
  const e = p.slice(8, 10);

  let out = "+7";
  if (a.length) out += ` (${a}`;
  if (a.length === 3) out += `)`;
  if (b.length) out += ` ${b}`;
  if (c.length) out += `-${c}`;
  if (e.length) out += `-${e}`;

  return out;
};

const phoneDigitsCount = (masked: string) => masked.replace(/\D/g, "").length;

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

  // ===== FORM =====
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    city: "",
    comment: "",
  });

  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState<null | "ok" | "err">(null);

  const formId = useId();
  const cityInputRef = useRef<HTMLInputElement | null>(null);

  const validate = (s: FormState): FormErrors => {
    const e: FormErrors = {};

    if (!s.name.trim()) e.name = "Введите имя (можно коротко).";

    const digits = phoneDigitsCount(s.phone);
    // для РФ: +7 + 10 цифр = 11 всего (включая 7)
    if (digits > 0 && digits < 11) e.phone = "Телефон выглядит неполным.";
    if (digits === 0) e.phone = "Нужен номер телефона для связи.";

    if (!s.city.trim()) e.city = "Укажите город/ЖК — так быстрее согласуем выезд.";

    // comment — не обязателен
    return e;
  };

  const softFieldClass = (field: keyof FormState) => {
    const hasErr = !!errors[field] && !!touched[field];
    return [
      "w-full rounded-2xl border bg-white px-4 py-4 text-base text-black outline-none",
      "transition duration-300",
      hasErr
        ? "border-black/15 shadow-[0_0_0_6px_rgba(0,0,0,0.04)]"
        : "border-black/10 hover:border-black/15 focus:border-black/20 focus:shadow-[0_0_0_6px_rgba(255,196,0,0.18)]",
    ].join(" ");
  };

  const submit = async () => {
    setSentOk(null);

    const nextErrors = validate(form);
    setErrors(nextErrors);
    setTouched({ name: true, phone: true, city: true, comment: true });

    if (Object.keys(nextErrors).length) return;

    try {
      setSending(true);

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          comment: form.comment.trim(),
          page: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      if (!res.ok) throw new Error("bad_response");
      setSentOk("ok");

      // лёгкий UX: чуть подчистим, но оставим город — чаще его вводят с картой
      setForm((s) => ({ ...s, name: "", phone: "", comment: "" }));
      setTouched({});
      setErrors({});
    } catch {
      setSentOk("err");
    } finally {
      setSending(false);
    }
  };

  // ===== AUTO-FILL CITY FROM GEO (через CustomEvent) =====
  useEffect(() => {
    const handler = (evt: Event) => {
      const e = evt as CustomEvent<{ city?: string }>;
      const city = e.detail?.city?.trim();
      if (!city) return;

      setForm((s) => ({ ...s, city }));
      setTouched((t) => ({ ...t, city: true }));
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.city;
        return copy;
      });

      // мягкий скролл к форме — “вау”-эффект
      const el = document.getElementById("form");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });

      // ✅ фокус в поле “Город / ЖК”
      window.setTimeout(() => {
        cityInputRef.current?.focus();
        cityInputRef.current?.select();
      }, 450);
    };

    window.addEventListener("geo:city", handler as EventListener);
    return () => window.removeEventListener("geo:city", handler as EventListener);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* ========================= HEADER ========================= */}
      <header className="z-40">
        {/* Верхняя белая полоса */}
        <div className="border-b border-black/10 bg-white">
          <div className="site-container">
            <div className="flex items-center justify-between gap-4 py-3 md:py-4">
              {/* Логотип (кликабельный на главную) */}
              <Link
                href="/"
                aria-label="На главную"
                className="inline-flex items-center rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc400]/60"
              >
                <Image
                  src="/brand/logo-horizontal.png"
                  alt="Контроль качества"
                  width={520}
                  height={140}
                  priority
                  className="h-12 w-auto md:h-16"
                />
              </Link>

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
                      onClick={(e) => {
                        if (s.href === "#") e.preventDefault();
                      }}
                      className="group relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:opacity-90"
                      aria-label={`${s.name} (скоро)`}
                      title={`${s.name} — скоро`}
                    >
                      {s.icon === "tg" && (
                        <svg
                          viewBox="0 0 24 24"
                          className="block h-5 w-5 origin-center transform-gpu scale-[0.90] -translate-x-[2px] translate-y-[1px]"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M9.9 16.6l-.4 4.2c.6 0 .9-.3 1.2-.6l2.8-2.6 5.8 4.2c1.1.6 1.8.3 2.1-1l3.8-17.8c.4-1.6-.6-2.2-1.6-1.8L1.6 9.3c-1.5.6-1.5 1.5-.3 1.9l5.6 1.8 13-8.2c.6-.4 1.2-.2.8.2L9.9 16.6z" />
                        </svg>
                      )}

                      {s.icon === "vk" && (
                        <svg viewBox="0 0 24 24" className="block h-5 w-5" fill="currentColor" aria-hidden="true">
                          <path d="M12.8 17.3h1.2s.4 0 .6-.2c.2-.2.2-.5.2-.5s0-1.6.7-1.8c.7-.2 1.6 1.5 2.5 2.1.7.5 1.3.4 1.3.4l2.6-.1s1.4-.1.7-1.2c-.1-.1-.5-1-2.6-3-.2-.2-.5-.6-.2-1.1.3-.4 2.2-3 2.5-4 .2-.7-.3-.7-.3-.7l-2.9.1s-.4-.1-.7.1c-.3.2-.4.5-.4.5s-.5 1.4-1.2 2.6c-1.5 2.4-2.1 2.5-2.4 2.3-.7-.4-.5-1.6-.5-2.4 0-2.6.4-3.7-.8-4-.4-.1-.7-.2-1.7-.2-1.3 0-2.3 0-2.9.3-.4.2-.7.6-.5.6.3 0 .9.2 1.2.6.4.6.4 1.9.4 1.9s.2 3.1-.4 3.5c-.4.3-.9-.3-2-2.3-.6-1.2-1-2.5-1-2.5s-.1-.3-.4-.5c-.3-.2-.7-.2-.7-.2l-2.7.1s-.4 0-.5.2c-.2.2 0 .6 0 .6s2.1 4.8 4.6 7.2c2.3 2.2 4.9 2 4.9 2z" />
                        </svg>
                      )}

                      {s.icon === "ig" && (
                        <svg viewBox="0 0 24 24" className="block h-5 w-5" fill="currentColor" aria-hidden="true">
                          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2zM17.7 6.1a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
                        </svg>
                      )}

                      <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black px-3 py-1 text-[11px] font-extrabold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                        Скоро
                      </span>
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
        {/* HERO (уплотнён) */}
        <section className="relative bg-white pt-4 md:pt-6">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-28 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[#ffc400]/16 blur-3xl" />
            <div className="absolute -top-32 -left-24 h-105 w-105 rounded-full bg-black/5 blur-3xl" />
            <div className="absolute right-0 top-24 h-130 w-130 rounded-full bg-black/5 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-white via-white to-transparent" />
          </div>

          <div className="site-container relative pb-12 md:pb-16">
            <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_380px] md:items-start">
              <div>
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

                <p className="mt-4 max-w-xl text-base leading-relaxed text-black/70">
                  Проверим качество отделки, инженерные системы и площадь. Составим акт замечаний для застройщика и
                  подскажем, как добиться устранения дефектов.
                </p>

                <div className="mt-7 flex flex-wrap gap-4">
                  <a href="#form" className="btn-primary">
                    Записаться
                  </a>
                  <a href={phoneLink} className="btn-outline">
                    Позвонить
                  </a>
                </div>

                <div className="mt-7 flex flex-wrap gap-x-10 gap-y-3 text-sm text-black/60">
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

              <div className="relative mx-auto w-full max-w-95 md:mt-1">
                <div className="absolute -left-3 top-3 h-[calc(100%-12px)] w-[calc(100%+12px)] rounded-3xl bg-[#ffc400]" />

                <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_22px_70px_rgba(0,0,0,0.14)] ring-1 ring-black/10">
                  <div className="p-4 md:p-5">
                    <div className="mx-auto w-full max-w-85">
                      <div className="relative overflow-hidden rounded-3xl bg-black/5">
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

                  <div className="flex items-center justify-between gap-3 px-5 pb-4">
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

        <div className="h-8 md:h-12" />
        <Advantages />

        <div className="h-8 md:h-12" />
        <Services />

        <div className="h-8 md:h-12" />
        <Process />

        <div className="h-8 md:h-12" />
        <Geo />

        <div className="h-8 md:h-12" />
        <Docs />

        <div className="h-8 md:h-12" />
        <FAQ />

        {/* ========================= FORM (ULTRA) ========================= */}
        <div className="h-8 md:h-12" />
        <section id="form" className="bg-white">
          <div className="site-container py-18 md:py-22">
            <div className="relative overflow-hidden rounded-4xl border border-black/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#ffc400]/14 blur-3xl" />
                <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
              </div>

              <div className="relative grid gap-10 p-8 md:grid-cols-[1.05fr_1fr] md:p-12">
                {/* LEFT */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-extrabold text-white">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#ffc400]" />
                    Заявка
                  </div>

                  <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-5xl">
                    Оставьте заявку — перезвоним и уточним детали
                  </h2>

                  <p className="mt-4 max-w-xl text-black/60">
                    Город, ЖК и удобное время — этого достаточно, чтобы договориться о выезде.
                    <span className="ml-1 text-black/60">Можете выбрать город на карте — он подставится сам.</span>
                  </p>

                  <div className="mt-8 grid max-w-xl gap-3">
                    <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                      <div className="text-xs font-bold text-black/50">Телефон</div>
                      <a href={phoneLink} className="mt-1 inline-flex text-base font-extrabold hover:underline">
                        {phoneDisplay}
                      </a>
                    </div>

                    <a
                      href={`mailto:${email}?subject=${encodeURIComponent("Заявка на приёмку квартиры")}`}
                      className="group block rounded-2xl border border-black/10 bg-black/[0.02] px-5 py-4 transition hover:bg-black/[0.035] focus:outline-none focus:ring-2 focus:ring-[#ffc400]/40"
                      aria-label="Написать на почту"
                    >
                      <div className="text-xs font-bold text-black/45">Почта</div>
                      <div className="mt-1 text-lg font-extrabold tracking-tight text-black underline-offset-4 group-hover:underline">
                        {email}
                      </div>
                    </a>

                    <div className="mt-2 text-sm text-black/50">
                      Обычно отвечаем быстро. Без спама и “продаж по телефону”.
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="relative">
                  {/* статус отправки */}
                  {sentOk ? (
                    <div
                      className={[
                        "mb-4 rounded-2xl border p-4 text-sm",
                        sentOk === "ok"
                          ? "border-black/10 bg-[#ffc400]/12 text-black"
                          : "border-black/10 bg-black/5 text-black",
                      ].join(" ")}
                    >
                      {sentOk === "ok" ? (
                        <span>✅ Заявка отправлена. Если нужно — уточним детали по телефону.</span>
                      ) : (
                        <span>
                          ⚠️ Не получилось отправить. Попробуйте ещё раз или позвоните:{" "}
                          <a className="font-bold hover:underline" href={phoneLink}>
                            {phoneDisplay}
                          </a>
                        </span>
                      )}
                    </div>
                  ) : null}

                  <form
                    className="grid gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!sending) submit();
                    }}
                  >
                    <label className="group/field relative">
                      <span className="mb-2 block text-xs font-bold text-black/60">Ваше имя</span>
                      <input
                        value={form.name}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((s) => ({ ...s, name: v }));
                          if (touched.name) setErrors(validate({ ...form, name: v }));
                        }}
                        onBlur={() => {
                          setTouched((t) => ({ ...t, name: true }));
                          setErrors(validate(form));
                        }}
                        placeholder="Например, Анна"
                        className={softFieldClass("name")}
                      />
                      {touched.name && errors.name ? (
                        <div className="mt-2 text-xs text-black/50">{errors.name}</div>
                      ) : (
                        <div className="mt-2 text-xs text-black/30"> </div>
                      )}
                    </label>

                    <label className="group/field relative">
                      <span className="mb-2 block text-xs font-bold text-black/60">Телефон</span>
                      <input
                        inputMode="tel"
                        value={form.phone}
                        onChange={(e) => {
                          const v = maskPhone(e.target.value);
                          setForm((s) => ({ ...s, phone: v }));
                          if (touched.phone) setErrors(validate({ ...form, phone: v }));
                        }}
                        onBlur={() => {
                          setTouched((t) => ({ ...t, phone: true }));
                          setErrors(validate(form));
                        }}
                        placeholder="+7 (___) ___-__-__"
                        className={softFieldClass("phone")}
                      />
                      {touched.phone && errors.phone ? (
                        <div className="mt-2 text-xs text-black/50">{errors.phone}</div>
                      ) : (
                        <div className="mt-2 text-xs text-black/30"> </div>
                      )}
                    </label>

                    <label className="group/field relative">
                      <span className="mb-2 block text-xs font-bold text-black/60">Город / ЖК</span>
                      <input
                        ref={cityInputRef}
                        value={form.city}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((s) => ({ ...s, city: v }));
                          if (touched.city) setErrors(validate({ ...form, city: v }));
                        }}
                        onBlur={() => {
                          setTouched((t) => ({ ...t, city: true }));
                          setErrors(validate(form));
                        }}
                        placeholder="Севастополь, ЖК …"
                        className={softFieldClass("city")}
                      />
                      {touched.city && errors.city ? (
                        <div className="mt-2 text-xs text-black/50">{errors.city}</div>
                      ) : (
                        <div className="mt-2 text-xs text-black/30"> </div>
                      )}
                    </label>

                    <label className="group/field relative">
                      <span className="mb-2 block text-xs font-bold text-black/60">Комментарий (необязательно)</span>
                      <textarea
                        value={form.comment}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((s) => ({ ...s, comment: v }));
                        }}
                        onBlur={() => setTouched((t) => ({ ...t, comment: true }))}
                        placeholder="Площадь, отделка/без, когда планируете приёмку…"
                        className={[softFieldClass("comment"), "min-h-28 resize-none"].join(" ")}
                      />
                      <div className="mt-2 text-xs text-black/30"> </div>
                    </label>

                    <button
                      type="submit"
                      aria-describedby={formId}
                      disabled={sending}
                      className={[
                        "relative mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4",
                        "bg-[#ffc400] font-extrabold text-black",
                        "transition duration-300",
                        sending ? "opacity-80" : "hover:-translate-y-0.5 active:translate-y-0",
                        "shadow-[0_18px_50px_rgba(255,196,0,0.25)] hover:shadow-[0_22px_70px_rgba(255,196,0,0.35)]",
                        "ring-1 ring-black/10",
                      ].join(" ")}
                    >
                      {sending ? "Отправляем…" : "Отправить"}
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-black/60" />
                      <span className="text-sm font-bold text-black/70">1–2 минуты</span>
                    </button>

                    <div id={formId} className="text-center text-xs text-black/50">
                      Нажимая «Отправить», вы соглашаетесь на{" "}
                      <Link className="underline underline-offset-2 hover:text-black" href="/consent">
                        обработку персональных данных
                      </Link>{" "}
                      и принимаете{" "}
                      <Link className="underline underline-offset-2 hover:text-black" href="/privacy">
                        политику конфиденциальности
                      </Link>
                      .
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-8 md:h-12" />
        <Footer />
        <CookieBanner />
      </main>
    </div>
  );
}