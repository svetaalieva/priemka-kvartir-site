"use client";

export default function Footer() {
  const phoneDisplay = "+7 (978) 704-33-16";
  const phoneLink = "tel:+79787043316";
  const email = "i@snegoda.ru";

  return (
    <footer className="bg-black text-white">
      <div className="site-container py-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Бренд */}
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center font-black">
                KQ
              </div>
              <div>
                <div className="text-sm font-extrabold">Контроль Качества</div>
                <div className="text-xs text-white/60">Приёмка квартир • Крым</div>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-sm text-white/70">
              Профессиональная приёмка квартир в новостройках. Проверка, фиксация, акт замечаний.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <div className="text-sm font-extrabold">Разделы</div>
            <div className="mt-4 grid gap-2 text-sm text-white/75">
              <a className="hover:text-white" href="#services">
                Услуги
              </a>
              <a className="hover:text-white" href="#process">
                Как работаем
              </a>
              <a className="hover:text-white" href="#docs">
                Документы
              </a>
              <a className="hover:text-white" href="#geo">
                География
              </a>
              <a className="hover:text-white" href="#lead">
                Оставить заявку
              </a>
            </div>
          </div>

          {/* Контакты */}
          <div>
            <div className="text-sm font-extrabold">Контакты</div>
            <div className="mt-4 space-y-2 text-sm text-white/75">
              <div>
                Телефон:{" "}
                <a className="font-extrabold text-white hover:opacity-80" href={phoneLink}>
                  {phoneDisplay}
                </a>
              </div>
              <div>
                Почта: <span className="font-semibold">{email}</span>
              </div>
            </div>

            {/* Соцсети (пока заглушки) */}
            <div className="mt-5 flex items-center gap-2">
              {["TG", "VK", "IG"].map((x) => (
                <a
                  key={x}
                  href="#"
                  className="h-10 w-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xs font-extrabold hover:bg-white/15"
                  aria-label={x}
                >
                  {x}
                </a>
              ))}
              <span className="ml-1 text-white/30">*</span>
            </div>

            <div className="mt-6">
              <a href="#lead" className="btn-primary">
                Оставить заявку
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/55">
          © {new Date().getFullYear()} Контроль Качества. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
