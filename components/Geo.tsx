"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type City = {
  name: string;
  x: number; // 0..100 (логические координаты)
  y: number; // 0..100
  lx: number; // 0..100 (позиция подписи)
  ly: number; // 0..100
  major?: boolean;
};

export default function Geo() {
  const phoneLink = "tel:+79787043316";

  /**
   * SVG в viewBox 1200 x 640 — есть запас снизу под подписи.
   */
  const VB_W = 1200;
  const VB_H = 640;

  const PAD_TOP = 40;
  const PAD_BOTTOM = 90;
  const WORK_H = VB_H - PAD_TOP - PAD_BOTTOM;

  // компенсация под контур (аккуратно)
  const X_SHIFT = -10;
  const X_SCALE = 1.02;

  // размеры лейбла (важно для clamp)
  const LABEL_W = 164;
  const LABEL_H = 38;
  const LABEL_PAD = 14;

  const cities = useMemo<City[]>(
    () => [
      // Запад
      // ✅ поправлено: чтобы не "уезжало"
      { name: "Черноморское", x: 12, y: 62, lx: 16, ly: 24 },
      { name: "Евпатория", x: 19, y: 60, lx: 16, ly: 64, major: true },
      { name: "Саки", x: 25, y: 56, lx: 28, ly: 73 },
      { name: "Раздольное", x: 18, y: 35, lx: 14, ly: 18 },

      // Север / перешеек
      { name: "Армянск", x: 26, y: 20, lx: 18, ly: 8 },
      { name: "Красноперекопск", x: 32, y: 23, lx: 30, ly: 10 },
      { name: "Джанкой", x: 45, y: 30, lx: 49, ly: 10, major: true },

      // Центр
      { name: "Симферополь", x: 44, y: 56, lx: 48, ly: 62, major: true },
      { name: "Белогорск", x: 54, y: 56, lx: 66, ly: 45 },
      { name: "Нижнегорский", x: 62, y: 42, lx: 78, ly: 28 },

      // Юго-запад
      { name: "Севастополь", x: 26, y: 68, lx: 24, ly: 86, major: true },
      { name: "Инкерман", x: 29, y: 64, lx: 37, ly: 78 },
      { name: "Балаклава", x: 29, y: 72, lx: 36, ly: 98 },
      { name: "Бахчисарай", x: 36, y: 60, lx: 42, ly: 50 },
      { name: "Николаевка", x: 34, y: 67, lx: 46, ly: 90 },
      { name: "Форос", x: 41, y: 80, lx: 45, ly: 106 },

      // ЮБК
      { name: "Симеиз", x: 50, y: 80, lx: 54, ly: 112 },
      { name: "Алупка", x: 54, y: 78, lx: 66, ly: 112 },
      { name: "Ялта", x: 60, y: 75, lx: 58, ly: 104, major: true },
      { name: "Гурзуф", x: 64, y: 71, lx: 84, ly: 98 },
      { name: "Партенит", x: 66, y: 68, lx: 92, ly: 88 },

      // ✅ Восточные города — разведены и подписи уводим левее
      { name: "Алушта", x: 70, y: 65, lx: 88, ly: 72, major: true },
      { name: "Феодосия", x: 84, y: 58, lx: 90, ly: 54, major: true },
      { name: "Коктебель", x: 82, y: 61, lx: 96, ly: 64 },
      { name: "Судак", x: 78, y: 66, lx: 94, ly: 82 },
      { name: "Ленино", x: 89, y: 40, lx: 98, ly: 26 },
      { name: "Керчь", x: 96, y: 48, lx: 92, ly: 40, major: true },
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
    return res.slice(0, 10);
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

  const mapX = (x: number) => ((x / 100) * VB_W) * X_SCALE + X_SHIFT;
  const mapY = (y: number) => PAD_TOP + (y / 100) * WORK_H;

  const applyTransform = (extra: { px: number; py: number } = { px: 0, py: 0 }) => {
    const g = gRef.current;
    if (!g) return;

    const cam = camRef.current;
    g.setAttribute(
      "transform",
      `translate(${cam.x} ${cam.y}) scale(${cam.s}) translate(${extra.px} ${extra.py})`
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

    const cx = mapX(c.x);
    const cy = mapY(c.y);

    const s = 1.12;
    const tx = VB_W / 2 - cx * s;
    const ty = (VB_H / 2 - 30) - cy * s;

    const limX = 240;
    const limY = 160;

    animateCameraTo(clamp(tx, -limX, limX), clamp(ty, -limY, limY), s);
  };

  const resetCamera = () => {
    setActive("");
    setQ("");
    setOpen(false);
    animateCameraTo(0, 0, 1);
  };

  const selectCity = (name: string) => {
    setActive(name);
    setQ(name);
    setOpen(false);
    focusCity(name);
  };

  // reveal on scroll
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.16 }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {/* внешняя мягкая подсветка */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-0 h-140 w-140 rounded-full bg-[#ffc400]/12 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-140 w-140 rounded-full bg-black/5 blur-3xl" />
      </div>

      <div className="site-container relative py-16 md:py-20">
        <div className="mb-7">
          <div className="text-sm font-semibold text-black/50">География</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">
            Работаем по всему <span className="text-[#ffc400]">Крыму</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/60">
            Найди город — камера мягко сфокусируется на точке. На телефоне — тап по точке.
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
                      <span className="font-bold">Севастополь</span>.
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
                "relative overflow-hidden rounded-2xl border border-black/10",
                "bg-black/[0.02] transition hover:shadow-[0_22px_70px_rgba(0,0,0,0.10)]",
              ].join(" ")}
              onMouseLeave={() => setActive("")}
            >
              {/* МОРЕ */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-linear-to-br from-[#fff] via-[#fff] to-[#ffc400]/10" />
                <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#ffc400]/10 blur-3xl" />
                <div className="absolute -right-40 top-10 h-120 w-120 rounded-full bg-black/5 blur-3xl" />
                <div className="absolute left-1/2 top-[35%] h-72 w-[55rem] -translate-x-1/2 rounded-full bg-white/60 blur-2xl" />
              </div>

              <div className="px-5 pt-5 relative">
                <svg
                  viewBox={`0 0 ${VB_W} ${VB_H}`}
                  className="h-[400px] w-full md:h-[520px]"
                  role="img"
                  aria-label="Карта Крыма"
                >
                  <defs>
                    <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="rgba(0,0,0,0.16)" />
                      <stop offset="1" stopColor="rgba(0,0,0,0.06)" />
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
                    {/* КОНТУР */}
                    <g filter="url(#shadow)">
                      <path
                        d="
                          M 250 130
                          C 238 120, 215 118, 195 130
                          C 165 148, 150 176, 160 206
                          C 168 232, 190 252, 214 266
                          C 182 282, 150 306, 138 340
                          C 126 376, 140 418, 170 452
                          C 205 492, 260 520, 330 534
                          C 405 550, 485 544, 555 526
                          C 615 510, 675 512, 740 526
                          C 820 544, 900 544, 970 524
                          C 1040 504, 1100 468, 1140 430
                          C 1166 406, 1182 382, 1188 356
                          C 1196 320, 1184 292, 1158 272
                          C 1128 248, 1080 224, 1024 200
                          C 948 168, 860 148, 780 144
                          C 700 140, 635 154, 585 176
                          C 558 138, 512 116, 455 114
                          C 392 112, 332 126, 280 156
                          C 270 148, 260 140, 250 130
                          Z
                        "
                        fill="url(#land)"
                        stroke="rgba(0,0,0,0.18)"
                        strokeWidth="2"
                      />

                      {/* ЮБК пунктир */}
                      <path
                        d="
                          M 250 476
                          C 340 516, 450 500, 555 476
                          C 660 452, 760 486, 860 468
                          C 980 446, 1085 398, 1140 340
                        "
                        fill="none"
                        stroke="rgba(255,196,0,0.45)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="3 11"
                      />
                    </g>

                    {/* ГОРОДА */}
                    {cities.map((c) => {
                      const cx = mapX(c.x);
                      const cy = mapY(c.y);

                      // сырая позиция лейбла
                      const lxRaw = mapX(c.lx);
                      const lyRaw = mapY(c.ly);

                      // clamp центра лейбла (чтобы не обрезался)
                      const lxc = clamp(lxRaw, LABEL_W / 2 + LABEL_PAD, VB_W - LABEL_W / 2 - LABEL_PAD);
                      const lyc = clamp(lyRaw, LABEL_H / 2 + LABEL_PAD, VB_H - LABEL_H / 2 - LABEL_PAD);

                      // умная сторона (чтобы справа не слипалось и не обрезалось)
                      const side = lxRaw > VB_W - 120 ? "right" : lxRaw < 120 ? "left" : "center";

                      const rectX =
                        side === "right" ? lxc - LABEL_W : side === "left" ? lxc : lxc - LABEL_W / 2;
                      const textX = side === "right" ? lxc - 12 : side === "left" ? lxc + 12 : lxc;
                      const anchor = side === "right" ? "end" : side === "left" ? "start" : "middle";

                      const isActive = active === c.name;
                      const showLabel = Boolean(c.major) || isActive;

                      const isMatch = query ? matchSet.has(c.name) : true;
                      const baseOpacity = query ? (isMatch ? 1 : 0.22) : 1;

                      const dashLen = 150;

                      return (
                        <g
                          key={c.name}
                          onMouseEnter={() => setActive(c.name)}
                          onClick={() => selectCity(c.name)}
                          style={{ cursor: "pointer", opacity: baseOpacity }}
                        >
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isActive ? 44 : 30}
                            fill="url(#glow)"
                            opacity={isActive ? 1 : 0.72}
                          />

                          <circle
                            cx={cx}
                            cy={cy}
                            r={isActive ? 8.2 : 6.3}
                            fill="#ffc400"
                            stroke={isActive ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.35)"}
                            strokeWidth="2"
                            className={isActive ? "geo-dot geo-dot--active" : "geo-dot"}
                          />

                          {/* ЛЕЙБЛЫ */}
                          <g
                            style={{
                              opacity: showLabel ? 1 : 0,
                              transition: "opacity 260ms ease",
                              transformOrigin: `${cx}px ${cy}px`,
                            }}
                          >
                            {/* линия тоже на lxc/lyc */}
                            <path
                              d={`M ${cx} ${cy} L ${lxc} ${lyc}`}
                              stroke={isActive ? "rgba(0,0,0,0.48)" : "rgba(0,0,0,0.24)"}
                              strokeWidth={isActive ? 2.2 : 1.6}
                              strokeLinecap="round"
                              fill="none"
                              strokeDasharray={dashLen}
                              strokeDashoffset={showLabel ? 0 : dashLen}
                              style={{ transition: "stroke-dashoffset 420ms ease, stroke 220ms ease" }}
                            />

                            <g filter="url(#soft)" className={isActive ? "geo-label geo-label--active" : "geo-label"}>
                              {/* ✅ rect на lxc/lyc */}
                              <rect
                                x={rectX}
                                y={lyc - 19}
                                rx={18}
                                ry={18}
                                width={LABEL_W}
                                height={LABEL_H}
                                fill={isActive ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.92)"}
                                stroke="rgba(0,0,0,0.10)"
                              />
                              {/* ✅ text на lxc/lyc */}
                              <text
                                x={textX}
                                y={lyc + 7}
                                textAnchor={anchor as any}
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

              <div className="flex items-center justify-between px-5 pb-5 text-xs text-black/45 relative">
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