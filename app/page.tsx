"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useId } from "react";

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
  icon: "tg" | "vk";
};

// ===== FORM (CLIENT REQUEST) =====
type FormState = {
  fio: string; // 1) Полное ФИО дольщика
  phone: string;
  address: string; // 2) Город и полный адрес ЖК
  area: string; // 3) Общая площадь
  datetime: string; // 4) Дата и время осмотра
  comment: string; // необязательно
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const maskPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  let d = digits;
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (d.startsWith("9")) d = "7" + d;

  if (!d.length) return "";

  const p = d.startsWith("7") ? d.slice(1) : d;
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

const normalizeArea = (v: string) => {
  const cleaned = v.replace(/[^\d.,]/g, "").replace(",", ".");
  const parts = cleaned.split(".");
  if (parts.length > 2) return parts[0] + "." + parts.slice(1).join("");
  return cleaned;
};

// ===== МОДАЛКА ДЛЯ ВЫБОРА ПОЧТЫ =====
function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

/**
 * ✅ ЛОК СКРОЛЛА БЕЗ ДЁРГАНИЙ
 */
function useLockBodyScroll(open: boolean) {
  const prevRestorationRef = useRef<ScrollRestoration | null>(null);
  const prevHtmlScrollBehaviorRef = useRef<string>("");

  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const html = document.documentElement;

    // запрещаем браузеру “восстанавливать” скролл самому
    prevRestorationRef.current = window.history.scrollRestoration;
    try {
      window.history.scrollRestoration = "manual";
    } catch {}

    // выключаем smooth на время модалки
    prevHtmlScrollBehaviorRef.current = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const y = window.scrollY;

    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };

    const scrollBarWidth = window.innerWidth - html.clientWidth;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      const top = body.style.top || "0";
      const yFromTop = Math.abs(parseInt(top, 10) || 0);

      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.paddingRight = prev.paddingRight;

      window.scrollTo(0, yFromTop);

      html.style.scrollBehavior = prevHtmlScrollBehaviorRef.current || "";
      if (prevRestorationRef.current) {
        try {
          window.history.scrollRestoration = prevRestorationRef.current;
        } catch {}
      }
    };
  }, [open]);
}

function MailModal({
  open,
  onClose,
  mailtoLink,
  webmail,
}: {
  open: boolean;
  onClose: () => void;
  mailtoLink: string;
  webmail: { gmail: string; yandex: string; mailru: string; outlook: string };
}) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useLockBodyScroll(open || closing);

  // mount/unmount с анимацией
  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }
    if (mounted) {
      setClosing(true);
      const t = window.setTimeout(() => {
        setClosing(false);
        setMounted(false);
      }, 180);
      return () => window.clearTimeout(t);
    }
  }, [open, mounted]);

  // ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // фокус на кнопку закрытия
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!mounted) return null;
  const state = open && !closing ? "open" : "closed";

  return (
    <div className="fixed inset-0 z-90" role="dialog" aria-modal="true" data-state={state}>
      {/* фон */}
      <button
        aria-label="Закрыть"
        className={cx(
          "absolute inset-0 cursor-pointer bg-black/50 backdrop-blur-[6px]",
          "transition duration-200",
          "data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
        )}
        onClick={onClose}
      />

      {/* окно */}
      <div className="relative mx-auto mt-8 w-[min(560px,calc(100%-24px))] md:mt-14">
        <div
          className={cx(
            "rounded-3xl border border-black/10 bg-white/92 backdrop-blur-xl",
            "shadow-[0_30px_80px_rgba(0,0,0,0.25)]",
            "transition duration-200 will-change-transform will-change-opacity",
            state === "open" ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-[0.985]"
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-4 md:px-7">
            <div className="min-w-0">
              <div className="text-[12px] uppercase tracking-[0.18em] text-black/45">Отправить письмо</div>
              <h3 className="mt-1 text-lg font-semibold leading-tight md:text-xl">Выберите почту</h3>
              <p className="mt-1 text-sm text-black/55">Если почтовое приложение не настроено — используйте веб-почту.</p>
            </div>

            <button
              ref={closeBtnRef}
              onClick={onClose}
              className={cx(
                "shrink-0 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-sm cursor-pointer",
                "hover:bg-white transition",
                "focus:outline-none focus:ring-2 focus:ring-black/10"
              )}
            >
              Закрыть
            </button>
          </div>

          <div className="px-5 py-5 md:px-7 md:py-6">
            <div className="grid gap-3">
              <a
                href={mailtoLink}
                className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 font-semibold hover:bg-white transition"
              >
                Почтовое приложение (mailto)
                <div className="mt-1 text-xs font-normal text-black/55">Откроется Mail/Outlook, если настроено</div>
              </a>

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={webmail.gmail}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 font-semibold hover:bg-white transition"
                >
                  Gmail
                  <div className="mt-1 text-xs font-normal text-black/55">Откроется в новой вкладке</div>
                </a>

                <a
                  href={webmail.yandex}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 font-semibold hover:bg-white transition"
                >
                  Яндекс.Почта
                  <div className="mt-1 text-xs font-normal text-black/55">Откроется в новой вкладке</div>
                </a>

                <a
                  href={webmail.mailru}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 font-semibold hover:bg-white transition"
                >
                  Mail.ru
                  <div className="mt-1 text-xs font-normal text-black/55">Откроется в новой вкладке</div>
                </a>

                <a
                  href={webmail.outlook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 font-semibold hover:bg-white transition"
                >
                  Outlook
                  <div className="mt-1 text-xs font-normal text-black/55">Откроется в новой вкладке</div>
                </a>
              </div>

              <div className="mt-2 text-xs text-black/45">Подсказка: письмо уже заполнено данными из формы — останется только отправить.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** ✅ Лейбл с пометкой обязательности (не ломает верстку) */
function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="mb-2 block text-xs font-bold text-black/60">
      {children}
      {required ? (
        <span className="ml-1 font-extrabold text-black/60" title="Обязательное поле">
          (обязательно)
        </span>
      ) : null}
    </span>
  );
}

export default function Home() {
  const phoneDisplay = "+7 (978) 704-33-16";
  const phoneLink = "tel:+79787043316";
  const email = "i@snegoda.ru";

  const socials: Social[] = useMemo(
    () => [
      { name: "Telegram", href: "https://t.me/kontrolkachestvacrimea", icon: "tg" },
      { name: "VK", href: "https://vk.com/kontrolkachestvacrimea", icon: "vk" },
    ],
    []
  );

  const [mobileMenu, setMobileMenu] = useState(false);

  // ===== FORM STATE =====
  const [form, setForm] = useState<FormState>({
    fio: "",
    phone: "",
    address: "",
    area: "",
    datetime: "",
    comment: "",
  });

  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState<null | "ok" | "err">(null);

  // ✅ модалка выбора почты
  const [mailModalOpen, setMailModalOpen] = useState(false);

  const formId = useId();
  const addressInputRef = useRef<HTMLInputElement | null>(null);

  // ===== ПИСЬМО (тема/тело) =====
  const mailSubject = useMemo(() => "Заявка на приёмку квартиры", []);

  const mailBody = useMemo(() => {
    const bodyLines = [
      "Здравствуйте! Хочу записаться на приёмку квартиры.",
      "",
      `ФИО: ${form.fio.trim() || "-"}`,
      `Телефон: ${form.phone.trim() || "-"}`,
      `Город и адрес ЖК: ${form.address.trim() || "-"}`,
      `Площадь (м²): ${form.area.trim() || "-"}`,
      `Дата и время осмотра: ${form.datetime.trim() || "-"}`,
      `Комментарий: ${form.comment.trim() || "-"}`,
      "",
      `Страница: ${typeof window !== "undefined" ? window.location.href : ""}`,
    ];
    return bodyLines.join("\n");
  }, [form]);

  // ===== MAILTO (автоподстановка данных из формы) =====
  const mailtoLink = useMemo(() => {
    return `mailto:${email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  }, [email, mailSubject, mailBody]);

  // ===== ВЕБ-ПОЧТЫ (работают всегда) =====
  const webmail = useMemo(() => {
    const to = encodeURIComponent(email);
    const su = encodeURIComponent(mailSubject);
    const body = encodeURIComponent(mailBody);

    return {
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}`,
      yandex: `https://mail.yandex.ru/compose?to=${to}&subject=${su}&body=${body}`,
      mailru: `https://e.mail.ru/compose/?to=${to}&subject=${su}&body=${body}`,
      outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}&body=${body}`,
    };
  }, [email, mailSubject, mailBody]);

  const validate = (s: FormState): FormErrors => {
    const e: FormErrors = {};

    if (!s.fio.trim()) e.fio = "Укажите ФИО (как в договоре).";

    const digits = phoneDigitsCount(s.phone);
    if (digits > 0 && digits < 11) e.phone = "Телефон выглядит неполным.";
    if (digits === 0) e.phone = "Нужен номер телефона для связи.";

    if (!s.address.trim()) e.address = "Укажите город и адрес ЖК.";

    const areaNum = Number(String(s.area).replace(",", "."));
    if (!s.area.trim()) e.area = "Укажите площадь (например, 75.5).";
    else if (Number.isNaN(areaNum) || areaNum <= 0) e.area = "Площадь должна быть числом больше 0.";

    if (!s.datetime.trim()) e.datetime = "Выберите дату и время осмотра.";

    return e;
  };

  const softFieldClass = (field: keyof FormState) => {
    const hasErr = !!errors[field] && !!touched[field];
    const hasValue = String(form[field] ?? "").trim().length > 0;

    return [
      "w-full rounded-2xl border bg-white px-4 py-4 text-base text-black outline-none",
      "transition duration-300",
      "shadow-[0_10px_30px_rgba(0,0,0,0.04)]",
      hasErr
        ? "border-black/15 shadow-[0_0_0_6px_rgba(0,0,0,0.04)]"
        : "border-black/10 hover:border-black/15 focus:border-black/20 focus:shadow-[0_0_0_7px_rgba(255,196,0,0.22)]",
      hasValue && !hasErr ? "ring-1 ring-black/5" : "",
    ].join(" ");
  };

  // ✅ submit теперь принимает fallbackMailto (чтобы заявка не потерялась)
  const submit = async (fallbackMailto: string) => {
    setSentOk(null);

    const nextErrors = validate(form);
    setErrors(nextErrors);
    setTouched({ fio: true, phone: true, address: true, area: true, datetime: true, comment: true });

    if (Object.keys(nextErrors).length) return;

    try {
      setSending(true);

      const payload = {
        fio: form.fio.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        area: form.area.trim(),
        datetime: form.datetime.trim(),
        comment: form.comment.trim(),
        // на всякий случай под старый API:
        name: form.fio.trim(),
        city: form.address.trim(),
        page: typeof window !== "undefined" ? window.location.href : "",
        summary:
          `ФИО: ${form.fio.trim()}\n` +
          `Адрес/ЖК: ${form.address.trim()}\n` +
          `Площадь: ${form.area.trim()} м²\n` +
          `Дата/время: ${form.datetime.trim()}\n` +
          (form.comment.trim() ? `Комментарий: ${form.comment.trim()}` : ""),
      };

      const res = await fetch("/send.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("bad_response");
      setSentOk("ok");

      setForm((s) => ({
        ...s,
        fio: "",
        phone: "",
        area: "",
        datetime: "",
        comment: "",
        // address оставим (удобно для повторных заявок)
      }));
      setTouched({});
      setErrors({});
    } catch {
      setSentOk("err");

      // ✅ если API не отправилось — откроем модалку выбора почты
      if (typeof window !== "undefined") {
        // пробуем mailto (вдруг настроено)
        window.location.href = fallbackMailto;

        // и сразу даём “план Б” — модалку с веб-почтами
        setMailModalOpen(true);
      }
    } finally {
      setSending(false);
    }
  };

  // ===== AUTO-FILL FROM GEO =====
  useEffect(() => {
    const handler = (evt: Event) => {
      const e = evt as CustomEvent<{ city?: string }>;
      const city = e.detail?.city?.trim();
      if (!city) return;

      setForm((s) => {
        const hasAlready = s.address.trim().length > 0;
        const next = hasAlready ? s.address : `${city}, `;
        return { ...s, address: next };
      });

      setTouched((t) => ({ ...t, address: true }));
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.address;
        return copy;
      });

      const el = document.getElementById("form");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });

      window.setTimeout(() => {
        addressInputRef.current?.focus();
        const len = addressInputRef.current?.value?.length ?? 0;
        addressInputRef.current?.setSelectionRange(len, len);
      }, 450);
    };

    window.addEventListener("geo:city", handler as EventListener);
    return () => window.removeEventListener("geo:city", handler as EventListener);
  }, []);

  // ===== CHECKLIST (слева) =====
  const checklist = useMemo(
    () => [
      {
        n: "01",
        title: "Полное ФИО дольщика",
        hint: "Например: Иванов Иван Иванович",
        done: form.fio.trim().length > 2,
      },
      {
        n: "02",
        title: "Город и адрес ЖК",
        hint: "Например: Евпатория, ЖК «Мойнаки», ул. …",
        done: form.address.trim().length > 6,
      },
      {
        n: "03",
        title: "Общая площадь",
        hint: "Например: 75.5 м²",
        done: form.area.trim().length > 0 && !errors.area,
      },
      {
        n: "04",
        title: "Дата и время осмотра",
        hint: "Например: 20.10.2025 12:00",
        done: form.datetime.trim().length > 0,
      },
    ],
    [form.fio, form.address, form.area, form.datetime, errors.area]
  );

  return (
    <div className="min-h-screen bg-white text-black">
      {/* ✅ МОДАЛКА ВЫБОРА ПОЧТЫ */}
      <MailModal open={mailModalOpen} onClose={() => setMailModalOpen(false)} mailtoLink={mailtoLink} webmail={webmail} />

      {/* ========================= HEADER ========================= */}
      <header className="z-40">
        {/* top white */}
        <div className="border-b border-black/10 bg-white">
          <div className="site-container">
            <div className="flex items-center justify-between gap-4 py-3 md:py-4">
              <Link
                href="/"
                aria-label="На главную"
                className="inline-flex items-center rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc400]/60"
              >
                <Image src="/brand/logo-horizontal.png" alt="Контроль качества" width={520} height={140} priority className="h-12 w-auto md:h-16" />
              </Link>

              {/* desktop */}
              <div className="hidden items-center justify-end gap-5 md:flex">
                <a href={phoneLink} className="whitespace-nowrap text-lg font-extrabold tracking-tight text-black hover:underline">
                  {phoneDisplay}
                </a>

                <div className="flex items-center gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:opacity-90"
                      aria-label={s.name}
                      title={s.name}
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
                    </a>
                  ))}
                </div>
              </div>

              {/* mobile */}
              <div className="flex items-center justify-end gap-3 md:hidden">
                <a href={phoneLink} className="btn-outline px-4 py-3 text-sm">
                  Позвонить
                </a>
                <button type="button" onClick={() => setMobileMenu(true)} className="btn-outline px-4 py-3" aria-label="Открыть меню">
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* sticky black nav */}
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

        {/* mobile drawer */}
        {mobileMenu ? (
          <div className="md:hidden">
            <button type="button" className="fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenu(false)} aria-label="Закрыть меню" />
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

                {/* мобильные соцсети тоже кликабельные */}
                <div className="mt-5 flex items-center gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition hover:opacity-90"
                      aria-label={s.name}
                      title={s.name}
                    >
                      {s.icon === "tg" ? (
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                          <path d="M9.9 16.6l-.4 4.2c.6 0 .9-.3 1.2-.6l2.8-2.6 5.8 4.2c1.1.6 1.8.3 2.1-1l3.8-17.8c.4-1.6-.6-2.2-1.6-1.8L1.6 9.3c-1.5.6-1.5 1.5-.3 1.9l5.6 1.8 13-8.2c.6-.4 1.2-.2.8.2L9.9 16.6z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                          <path d="M12.8 17.3h1.2s.4 0 .6-.2c.2-.2.2-.5.2-.5s0-1.6.7-1.8c.7-.2 1.6 1.5 2.5 2.1.7.5 1.3.4 1.3.4l2.6-.1s1.4-.1.7-1.2c-.1-.1-.5-1-2.6-3-.2-.2-.5-.6-.2-1.1.3-.4 2.2-3 2.5-4 .2-.7-.3-.7-.3-.7l-2.9.1s-.4-.1-.7.1c-.3.2-.4.5-.4.5s-.5 1.4-1.2 2.6c-1.5 2.4-2.1 2.5-2.4 2.3-.7-.4-.5-1.6-.5-2.4 0-2.6.4-3.7-.8-4-.4-.1-.7-.2-1.7-.2-1.3 0-2.3 0-2.9.3-.4.2-.7.6-.5.6.3 0 .9.2 1.2.6.4.6.4 1.9.4 1.9s.2 3.1-.4 3.5c-.4.3-.9-.3-2-2.3-.6-1.2-1-2.5-1-2.5s-.1-.3-.4-.5c-.3-.2-.7-.2-.7-.2l-2.7.1s-.4 0-.5.2c-.2.2 0 .6 0 .6s2.1 4.8 4.6 7.2c2.3 2.2 4.9 2 4.9 2z" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {/* ========================= CONTENT ========================= */}
      <main>
        {/* HERO */}
        <section className="relative bg-white pt-4 md:pt-6">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/2 h-[560px] w-[920px] -translate-x-1/2 rounded-full bg-[#ffc400]/18 blur-[90px]" />
            <div className="absolute -top-28 -left-24 h-[420px] w-[420px] rounded-full bg-black/6 blur-[80px]" />
            <div className="absolute -bottom-48 right-[-140px] h-[520px] w-[520px] rounded-full bg-black/8 blur-[90px]" />
            <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white via-white to-transparent" />
            <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22 x=%220%22 y=%220%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')]" />
          </div>

          <div className="site-container relative pb-12 md:pb-16">
            <div className="grid items-stretch gap-8 md:grid-cols-[minmax(0,1fr)_380px] md:gap-10">
              {/* LEFT */}
              <div className="flex flex-col justify-between rounded-4xl border border-black/10 bg-white/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-8 transition duration-300 hover:shadow-[0_28px_90px_rgba(255,196,0,0.18)]">
                <div>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-bold text-white">Работаем по всему Крыму</span>
                    <span className="inline-flex rounded-full bg-[#ffc400] px-4 py-2 text-xs font-bold text-black shadow-[0_14px_45px_rgba(255,196,0,0.22)]">
                      Акт замечаний для застройщика
                    </span>
                  </div>

                  <h1 className="mt-5 text-[36px] font-extrabold leading-[1.02] tracking-tight md:text-[56px]">
                    Профессиональная{" "}
                    <span className="relative inline-block">
                      <span className="text-[#ffc400]">приёмка</span>
                      <span className="absolute -bottom-1 left-0 h-[6px] w-full rounded-full bg-[#ffc400]/40 blur-[0.2px]" />
                    </span>{" "}
                    квартир в новостройках
                  </h1>

                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-black/65 md:text-base">
                    Проверим качество отделки, инженерные системы и площадь. Составим акт замечаний и подскажем, как добиться устранения дефектов.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <a href="#form" className="btn-primary transition hover:-translate-y-0.5 active:translate-y-0">
                      Записаться
                    </a>
                    <a href={phoneLink} className="btn-outline transition hover:-translate-y-0.5 active:translate-y-0">
                      Позвонить
                    </a>
                    <a href="#services" className="btn-outline transition hover:-translate-y-0.5 active:translate-y-0">
                      Услуги
                    </a>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {[
                      { top: "2–3 часа", bottom: "осмотр" },
                      { top: "50+ пунктов", bottom: "проверки" },
                      { top: "Фото/видео", bottom: "фиксация" },
                    ].map((x) => (
                      <div
                        key={x.top}
                        className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
                      >
                        <div className="font-extrabold text-black">{x.top}</div>
                        <div className="text-black/55">{x.bottom}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4">
                  <div className="text-xs text-black/55">{email}</div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[12px] font-bold text-black/70">
                    Выезд в день обращения
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-black/60" />
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="relative mx-auto w-full max-w-95 md:mt-0">
                <div className="pointer-events-none absolute -left-2 top-2 h-[calc(100%-8px)] w-[calc(100%+8px)] rounded-4xl bg-[linear-gradient(180deg,rgba(255,196,0,0.95),rgba(255,196,0,0.55))] shadow-[0_22px_70px_rgba(255,196,0,0.25)]" />
                <div className="pointer-events-none absolute -left-3 top-3 h-[calc(100%-12px)] w-[calc(100%+12px)] rounded-4xl bg-[#ffc400]/25 blur-[12px]" />

                <div className="group relative overflow-hidden rounded-4xl bg-white shadow-[0_26px_80px_rgba(0,0,0,0.16)] ring-1 ring-black/10 transition hover:-translate-y-1 hover:shadow-[0_34px_100px_rgba(0,0,0,0.22)]">
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                    <div className="absolute -left-28 top-0 h-full w-44 rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.65),transparent)] blur-[0.6px]" />
                  </div>

                  <div className="pointer-events-none absolute inset-0 rounded-4xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]" />

                  <div className="p-4 md:p-5">
                    <div className="mx-auto w-full max-w-85">
                      <div className="relative overflow-hidden rounded-4xl bg-black/5">
                        <Image
                          src="/brand/sergey.jpg"
                          alt="Негода Сергей Владимирович"
                          width={340}
                          height={420}
                          priority
                          className="h-auto w-full object-contain"
                          style={{ height: "auto" }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.16),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(0,0,0,0.08),transparent_55%)]" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 px-5 pb-4">
                    <div className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-bold text-white shadow-[0_14px_45px_rgba(0,0,0,0.20)]">
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

        {/* ========================= FORM (NEW) ========================= */}
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

                  <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-5xl">Запись на приёмку и расчёт стоимости</h2>

                  <p className="mt-4 max-w-xl text-black/60">Чтобы оперативно записать вас и точно рассчитать стоимость, заполните 4 пункта ниже.</p>

                  {/* чек-лист */}
                  <div className="mt-7 grid max-w-xl gap-3">
                    {checklist.map((c) => (
                      <div
                        key={c.n}
                        className={[
                          "group relative overflow-hidden rounded-3xl border bg-white/70 px-5 py-4 backdrop-blur-xl",
                          "transition duration-300",
                          c.done ? "border-black/10 shadow-[0_14px_45px_rgba(255,196,0,0.16)]" : "border-black/10 shadow-[0_12px_40px_rgba(0,0,0,0.05)]",
                        ].join(" ")}
                      >
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                          <div className="absolute inset-x-0 bottom-0 h-10 bg-[radial-gradient(ellipse_at_bottom,rgba(255,196,0,0.22),transparent_70%)]" />
                        </div>

                        <div className="relative flex items-start gap-3">
                          <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-black text-xs font-extrabold text-white">
                            {c.n}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-extrabold text-black">{c.title}</div>
                              <span
                                className={[
                                  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-extrabold",
                                  c.done ? "bg-[#ffc400]/25 text-black" : "bg-black/5 text-black/55",
                                ].join(" ")}
                              >
                                {c.done ? "готово" : "нужно"}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-black/55">{c.hint}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid max-w-xl gap-3">
                    <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                      <div className="text-xs font-bold text-black/50">Телефон</div>
                      <a href={phoneLink} className="mt-1 inline-flex text-base font-extrabold hover:underline">
                        {phoneDisplay}
                      </a>
                    </div>

                    {/* ✅ ПОЧТА */}
                    <a
                      href={mailtoLink}
                      className="group block rounded-2xl border border-black/10 bg-black/[0.02] px-5 py-4 transition hover:bg-black/[0.035] focus:outline-none focus:ring-2 focus:ring-[#ffc400]/40"
                      aria-label="Написать на почту"
                    >
                      <div className="text-xs font-bold text-black/45">Почта</div>
                      <div className="mt-1 text-lg font-extrabold tracking-tight text-black underline-offset-4 group-hover:underline">{email}</div>
                      <div className="mt-2 text-xs text-black/55">
                        Если не открылось —{" "}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setMailModalOpen(true);
                          }}
                          className="font-bold underline underline-offset-2 hover:text-black cursor-pointer"
                        >
                          выберите почту
                        </button>
                      </div>
                    </a>

                    <div className="mt-2 text-sm text-black/50">Без спама. Данные только для записи и расчёта.</div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="relative">
                  {sentOk ? (
                    <div
                      className={[
                        "mb-4 rounded-2xl border p-4 text-sm",
                        sentOk === "ok" ? "border-black/10 bg-[#ffc400]/12 text-black" : "border-black/10 bg-black/5 text-black",
                      ].join(" ")}
                    >
                      {sentOk === "ok" ? (
                        <span>✅ Заявка отправлена. Мы перезвоним и уточним детали.</span>
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
                      if (!sending) submit(mailtoLink);
                    }}
                  >
                    <label className="group/field relative">
                      <FieldLabel required>Полное ФИО дольщика</FieldLabel>
                      <input
                        required
                        value={form.fio}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((s) => ({ ...s, fio: v }));
                          if (touched.fio) setErrors(validate({ ...form, fio: v }));
                        }}
                        onBlur={() => {
                          setTouched((t) => ({ ...t, fio: true }));
                          setErrors(validate(form));
                        }}
                        placeholder="Например: Иванов Иван Иванович"
                        className={softFieldClass("fio")}
                      />
                      {touched.fio && errors.fio ? <div className="mt-2 text-xs text-black/50">{errors.fio}</div> : <div className="mt-2 text-xs text-black/30"> </div>}
                    </label>

                    <label className="group/field relative">
                      <FieldLabel required>Телефон</FieldLabel>
                      <input
                        required
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
                      {touched.phone && errors.phone ? <div className="mt-2 text-xs text-black/50">{errors.phone}</div> : <div className="mt-2 text-xs text-black/30"> </div>}
                    </label>

                    <label className="group/field relative">
                      <FieldLabel required>Город и полный адрес ЖК</FieldLabel>
                      <input
                        required
                        ref={addressInputRef}
                        value={form.address}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((s) => ({ ...s, address: v }));
                          if (touched.address) setErrors(validate({ ...form, address: v }));
                        }}
                        onBlur={() => {
                          setTouched((t) => ({ ...t, address: true }));
                          setErrors(validate(form));
                        }}
                        placeholder='Например: Евпатория, ЖК "Мойнаки", ул. 50 лет СССР, дом 20, кв.35'
                        className={softFieldClass("address")}
                      />
                      {touched.address && errors.address ? <div className="mt-2 text-xs text-black/50">{errors.address}</div> : <div className="mt-2 text-xs text-black/30"> </div>}
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="group/field relative">
                        <FieldLabel required>Общая площадь (м²)</FieldLabel>
                        <input
                          required
                          inputMode="decimal"
                          value={form.area}
                          onChange={(e) => {
                            const v = normalizeArea(e.target.value);
                            setForm((s) => ({ ...s, area: v }));
                            if (touched.area) setErrors(validate({ ...form, area: v }));
                          }}
                          onBlur={() => {
                            setTouched((t) => ({ ...t, area: true }));
                            setErrors(validate(form));
                          }}
                          placeholder="Например: 75.5"
                          className={softFieldClass("area")}
                        />
                        {touched.area && errors.area ? <div className="mt-2 text-xs text-black/50">{errors.area}</div> : <div className="mt-2 text-xs text-black/30"> </div>}
                      </label>

                      <label className="group/field relative">
                        <FieldLabel required>Дата и время осмотра</FieldLabel>
                        <input
                          required
                          type="datetime-local"
                          value={form.datetime}
                          onChange={(e) => {
                            const v = e.target.value;
                            setForm((s) => ({ ...s, datetime: v }));
                            if (touched.datetime) setErrors(validate({ ...form, datetime: v }));
                          }}
                          onBlur={() => {
                            setTouched((t) => ({ ...t, datetime: true }));
                            setErrors(validate(form));
                          }}
                          className={softFieldClass("datetime")}
                        />
                        {touched.datetime && errors.datetime ? <div className="mt-2 text-xs text-black/50">{errors.datetime}</div> : <div className="mt-2 text-xs text-black/30"> </div>}
                      </label>
                    </div>

                    <label className="group/field relative">
                      <FieldLabel>Комментарий (необязательно)</FieldLabel>
                      <textarea
                        value={form.comment}
                        onChange={(e) => setForm((s) => ({ ...s, comment: e.target.value }))}
                        onBlur={() => setTouched((t) => ({ ...t, comment: true }))}
                        placeholder="Отделка/без, этаж, пожелания…"
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
                      {sending ? "Отправляем…" : "Отправить заявку"}
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-black/60" />
                      <span className="text-sm font-bold text-black/70">быстро</span>
                    </button>

                    {/* ✅ ОДНА ссылка вместо 5 — открывает модалку */}
                    <div className="text-center text-xs text-black/55">
                      Не открывается?{" "}
                      <button type="button" onClick={() => setMailModalOpen(true)} className="font-bold underline underline-offset-2 hover:text-black cursor-pointer">
                        Отправить письмом
                      </button>
                    </div>

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