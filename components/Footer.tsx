"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type Social = {
  name: string;
  href: string;
  icon: "tg" | "vk";
};

// ✅ Иконка соцсети (только TG/VK, Instagram убран полностью)
function SocialIcon({ icon }: { icon: Social["icon"] }) {
  const cls = "h-5 w-5";

  if (icon === "tg") {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden="true">
        <path d="M9.9 16.6l-.4 4.2c.6 0 .9-.3 1.2-.6l2.8-2.6 5.8 4.2c1.1.6 1.8.3 2.1-1l3.8-17.8c.4-1.6-.6-2.2-1.6-1.8L1.6 9.3c-1.5.6-1.5 1.5-.3 1.9l5.6 1.8 13-8.2c.6-.4 1.2-.2.8.2L9.9 16.6z" />
      </svg>
    );
  }

  // icon === "vk"
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden="true">
      <path d="M12.8 17.3h1.2s.4 0 .6-.2c.2-.2.2-.5.2-.5s0-1.6.7-1.8c.7-.2 1.6 1.5 2.5 2.1.7.5 1.3.4 1.3.4l2.6-.1s1.4-.1.7-1.2c-.1-.1-.5-1-2.6-3-.2-.2-.5-.6-.2-1.1.3-.4 2.2-3 2.5-4 .2-.7-.3-.7-.3-.7l-2.9.1s-.4-.1-.7.1c-.3.2-.4.5-.4.5s-.5 1.4-1.2 2.6c-1.5 2.4-2.1 2.5-2.4 2.3-.7-.4-.5-1.6-.5-2.4 0-2.6.4-3.7-.8-4-.4-.1-.7-.2-1.7-.2-1.3 0-2.3 0-2.9.3-.4.2-.7.6-.5.6.3 0 .9.2 1.2.6.4.6.4 1.9.4 1.9s.2 3.1-.4 3.5c-.4.3-.9-.3-2-2.3-.6-1.2-1-2.5-1-2.5s-.1-.3-.4-.5c-.3-.2-.7-.2-.7-.2l-2.7.1s-.4 0-.5.2c-.2.2 0 .6 0 .6s2.1 4.8 4.6 7.2c2.3 2.2 4.9 2 4.9 2z" />
    </svg>
  );
}

export default function Footer() {
  const phoneDisplay = "+7 (978) 704-33-16";
  const phoneLink = "tel:+79787043316";
  const email = "i@snegoda.ru";

  // ✅ Соцсети (реальные ссылки) — только TG/VK
  const socials: Social[] = useMemo(
    () => [
      { name: "Telegram", href: "https://t.me/kontrolkachestvacrimea", icon: "tg" },
      { name: "VK", href: "https://vk.com/kontrolkachestvacrimea", icon: "vk" },
    ],
    []
  );

  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* premium background */}
      <div className="pointer-events-none absolute inset-0">
        {/* soft light */}
        <div className="absolute -top-56 left-1/2 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
        {/* gold haze */}
        <div className="absolute -bottom-72 -left-72 h-[820px] w-[820px] rounded-full bg-[#ffc400]/14 blur-3xl" />
        {/* subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_420px_at_50%_0%,rgba(255,255,255,0.08),rgba(0,0,0,0)_65%)]" />
      </div>

      <div className="relative border-t border-white/10">
        <div className="site-container py-14 md:py-16">
          {/* TOP glass card */}
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-7 shadow-[0_30px_110px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-9">
            {/* inner shine */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.10),rgba(255,255,255,0)_38%,rgba(255,196,0,0.10))]" />
            <div className="pointer-events-none absolute -top-24 right-10 h-56 w-56 rounded-full bg-[#ffc400]/10 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-12 lg:items-start">
              {/* Brand */}
              <div className="lg:col-span-5">
                <div className="flex items-start gap-5">
                  <div className="relative shrink-0">
                    <div className="absolute -inset-2 rounded-3xl bg-[#ffc400]/10 blur-xl" />
                    <Image
                      src="/brand/logo.png"
                      alt="Контроль качества"
                      width={128}
                      height={128}
                      priority
                      className="relative h-[96px] w-[96px] rounded-2xl ring-1 ring-white/10 md:h-[110px] md:w-[110px]"
                      sizes="110px"
                    />
                  </div>

                  <div className="pt-1">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ffc400]" />
                      Приёмка квартир • Крым
                    </div>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                      Профессиональная приёмка квартир в новостройках: проверки, фиксация дефектов, акт замечаний и
                      консультации до получения ключей.
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      {socials.map((s) => (
                        <a
                          key={s.name}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.name}
                          title={s.name}
                          className={[
                            "group inline-flex h-11 w-11 items-center justify-center rounded-full",
                            "bg-white/5 ring-1 ring-white/12",
                            "transition will-change-transform hover:-translate-y-0.5 hover:bg-white/10",
                            "hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
                          ].join(" ")}
                        >
                          <span className="text-white/80 transition group-hover:text-white">
                            <SocialIcon icon={s.icon} />
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="lg:col-span-4">
                <div className="text-sm font-extrabold text-white">Разделы</div>
                <div className="mt-5 grid gap-2 text-sm text-white/70">
                  {[
                    ["Услуги", "#services"],
                    ["Как работаем", "#process"],
                    ["Документы", "#docs"],
                    ["География", "#geo"],
                    ["Оставить заявку", "#form"],
                  ].map(([t, href]) => (
                    <a key={href} href={href} className="group inline-flex items-center gap-2 transition hover:text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20 transition group-hover:bg-[#ffc400]/80" />
                      {t}
                    </a>
                  ))}
                </div>
              </div>

              {/* Contacts */}
              <div className="lg:col-span-3">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5 ring-1 ring-white/10 backdrop-blur-md">
                  <div className="text-sm font-extrabold text-white">Контакты</div>

                  <div className="mt-4 space-y-2 text-sm text-white/70">
                    <div>
                      Телефон:{" "}
                      <a className="font-extrabold text-white hover:opacity-85" href={phoneLink}>
                        {phoneDisplay}
                      </a>
                    </div>
                    <div>
                      Почта:{" "}
                      <a className="font-semibold hover:text-white" href={`mailto:${email}`}>
                        {email}
                      </a>
                    </div>
                  </div>

                  <div className="mt-5">
                    <a href="#form" className="btn-primary w-full text-center">
                      Оставить заявку
                    </a>

                    <div className="mt-3 text-[11px] leading-relaxed text-white/50">
                      Ответим в течение дня. Без спама и рассылок.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
            <div className="text-xs text-white/55">
              © {new Date().getFullYear()} Контроль Качества. Все права защищены.
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/55">
              <Link className="transition hover:text-white/85" href="/privacy/">
                Политика
              </Link>
              <span className="text-white/25">•</span>
              <Link className="transition hover:text-white/85" href="/consent/">
                Согласие ПДн
              </Link>
              <span className="text-white/25">•</span>
              <Link className="transition hover:text-white/85" href="/cookies/">
                Cookies
              </Link>
              <span className="text-white/25">•</span>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("kq:open_cookies_settings"))}
                className="transition hover:text-white/85"
              >
                Настроить cookies
              </button>
            </div>
          </div>

          <div className="mt-3 text-[11px] leading-relaxed text-white/45">
            Отправляя форму, вы соглашаетесь с{" "}
            <Link className="underline underline-offset-2 hover:text-white/70" href="/consent/">
              обработкой персональных данных
            </Link>{" "}
            и{" "}
            <Link className="underline underline-offset-2 hover:text-white/70" href="/privacy/">
              политикой конфиденциальности
            </Link>
            .
          </div>
        </div>
      </div>
    </footer>
  );
}