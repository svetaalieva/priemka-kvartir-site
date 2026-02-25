"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconNewBuildCheck,
  IconThermal,
  IconEMI,
  IconRadiation,
  IconConclusion,
  IconPlan,
} from "@/components/service-icons";

type Service = {
  id: string;
  title: string;
  price: string;
  short: string;
  details: string;
  bullets?: string[];
  icon: React.ReactNode;
  featured?: boolean;
};

type AcceptanceSection = "top" | "findings" | "prep" | "pricing";

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function useLockBodyScroll(open: boolean) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const html = document.documentElement;

    scrollYRef.current = window.scrollY;

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
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.paddingRight = prev.paddingRight;

      window.scrollTo(0, scrollYRef.current);
    };
  }, [open]);
}

function useRevealList(count: number) {
  const refs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.dataset.revealed = "true";
          io.unobserve(el);
        }
      },
      { root: null, threshold: 0.12, rootMargin: "80px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [count]);

  return refs;
}

function isQueryPrice(price: string) {
  return price.trim().toLowerCase().includes("по запросу");
}

function PriceText({ price }: { price: string }) {
  const query = isQueryPrice(price);

  if (query) {
    return (
      <span
        className={cx(
          "inline-flex items-center rounded-full border border-black/12 bg-black/5",
          "px-2.5 py-1 text-[13px] font-semibold text-black/70 whitespace-nowrap",
          "transition group-hover:bg-black/10"
        )}
      >
        По запросу
      </span>
    );
  }

  return (
    <span
      className={cx(
        "inline-flex items-center",
        "text-[16px] md:text-[17px] font-semibold tabular-nums whitespace-nowrap",
        "transition duration-300",
        "group-hover:-translate-y-[1px]"
      )}
    >
      {price}
    </span>
  );
}

function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useLockBodyScroll(open || closing);

  // mount/unmount with exit animation
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

  // focus close button
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!mounted) return null;

  const state = open && !closing ? "open" : "closed";

  return (
    <div className="fixed inset-0 z-80" role="dialog" aria-modal="true" data-state={state}>
      <button
        aria-label="Закрыть"
        className={cx(
          "absolute inset-0 cursor-pointer bg-black/50 backdrop-blur-[6px]",
          "transition duration-200",
          "data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
        )}
        onClick={onClose}
      />

      <div className="relative mx-auto mt-6 w-[min(980px,calc(100%-24px))] md:mt-10">
        <div
          className={cx(
            "rounded-3xl border border-black/10 bg-white/90 backdrop-blur-xl",
            "shadow-[0_30px_80px_rgba(0,0,0,0.25)]",
            "transition duration-200 will-change-transform will-change-opacity",
            state === "open"
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-2 scale-[0.985]"
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-4 md:px-7">
            <div className="min-w-0">
              <div className="text-[12px] uppercase tracking-[0.18em] text-black/45">
                Подробнее об услуге
              </div>
              <h3 className="mt-1 text-lg font-semibold leading-tight md:text-xl">
                {title}
              </h3>
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

          <div className="max-h-[75vh] overflow-auto px-5 py-5 md:px-7 md:py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceList({
  items,
  sectionRef,
}: {
  items: Array<{ name: string; price: string; note?: string }>;
  sectionRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={sectionRef}
      className="rounded-2xl border border-black/10 bg-white/70 p-4"
    >
      <div className="text-[12px] uppercase tracking-[0.18em] text-black/45">
        Форматы и стоимость
      </div>

      <div className="mt-3 grid gap-2">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between gap-4 rounded-xl border border-black/10 bg-white/75 px-4 py-3"
          >
            <div className="min-w-0">
              <div className="font-medium leading-snug">{it.name}</div>
              {it.note ? (
                <div className="mt-1 text-sm text-black/55">{it.note}</div>
              ) : null}
            </div>

            <div className="shrink-0 font-semibold tabular-nums whitespace-nowrap">
              {it.price}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-black/45">
        * Цена зависит от площади и сложности. Точную стоимость подтверждаем по телефону.
      </p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12px] uppercase tracking-[0.18em] text-black/45">
      {children}
    </div>
  );
}

function BulletDot() {
  return <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-black/50" />;
}

export default function Services() {
  const services: Service[] = useMemo(
    () => [
      {
        id: "acceptance",
        featured: true,
        title: "Приёмка квартиры",
        price: "от 6 000 ₽",
        short:
          "Проверка → фиксация → акт замечаний для застройщика. Внутри — все форматы и что входит.",
        details:
          "Приёмка квартиры — это профессиональная проверка качества объекта перед подписанием документов.\n\nНаша задача:\n• найти дефекты,\n• грамотно зафиксировать,\n• помочь вам предъявить застройщику понятные требования на устранение.\n\nВы получаете:\n• перечень замечаний,\n• фото/видео фиксацию,\n• рекомендации по приоритетам: что критично, что допустимо, что исправить легко.",
        bullets: [
          "Осмотр и замеры по чек-листу",
          "Фото/видео фиксация дефектов",
          "Акт замечаний для застройщика",
        ],
        icon: <IconNewBuildCheck className="h-10 w-10" />,
      },
      {
        id: "thermal",
        title: "Тепловизионный осмотр",
        price: "2 000 ₽",
        short: "Поиск мостиков холода, продуваний и зон потерь тепла.",
        details:
          "Тепловизионный осмотр помогает увидеть проблемы, которые не заметны обычным взглядом: теплопотери, продувание в примыканиях, проблемные зоны вокруг окон и в углах.\n\nКогда особенно полезно:\n• угловые квартиры, верхние этажи;\n• есть сомнения в окнах/примыканиях;\n• нужно подтвердить проблему «наглядно».",
        bullets: [
          "Осмотр ключевых зон (окна, углы, примыкания)",
          "Фото/скрины теплополя",
          "Выводы и рекомендации, что требовать исправить",
        ],
        icon: <IconThermal className="h-10 w-10" />,
      },
      {
        id: "designer",
        title: "Замер для дизайнера",
        price: "5 000 ₽",
        short: "Точные замеры и привязки для дизайн-проекта.",
        details:
          "Делаем замер так, чтобы дизайнеру не пришлось «догадываться»: размеры, привязки, ключевые точки, нюансы проёмов. Это экономит время на проектировании и снижает риск ошибок на ремонте.",
        bullets: ["Замеры + привязки", "Ключевые точки", "Передача данных/файла"],
        icon: <IconPlan className="h-10 w-10" />,
      },
      {
        id: "plan",
        title: "Подробный план квартиры",
        price: "3 000 ₽",
        short: "Планировка/схема для ремонта, мебели и коммуникаций.",
        details:
          "Подготавливаем понятный подробный план квартиры. Формат согласуем заранее: что именно нужно отразить на плане и в каком виде передать.",
        bullets: ["План/схема", "Согласование формата", "Передача файла"],
        icon: <IconPlan className="h-10 w-10" />,
      },
      {
        id: "conclusion",
        title: "Заключение специалиста",
        price: "6 000 ₽",
        short: "Структурированное заключение по выявленным проблемам.",
        details:
          "Если нужно «собрать всё в один документ» — готовим заключение: что обнаружено, почему это важно, к чему может привести, и что рекомендовано сделать. Формулируем так, чтобы было удобно использовать в коммуникации.",
        bullets: [
          "Структурированное описание замечаний",
          "Фото/скрины (при необходимости)",
          "Рекомендации и приоритеты",
        ],
        icon: <IconConclusion className="h-10 w-10" />,
      },
      {
        id: "emi",
        title: "Замер квартиры на ЭМИ",
        price: "по запросу",
        short: "Измерение электромагнитного излучения.",
        details:
          "Проводим замеры электромагнитного фона в помещении и даём выводы по результатам. Стоимость зависит от задач и объёма замеров.",
        bullets: ["Замеры", "Выводы", "Рекомендации"],
        icon: <IconEMI className="h-10 w-10" />,
      },
      {
        id: "radiation",
        title: "Замер квартиры на радиацию",
        price: "по запросу",
        short: "Измерение радиационного фона.",
        details:
          "Контроль радиационного фона в помещении с фиксацией результатов. Стоимость зависит от задач и объёма замеров.",
        bullets: ["Замеры", "Выводы", "Рекомендации"],
        icon: <IconRadiation className="h-10 w-10" />,
      },
    ],
    []
  );

  const cardRefs = useRevealList(services.length);

  const [openId, setOpenId] = useState<string | null>(null);
  const [acceptanceTarget, setAcceptanceTarget] =
    useState<AcceptanceSection>("top");

  const current = openId ? services.find((s) => s.id === openId) : null;

  const accTopRef = useRef<HTMLDivElement | null>(null);
  const accFindingsRef = useRef<HTMLDivElement | null>(null);
  const accPrepRef = useRef<HTMLDivElement | null>(null);
  const accPricingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!current) return;
    if (current.id !== "acceptance") return;

    const map: Record<AcceptanceSection, React.RefObject<HTMLDivElement | null>> =
      {
        top: accTopRef,
        findings: accFindingsRef,
        prep: accPrepRef,
        pricing: accPricingRef,
      };

    const ref = map[acceptanceTarget];

    const t = window.setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);

    return () => window.clearTimeout(t);
  }, [current, acceptanceTarget]);

  function openDetails(id: string) {
    if (id === "acceptance") setAcceptanceTarget("pricing");
    setOpenId(id);
  }

  return (
    <section
      id="services"
      className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14"
    >
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-[12px] uppercase tracking-[0.18em] text-black/45">
            Услуги
          </div>
          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
            Стоимость услуг
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60 md:text-[15px]">
            Основная услуга — приёмка квартиры. Остальные услуги можно добавить
            по необходимости.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, idx) => (
          <article
            key={s.id}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            data-revealed="false"
            className={cx(
              "group relative overflow-hidden rounded-3xl border border-black/10 bg-white/70",
              "shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl",
              "min-h-[360px] md:min-h-[380px] flex flex-col",
              "transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.12)]",
              // reveal
                "opacity-0 translate-y-4 data-[revealed=true]:opacity-100 data-[revealed=true]:translate-y-0",
                "motion-reduce:opacity-100 motion-reduce:translate-y-0",
              "transition-[opacity,transform,box-shadow] duration-700",
              // featured gold hover (лёгкий)
              s.featured &&
                "border-[#ffc400]/55 bg-[linear-gradient(180deg,rgba(255,196,0,0.16),rgba(255,255,255,0.72))] " +
                  "shadow-[0_18px_55px_rgba(255,196,0,0.16)] " +
                  "hover:shadow-[0_28px_78px_rgba(255,196,0,0.22)]"
            )}
            style={{ transitionDelay: `${Math.min(idx * 60, 240)}ms` }}
          >
            {/* subtle premium glow */}
            <div className="pointer-events-none absolute -inset-24 opacity-0 transition duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 rounded-[48px] bg-[radial-gradient(circle_at_30%_20%,rgba(255,196,0,0.20),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.10),transparent_60%)]" />
            </div>

            {s.featured ? (
              <div className="relative px-5 pt-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-3 py-1 text-[12px] font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ffc400]" />
                  Основная услуга
                </div>
              </div>
            ) : null}

            <div className={cx("relative flex items-start gap-4 p-5", s.featured && "pt-4")}>
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-black/10 bg-white/70">
                {s.icon}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-[16px] font-semibold leading-snug line-clamp-2">
                  {s.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-black/60 line-clamp-2">
                  {s.short}
                </p>

                <div className="mt-3 text-[11px] uppercase tracking-[0.18em] text-black/45">
                  Что входит
                </div>

                {s.bullets?.length ? (
                  <ul className="mt-2 grid gap-1.5 text-[13px] text-black/60">
                    {s.bullets.slice(0, 3).map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-black/45" />
                        <span className="line-clamp-1">{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            {/* ✅ FIX: цена не лезет на кнопки — фикс ширины + shrink-0 для кнопок */}
            <div className="relative mt-auto border-t border-black/10 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="w-[132px] md:w-[140px]">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                    Стоимость
                  </div>
                  <div className="mt-1.5">
                    <PriceText price={s.price} />
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => openDetails(s.id)}
                    className={cx(
                      "cursor-pointer",
                      "rounded-full border border-black/12 bg-white/70 px-4 py-2 text-[13px] font-medium",
                      "hover:bg-white transition",
                      "focus:outline-none focus:ring-2 focus:ring-black/10"
                    )}
                  >
                    Подробнее
                  </button>

                  <a
                    href="#form"
                    className={cx(
                      "cursor-pointer",
                      s.featured
                        ? "bg-[#ffc400] text-black hover:brightness-95"
                        : "bg-black text-white hover:opacity-90",
                      "rounded-full px-4 py-2 text-[13px] font-medium",
                      "shadow-[0_10px_30px_rgba(0,0,0,0.22)]",
                      "transition hover:translate-y-[-1px] hover:shadow-[0_18px_45px_rgba(0,0,0,0.26)]",
                      "focus:outline-none focus:ring-2 focus:ring-black/20"
                    )}
                  >
                    Записаться
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={!!current}
        title={current?.title ?? "Подробнее"}
        onClose={() => setOpenId(null)}
      >
        {current && (
          <div className="space-y-5">
            <div
              ref={current.id === "acceptance" ? accTopRef : undefined}
              className="rounded-2xl border border-black/10 bg-white/70 p-4 text-sm leading-relaxed text-black/70 whitespace-pre-line"
            >
              {current.details}
            </div>

            {current.id === "acceptance" ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setAcceptanceTarget("findings")}
                    className="rounded-full border border-black/12 bg-white/70 px-4 py-2 text-sm font-medium hover:bg-white transition cursor-pointer"
                  >
                    Что находим
                  </button>
                  <button
                    onClick={() => setAcceptanceTarget("prep")}
                    className="rounded-full border border-black/12 bg-white/70 px-4 py-2 text-sm font-medium hover:bg-white transition cursor-pointer"
                  >
                    Что подготовить
                  </button>
                  <button
                    onClick={() => setAcceptanceTarget("pricing")}
                    className="rounded-full border border-black/12 bg-white/70 px-4 py-2 text-sm font-medium hover:bg-white transition cursor-pointer"
                  >
                    Прайс
                  </button>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                  <SectionTitle>Как проходит приёмка</SectionTitle>
                  <ol className="mt-3 grid gap-2 text-sm text-black/70">
                    <li className="flex gap-3">
                      <span className="mt-[2px] grid h-6 w-6 place-items-center rounded-full border border-black/10 bg-white/70 text-xs font-semibold">
                        1
                      </span>
                      <span>
                        Осмотр по чек-листу: геометрия/отделка или основание, окна/двери,
                        видимые инженерные узлы.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-[2px] grid h-6 w-6 place-items-center rounded-full border border-black/10 bg-white/70 text-xs font-semibold">
                        2
                      </span>
                      <span>
                        Фото/видео фиксация + формулировки замечаний понятным языком.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-[2px] grid h-6 w-6 place-items-center rounded-full border border-black/10 bg-white/70 text-xs font-semibold">
                        3
                      </span>
                      <span>
                        Перечень замечаний для застройщика + приоритеты: что критично и что исправить
                        в первую очередь.
                      </span>
                    </li>
                  </ol>
                </div>

                <div
                  ref={accFindingsRef}
                  className="rounded-2xl border border-black/10 bg-white/70 p-4"
                >
                  <SectionTitle>Что чаще всего находим</SectionTitle>
                  <ul className="mt-3 grid gap-2 text-sm text-black/70">
                    <li className="flex gap-2">
                      <BulletDot />
                      Отклонения по плоскостям и углам, перепады уровней
                    </li>
                    <li className="flex gap-2">
                      <BulletDot />
                      Дефекты отделки/оснований, стыки, трещины, сколы
                    </li>
                    <li className="flex gap-2">
                      <BulletDot />
                      Проблемы с окнами/дверями: регулировки, примыкания, фурнитура
                    </li>
                    <li className="flex gap-2">
                      <BulletDot />
                      Недочёты по сантехнике/электрике (видимые и функциональные)
                    </li>
                  </ul>
                </div>

                <div
                  ref={accPrepRef}
                  className="rounded-2xl border border-black/10 bg-white/70 p-4"
                >
                  <SectionTitle>Что подготовить к приёмке</SectionTitle>
                  <ul className="mt-3 grid gap-2 text-sm text-black/70">
                    <li className="flex gap-2">
                      <BulletDot />
                      Доступ в квартиру и контакт представителя застройщика
                    </li>
                    <li className="flex gap-2">
                      <BulletDot />
                      Документы/договор (если есть) — пригодится для уточнений
                    </li>
                    <li className="flex gap-2">
                      <BulletDot />
                      Заряженный телефон для согласований на месте
                    </li>
                    <li className="flex gap-2">
                      <BulletDot />
                      Если вы не можете приехать — заранее оформить доверенность
                    </li>
                  </ul>
                </div>

                <PriceList
                  sectionRef={accPricingRef}
                  items={[
                    {
                      name: "Приёмка без отделки",
                      price: "6 000 ₽",
                      note: "Основание, геометрия, инженерные выводы, видимые дефекты.",
                    },
                    {
                      name: "Приёмка с отделкой",
                      price: "8 000 ₽",
                      note: "Отделка + окна/двери + функциональные проверки сантехники/электрики.",
                    },
                    {
                      name: "Повторная приёмка",
                      price: "4 000 ₽",
                      note: "Контроль устранения замечаний + сравнение «до/после».",
                    },
                    {
                      name: "Приёмка по доверенности",
                      price: "5 000 ₽",
                      note: "Услуга после приёмки: примем без вашего присутствия по доверенности.",
                    },
                  ]}
                />
              </div>
            ) : current.bullets?.length ? (
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <SectionTitle>Что входит</SectionTitle>
                <ul className="mt-3 grid gap-2 text-sm text-black/70">
                  {current.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <BulletDot />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <a
                href="#form"
                onClick={() => setOpenId(null)}
                className={cx(
                  "cursor-pointer",
                  current.featured
                    ? "bg-[#ffc400] text-black hover:brightness-95"
                    : "bg-black text-white hover:opacity-90",
                  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium",
                  "shadow-[0_10px_30px_rgba(0,0,0,0.22)]",
                  "transition hover:translate-y-[-1px] hover:shadow-[0_18px_45px_rgba(0,0,0,0.26)]"
                )}
              >
                Записаться на проверку
              </a>

              <button
                onClick={() => setOpenId(null)}
                className="inline-flex items-center justify-center rounded-full border border-black/12 bg-white/70 px-5 py-2.5 text-sm font-medium hover:bg-white transition cursor-pointer"
              >
                Понятно
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}