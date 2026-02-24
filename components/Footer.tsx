"use client";

import Image from "next/image";
import Link from "next/link";

type Social = {
  name: string;
  href: string;
  icon: "tg" | "vk" | "ig";
};

const socials: Social[] = [
  { name: "Telegram", href: "#", icon: "tg" },
  { name: "VK", href: "#", icon: "vk" },
  { name: "Instagram", href: "#", icon: "ig" },
];

function SocialIcon({ icon }: { icon: Social["icon"] }) {
  if (icon === "tg") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M9.9 16.6l-.4 4.2c.6 0 .9-.3 1.2-.6l2.8-2.6 5.8 4.2c1.1.6 1.8.3 2.1-1l3.8-17.8c.4-1.6-.6-2.2-1.6-1.8L1.6 9.3c-1.5.6-1.5 1.5-.3 1.9l5.6 1.8 13-8.2c.6-.4 1.2-.2.8.2L9.9 16.6z" />
      </svg>
    );
  }
  if (icon === "vk") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M12.8 17.3h1.2s.4 0 .6-.2c.2-.2.2-.5.2-.5s0-1.6.7-1.8c.7-.2 1.6 1.5 2.5 2.1.7.5 1.3.4 1.3.4l2.6-.1s1.4-.1.7-1.2c-.1-.1-.5-1-2.6-3-.2-.2-.5-.6-.2-1.1.3-.4 2.2-3 2.5-4 .2-.7-.3-.7-.3-.7l-2.9.1s-.4-.1-.7.1c-.3.2-.4.5-.4.5s-.5 1.4-1.2 2.6c-1.5 2.4-2.1 2.5-2.4 2.3-.7-.4-.5-1.6-.5-2.4 0-2.6.4-3.7-.8-4-.4-.1-.7-.2-1.7-.2-1.3 0-2.3 0-2.9.3-.4.2-.7.6-.5.6.3 0 .9.2 1.2.6.4.6.4 1.9.4 1.9s.2 3.1-.4 3.5c-.4.3-.9-.3-2-2.3-.6-1.2-1-2.5-1-2.5s-.1-.3-.4-.5c-.3-.2-.7-.2-.7-.2l-2.7.1s-.4 0-.5.2c-.2.2 0 .6 0 .6s2.1 4.8 4.6 7.2c2.3 2.2 4.9 2 4.9 2z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2zM17.7 6.1a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
    </svg>
  );
}

export default function Footer() {
  const phoneDisplay = "+7 (978) 704-33-16";
  const phoneLink = "tel:+79787043316";
  const email = "i@snegoda.ru";

  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* мягкий фон, но аккуратно */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-56 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute -bottom-80 -left-72 h-[720px] w-[720px] rounded-full bg-[#ffc400]/10 blur-3xl" />
      </div>

      <div className="relative border-t border-white/10">
        <div className="site-container py-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            {/* LEFT */}
            <div className="lg:col-span-5">
              {/* логотип — нормальный размер (не плакат) */}
              <div className="flex items-start gap-5">
                <div className="relative shrink-0">
                  <Image
                    src="/brand/logo.png"
                    alt="Контроль качества"
                    width={220}
                    height={220}
                    quality={100}
                    unoptimized
                    className="h-[96px] w-[96px] md:h-[110px] md:w-[110px]"
                  />
                </div>

                <div className="pt-1">
                  <div className="text-sm text-white/65">Приёмка квартир • Крым</div>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                    Профессиональная приёмка квартир в новостройках. Проверка, фиксация, акт замечаний.
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    {socials.map((s) => (
                      <a
                        key={s.name}
                        href={s.href}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white ring-1 ring-white/12 transition hover:bg-white/10"
                        aria-label={s.name}
                        title={s.name}
                      >
                        <SocialIcon icon={s.icon} />
                      </a>
                    ))}
                    <span className="text-lg font-black text-white/35">*</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER */}
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
                  <a key={href} href={href} className="hover:text-white transition">
                    {t}
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
                <div className="text-sm font-extrabold text-white">Контакты</div>

                <div className="mt-4 space-y-2 text-sm text-white/70">
                  <div>
                    Телефон:{" "}
                    <a className="font-extrabold text-white hover:opacity-80" href={phoneLink}>
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
                </div>
              </div>
            </div>
          </div>

          {/* bottom */}
          <div className="mt-12 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-3 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
              <div>© {new Date().getFullYear()} Контроль Качества. Все права защищены.</div>

              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <Link className="hover:text-white/80" href="/privacy">
                  Политика конфиденциальности
                </Link>
                <Link className="hover:text-white/80" href="/consent">
                  Согласие на обработку ПДн
                </Link>
                <Link className="hover:text-white/80" href="/cookies">
                  Cookies
                </Link>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event("kq:open_cookies_settings"))}
                  className="hover:text-white/80"
                >
                  Настроить cookies
                </button>
              </div>
            </div>

            <div className="mt-3 text-[11px] leading-relaxed text-white/45">
              Отправляя форму на сайте, вы соглашаетесь с{" "}
              <Link className="underline underline-offset-2 hover:text-white/70" href="/consent">
                обработкой персональных данных
              </Link>{" "}
              и{" "}
              <Link className="underline underline-offset-2 hover:text-white/70" href="/privacy">
                политикой конфиденциальности
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}