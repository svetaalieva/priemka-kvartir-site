export const metadata = {
  title: "Cookies — Контроль Качества",
};

export default function CookiesPage() {
  return (
    <main className="site-container py-10 md:py-14">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Cookies</h1>

      <section className="mt-6 space-y-3 text-sm leading-relaxed text-black/80">
        <p>
          Cookies — это небольшие файлы, которые сохраняются в вашем браузере и помогают сайту корректно работать, а также
          могут использоваться для аналитики.
        </p>

        <h2 className="pt-2 text-lg font-bold text-black">1. Какие cookies могут использоваться</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <b>Обязательные (технические)</b> — необходимы для работы сайта (включены всегда).
          </li>
          <li>
            <b>Необязательные</b> — например, аналитические cookies (включаются только при согласии «Принять»).
          </li>
        </ul>

        <h2 className="pt-2 text-lg font-bold text-black">2. Как управлять cookies</h2>
        <p>
          Вы можете ограничить или отключить cookies в настройках браузера. В этом случае некоторые функции сайта могут
          работать некорректно.
        </p>

        <h2 className="pt-2 text-lg font-bold text-black">3. Аналитика</h2>
        <p>
          Если на сайте подключены сервисы аналитики (например, Яндекс.Метрика), они могут устанавливать cookies согласно
          своим политикам. Такие cookies должны включаться только после вашего согласия.
        </p>

        <p className="pt-4 text-xs text-black/50">
          Дата публикации: {new Date().toLocaleDateString("ru-RU")}
        </p>
      </section>
    </main>
  );
}