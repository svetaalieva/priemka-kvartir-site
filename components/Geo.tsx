"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type City = {
  name: string;
  x: number; // 0..100
  y: number; // 0..100
  lx: number; // 0..100
  ly: number; // 0..100
  major?: boolean;
};

export default function Geo() {
  const phoneLink = "tel:+79787043316";

  const cities = useMemo<City[]>(
    () => [
      // Запад
      { name: "Черноморское", x: 10, y: 40, lx: 10, ly: 22 },
      { name: "Евпатория", x: 20, y: 52, lx: 18, ly: 62, major: true },
      { name: "Саки", x: 26, y: 55, lx: 28, ly: 72 },
      { name: "Раздольное", x: 18, y: 34, lx: 14, ly: 16 },

      // Юго-запад
      { name: "Севастополь", x: 26, y: 66, lx: 24, ly: 84, major: true },
      { name: "Балаклава", x: 28, y: 71, lx: 34, ly: 96 },
      { name: "Инкерман", x: 28, y: 63, lx: 36, ly: 78 },
      { name: "Бахчисарай", x: 34, y: 59, lx: 40, ly: 48 },
      { name: "Николаевка", x: 33, y: 66, lx: 46, ly: 88 },
      { name: "Форос", x: 40, y: 79, lx: 44, ly: 104 },

      // Центр/север
      { name: "Симферополь", x: 42, y: 56, lx: 46, ly: 62, major: true },
      { name: "Джанкой", x: 44, y: 28, lx: 48, ly: 12, major: true },
      { name: "Красноперекопск", x: 32, y: 22, lx: 30, ly: 6 },
      { name: "Армянск", x: 28, y: 18, lx: 18, ly: 4 },

      // Восток
      { name: "Белогорск", x: 52, y: 55, lx: 64, ly: 42 },
      { name: "Нижнегорский", x: 60, y: 40, lx: 76, ly: 26 },
      { name: "Феодосия", x: 84, y: 58, lx: 92, ly: 48, major: true },
      { name: "Коктебель", x: 82, y: 61, lx: 96, ly: 62 },
      { name: "Судак", x: 78, y: 66, lx: 94, ly: 80 },
      { name: "Ленино", x: 88, y: 38, lx: 96, ly: 22 },
      { name: "Керчь", x: 96, y: 46, lx: 104, ly: 36, major: true },

      // ЮБК
      { name: "Ялта", x: 60, y: 74, lx: 58, ly: 102, major: true },
      { name: "Симеиз", x: 50, y: 79, lx: 54, ly: 112 },
      { name: "Алупка", x: 54, y: 77, lx: 66, ly: 112 },
      { name: "Гурзуф", x: 64, y: 70, lx: 84, ly: 96 },
      { name: "Партенит", x: 66, y: 67, lx: 92, ly: 86 },
      { name: "Алушта", x: 70, y: 64, lx: 98, ly: 66, major: true },
    ],
    []
  );

  const [active, setActive] = useState<string>("");
  const [inView, setInView] = useState(false);

  // Поиск
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const query = q.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!query) return [];
    const res = cities
      .filter((c) => c.name.toLowerCase().includes(query))
      .sort((a, b) => {
        const as = a.name.toLowerCase().startsWith(query) ? -1 : 0;
        const bs = b.name.toLowerCase().startsWith(query) ? -1 : 0;
        return as - bs || a.name.localeCompare(b.name, "ru");
      });
    return res.slice(0, 8);
  }, [cities, query]);

  const matchSet = useMemo(() => {
    if (!query) return new Set<string>();
    return new Set(cities.filter((c) => c.name.toLowerCase().includes(query)).map((c) => c.name));
  }, [cities, query]);

  // refs
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);

  // параллакс
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef({ x: 0, y: 0 });

  // камера (пан/зум)
  const camRef = useRef({ x: 0, y: 0, s: 1 });
  const camAnimRef = useRef<number | null>(null);

  const prefersReduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  const applyTransform = (extra: { px: number; py: number } = { px: 0, py: 0 }) => {
    const g = gRef.current;
    if (!g) return;

    const cam = camRef.current;
    const px = extra.px;
    const py = extra.py;

    // итог: сначала камера (пан/зум), сверху лёгкий параллакс
    // translate(px,py) делаем ПОСЛЕ камеры, чтобы было “живое” ощущение
    g.setAttribute(
      "transform",
      `translate(${cam.x} ${cam.y}) scale(${cam.s}) translate(${px} ${py})`
    );
  };

  const animateCameraTo = (tx: number, ty: number, ts: number) => {
    if (prefersReduced()) {
      camRef.current = { x: tx, y: ty, s: ts };
      applyTransform({ px: 0, py: 0 });
      return;
    }

    if (camAnimRef.current) cancelAnimationFrame(camAnimRef.current);

    const start = { ...camRef.current };
    const end = { x: tx, y: ty, s: ts };
    const t0 = performance.now();
    const dur = 520;

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const p = clamp((now - t0) / dur, 0, 1);
      const e = ease(p);

      camRef.current = {
        x: start.x + (end.x - start.x) * e,
        y: start.y + (end.y - start.y) * e,
        s: start.s + (end.s - start.s) * e,
      };

      applyTransform({ px: 0, py: 0 });

      if (p < 1) camAnimRef.current = requestAnimationFrame(tick);
      else camAnimRef.current = null;
    };

    camAnimRef.current = requestAnimationFrame(tick);
  };

  const focusCity = (name: string) => {
    const c = cities.find((x) => x.name === name);
    if (!c) return;

    // координаты точки в системе viewBox
    const cx = (c.x / 100) * 1200;
    const cy = (c.y / 100) * 560;

    // целевая “камера”: лёгкий зум и центрирование
    const s = 1.12;

    // хотим, чтобы (cx,cy) оказался около центра (600,280)
    const tx = 600 - cx * s;
    const ty = 280 - cy * s;

    // ограничим, чтобы карту не уводило слишком сильно
    const limX = 220;
    const limY = 120;

    animateCameraTo(clamp(tx, -limX, limX), clamp(ty, -limY, limY), s);
  };

  const resetCamera = () => {
    setActive("");
    setQ("");
    setOpen(false);
    animateCameraTo(0, 0, 1);
  };

 const emitCityToForm = (city: string) => {
  // кидаем событие для page.tsx
  window.dispatchEvent(new CustomEvent("geo:city", { detail: { city } }));

  // мягко прокрутим к форме
  const el = document.getElementById("form");
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const selectCity = (name: string) => {
  setActive(name);
  setQ(name);
  setOpen(false);
  focusCity(name);

  emitCityToForm(name);
};

  // reveal on scroll
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.18 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // parallax (поверх камеры)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (prefersReduced()) return;

    const apply = () => {
      rafRef.current = null;

      const dx = lastRef.current.x;
      const dy = lastRef.current.y;

      const px = clamp(dx * 14, -14, 14);
      const py = clamp(dy * 10, -10, 10);

      applyTransform({ px, py });
    };

    const onMove = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;

      const nx = (ev.clientX - cx) / (r.width / 2);
      const ny = (ev.clientY - cy) / (r.height / 2);

      lastRef.current.x = nx;
      lastRef.current.y = ny;

      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      lastRef.current.x = 0;
      lastRef.current.y = 0;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        applyTransform({ px: 0, py: 0 });
      });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (camAnimRef.current) cancelAnimationFrame(camAnimRef.current);
    };
  }, []);

  // если пользователь чистит поиск — сбрасываем актив и камеру
  useEffect(() => {
    if (!q.trim()) {
      setActive("");
      animateCameraTo(0, 0, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <section id="geo" className="relative bg-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-0 h-140 w-140 rounded-full bg-[#ffc400]/10 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-140 w-140 rounded-full bg-black/5 blur-3xl" />
      </div>

      <div className="site-container relative py-16 md:py-20">
        <div className="mb-7">
          <div className="text-sm font-semibold text-black/50">География</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">
            Работаем по всему <span className="text-[#ffc400]">Крыму</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/60">
            Найди город — камера мягко сфокусируется на точке. На телефоне — просто тап по точке.
          </p>
        </div>

        <div
          ref={wrapRef}
          className={[
            "relative rounded-3xl border border-black/10 bg-white",
            "shadow-[0_26px_90px_rgba(0,0,0,0.10)]",
            "transition duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          ].join(" ")}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
            <div>
              <div className="text-lg font-extrabold tracking-tight md:text-xl">Карта выездов</div>
              <div className="mt-1 text-sm text-black/50">Поиск сверху • клик по точке • премиум-камера</div>
            </div>

            {/* ПОИСК */}
            <div className="relative w-full max-w-md md:w-[420px]">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35">🔎</span>
                <input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  onBlur={() => window.setTimeout(() => setOpen(false), 140)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (matches[0]) selectCity(matches[0].name);
                      else setOpen(false);
                    }
                    if (e.key === "Escape") setOpen(false);
                  }}
                  placeholder="Поиск города (например, Ялта, Керчь...)"
                  className="w-full rounded-2xl border border-black/10 bg-white px-11 py-3 text-sm font-semibold text-black shadow-[0_14px_40px_rgba(0,0,0,0.06)] outline-none transition focus:border-black/25"
                />
                {q ? (
                  <button
                    type="button"
                    onClick={resetCamera}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white px-2.5 py-1 text-xs font-bold text-black/60 hover:bg-black/[0.03]"
                  >
                    Сброс
                  </button>
                ) : null}
              </div>

              {open && query ? (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_26px_90px_rgba(0,0,0,0.14)]">
                  {matches.length ? (
                    <div className="p-1">
                      {matches.map((m) => (
                        <button
                          key={m.name}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selectCity(m.name)}
                          className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-black/[0.03]"
                        >
                          <span className="text-sm font-extrabold">{m.name}</span>
                          <span className="text-xs font-bold text-black/45">показать</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-black/55">
                      Ничего не найдено. Попробуй: <span className="font-bold">Симферополь</span>,{" "}
                      <span className="font-bold">Ялта</span>.
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-xs font-bold text-black/60">
              Крым
            </span>
          </div>

          <div className="px-4 pb-4 pt-5 md:px-8 md:pb-8">
            <div
              className={[
                "relative overflow-hidden rounded-2xl border border-black/10 bg-black/[0.02]",
                "transition hover:shadow-[0_22px_70px_rgba(0,0,0,0.10)]",
              ].join(" ")}
              onMouseLeave={() => setActive("")}
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#ffc400]/14 blur-3xl" />

              <div className="px-5 pt-5">
                <svg viewBox="0 0 1200 560" className="h-[380px] w-full md:h-[460px]" role="img" aria-label="Карта Крыма">
                  <defs>
                    <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="rgba(0,0,0,0.14)" />
                      <stop offset="1" stopColor="rgba(0,0,0,0.05)" />
                    </linearGradient>

                    <radialGradient id="glow" cx="50%" cy="50%" r="55%">
                      <stop offset="0" stopColor="rgba(255,196,0,0.55)" />
                      <stop offset="1" stopColor="rgba(255,196,0,0)" />
                    </radialGradient>

                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="rgba(0,0,0,0.12)" />
                    </filter>

                    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(0,0,0,0.10)" />
                    </filter>
                  </defs>

                  <g ref={gRef}>
                    <g filter="url(#shadow)">
                      <path
                        d="M130 280
                           C170 170, 340 115, 485 145
                           C575 75, 740 70, 870 120
                           C995 170, 1090 215, 1140 250
                           C1180 280, 1160 350, 1120 380
                           C1050 430, 1000 470, 930 495
                           C820 535, 665 525, 545 490
                           C465 466, 395 470, 305 500
                           C220 530, 150 490, 125 445
                           C106 410, 92 365, 130 280 Z"
                        fill="url(#land)"
                        stroke="rgba(0,0,0,0.18)"
                        strokeWidth="2"
                      />
                      <path
                        d="M230 448
                           C360 510, 520 490, 615 460
                           C705 432, 825 470, 930 450
                           C1035 430, 1100 372, 1120 320"
                        fill="none"
                        stroke="rgba(255,196,0,0.45)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="3 11"
                      />
                    </g>

                    {cities.map((c) => {
                      const cx = (c.x / 100) * 1200;
                      const cy = (c.y / 100) * 560;
                      const lx = (c.lx / 100) * 1200;
                      const ly = (c.ly / 100) * 560;

                      const isActive = active === c.name;
                      const showLabel = Boolean(c.major) || isActive;

                      const isMatch = query ? matchSet.has(c.name) : true;
                      const baseOpacity = query ? (isMatch ? 1 : 0.22) : 1;

                      const dashLen = 140;

                      return (
                        <g
                          key={c.name}
                          onMouseEnter={() => setActive(c.name)}
                          onClick={() => selectCity(c.name)}
                          style={{ cursor: "pointer", opacity: baseOpacity }}
                        >
                          <circle cx={cx} cy={cy} r={isActive ? 40 : 28} fill="url(#glow)" opacity={isActive ? 1 : 0.7} />

                          <circle
                            cx={cx}
                            cy={cy}
                            r={isActive ? 7.8 : 6.2}
                            fill="#ffc400"
                            stroke={isActive ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.35)"}
                            strokeWidth="2"
                            className={isActive ? "geo-dot geo-dot--active" : "geo-dot"}
                          />

                          <g
                            style={{
                              opacity: showLabel ? 1 : 0,
                              transition: "opacity 260ms ease",
                              transformOrigin: `${cx}px ${cy}px`,
                            }}
                          >
                            <path
                              d={`M ${cx} ${cy} L ${lx} ${ly}`}
                              stroke={isActive ? "rgba(0,0,0,0.48)" : "rgba(0,0,0,0.24)"}
                              strokeWidth={isActive ? 2.2 : 1.6}
                              strokeLinecap="round"
                              fill="none"
                              strokeDasharray={dashLen}
                              strokeDashoffset={showLabel ? 0 : dashLen}
                              style={{ transition: "stroke-dashoffset 420ms ease, stroke 220ms ease" }}
                            />

                            <g filter="url(#soft)" className={isActive ? "geo-label geo-label--active" : "geo-label"}>
                              <rect
                                x={lx - 78}
                                y={ly - 18}
                                rx={18}
                                ry={18}
                                width={156}
                                height={36}
                                fill={isActive ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.92)"}
                                stroke="rgba(0,0,0,0.10)"
                              />
                              <text
                                x={lx}
                                y={ly + 6}
                                textAnchor="middle"
                                fontSize="16"
                                fontWeight="900"
                                fill={isActive ? "rgba(0,0,0,0.88)" : "rgba(0,0,0,0.78)"}
                                style={{ letterSpacing: "-0.2px" }}
                              >
                                {c.name}
                              </text>
                            </g>
                          </g>
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>

              <div className="flex items-center justify-between px-5 pb-5 text-xs text-black/45">
                <span>Схема региона</span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#ffc400]" />
                  города/посёлки
                </span>
              </div>

              {active ? (
                <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black px-4 py-2 text-xs font-extrabold text-white shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
                  {active}
                </div>
              ) : (
                <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-black/60 ring-1 ring-black/10 backdrop-blur">
                  Наведи на точку • на телефоне — тап • поиск сверху
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-4 rounded-2xl border border-black/10 bg-white p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="text-sm font-extrabold text-black/75">Важно</div>
                <p className="mt-1 text-sm leading-relaxed text-black/60">
                  Стоимость зависит от площади и формата. Точную стоимость подтверждаем по телефону.
                </p>
                <div className="mt-2 text-xs font-semibold text-black/40">Ответим быстро • Выезд по Крыму</div>
              </div>

              <div className="flex flex-wrap gap-3 md:justify-end">
                <a href="#form" className="btn-primary transition hover:-translate-y-[1px]">
                  Оставить заявку
                </a>
                <a href={phoneLink} className="btn-outline transition hover:-translate-y-[1px]">
                  Позвонить
                </a>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-80 -translate-x-1/2 rounded-full bg-black/10 blur-2xl" />

          <style jsx>{`
            .geo-dot {
              transform-origin: center;
              animation: breathe 2.6s ease-in-out infinite;
            }
            .geo-dot--active {
              animation: pulse 1.6s ease-in-out infinite;
            }
            .geo-label {
              transform: translateY(6px);
              opacity: 0.94;
              transition: transform 260ms ease, opacity 260ms ease;
            }
            .geo-label--active {
              transform: translateY(0px);
              opacity: 1;
            }
            @keyframes breathe {
              0%,
              100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.08);
              }
            }
            @keyframes pulse {
              0%,
              100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.16);
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .geo-dot,
              .geo-dot--active {
                animation: none !important;
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
