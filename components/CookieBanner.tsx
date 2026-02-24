"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ConsentValue = "all" | "necessary" | "rejected";
const STORAGE_KEY = "kq_cookie_consent_v4";

function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (v === "all" || v === "necessary" || v === "rejected") return v;
  return null;
}

function writeConsent(v: ConsentValue) {
  window.localStorage.setItem(STORAGE_KEY, v);
  window.dispatchEvent(new CustomEvent("kq_cookie_consent_changed", { detail: v }));
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  // первичный показ — только если ещё нет выбора
  useEffect(() => {
    const existing = readConsent();
    if (!existing) setOpen(true);
  }, []);

  // открыть из футера (настройки)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("kq:open_cookies_settings", handler);
    return () => window.removeEventListener("kq:open_cookies_settings", handler);
  }, []);

  const acceptAll = () => {
    writeConsent("all");
    setOpen(false);
  };

  const acceptNecessary = () => {
    writeConsent("necessary");
    setOpen(false);
  };

  const reject = () => {
    writeConsent("rejected");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] px-3 pb-3 md:px-6 md:pb-6">
      <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-black/92 text-white shadow-2xl">
        <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:gap-5">
          {/* текст */}
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-extrabold">Cookies</div>
        
            </div>

            <p className="mt-1 text-xs leading-relaxed text-white/70">
              Мы используем cookies для работы сайта и (по согласию) аналитики. Подробнее —{" "}
              <Link className="underline underline-offset-2 hover:text-white" href="/cookies">
                политика cookies
              </Link>
              .
            </p>
          </div>

          {/* кнопки */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={reject}
              className="h-10 rounded-xl border border-white/15 bg-transparent px-4 text-xs font-semibold text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              Отклонить
            </button>

            <button
              type="button"
              onClick={acceptNecessary}
              className="h-10 rounded-xl border border-white/15 bg-white/5 px-4 text-xs font-bold text-white transition hover:bg-white/10"
            >
              Только обязательные
            </button>

            <button
              type="button"
              onClick={acceptAll}
              className="h-10 rounded-xl bg-yellow-300 px-4 text-xs font-extrabold text-black transition hover:bg-yellow-200"
            >
              Принять
            </button>
          </div>
        </div>

        {/* микро-строка пояснения (очень тонко) */}
        <div className="border-t border-white/10 px-4 py-2 text-[10px] text-white/45">
          “Отклонить” — это отказ от необязательных cookies. Технические cookies могут использоваться всегда.
        </div>
      </div>
    </div>
  );
}