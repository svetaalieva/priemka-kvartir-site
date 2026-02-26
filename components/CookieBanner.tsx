"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ConsentLevel = "rejected" | "essential" | "all";

const KEY = "cookies_consent_v2";
const OFFSET_PX = 96;

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setMounted(true);

    // показать баннер при первом заходе (если выбора ещё нет)
    try {
      const v = localStorage.getItem(KEY) as ConsentLevel | null;
      if (!v) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  // ✅ открыть “настройки cookies” по кнопке из футера
  useEffect(() => {
    const open = () => setShow(true);
    window.addEventListener("kq:open_cookies_settings", open);
    return () => window.removeEventListener("kq:open_cookies_settings", open);
  }, []);

  // чтобы баннер не перекрывал контент
  useEffect(() => {
    if (!mounted) return;

    const prev = document.body.style.paddingBottom;
    if (show) document.body.style.paddingBottom = `${OFFSET_PX}px`;
    else document.body.style.paddingBottom = prev || "";

    return () => {
      document.body.style.paddingBottom = prev || "";
    };
  }, [show, mounted]);

  const setConsent = (level: ConsentLevel) => {
    try {
      localStorage.setItem(KEY, level);
    } catch {}

    // можно слушать и включать/выключать аналитику (если появится)
    try {
      window.dispatchEvent(new CustomEvent("cookies:consent", { detail: { level } }));
    } catch {}

    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[80] px-4">
      <div className="mx-auto max-w-4xl">
        <div
          className={[
            "relative overflow-hidden rounded-3xl border border-white/10",
            "bg-white/80 backdrop-blur-xl",
            "shadow-[0_18px_70px_rgba(0,0,0,0.18)] ring-1 ring-black/10",
            "transition duration-300 ease-out",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          ].join(" ")}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[#ffc400]/18 blur-3xl" />
            <div className="absolute -right-20 -bottom-24 h-60 w-60 rounded-full bg-black/5 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:gap-5 md:p-5">
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-black">Cookies</div>
              <p className="mt-1 text-sm text-black/60">
                Мы используем cookies для работы сайта. Подробнее — в{" "}
                <Link href="/cookies" className="font-bold underline underline-offset-2 hover:text-black">
                  политике cookies
                </Link>{" "}
                и{" "}
                <Link href="/privacy" className="font-bold underline underline-offset-2 hover:text-black">
                  политике конфиденциальности
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:shrink-0 md:justify-end">
              <button type="button" onClick={() => setConsent("rejected")} className="btn-outline px-4 py-3 text-sm">
                Отклонить
              </button>

              <button type="button" onClick={() => setConsent("essential")} className="btn-outline px-4 py-3 text-sm">
                Только обязательные
              </button>

              <button type="button" onClick={() => setConsent("all")} className="btn-primary px-5 py-3 text-sm">
                Принять все
              </button>
            </div>
          </div>
        </div>

        <div className="mt-2 text-center text-[11px] font-semibold text-black/45">
          Обязательные cookies нужны для корректной работы сайта.
        </div>
      </div>
    </div>
  );
}