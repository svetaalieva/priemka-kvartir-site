export const metadata = {
  title: "Согласие на обработку ПДн — Контроль Качества",
};

const OPERATOR = {
  fio: "Негода Сергей Владимирович",
  status: "Самозанятый (плательщик НПД)",
  inn: "920353506310",
  email: "i@snegoda.ru",
};

export default function ConsentPage() {
  return (
    <main className="site-container py-10 md:py-14">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
        Согласие на обработку персональных данных
      </h1>

      <section className="mt-6 space-y-3 text-sm leading-relaxed text-black/80">
        <p>
          Я, субъект персональных данных, отправляя заявку/сообщение на сайте «Контроль Качества», свободно, своей волей
          и в своём интересе даю согласие оператору персональных данных:{" "}
          <b>
            {OPERATOR.status} — {OPERATOR.fio}
          </b>{" "}
          (ИНН: <b>{OPERATOR.inn}</b>, email: <b>{OPERATOR.email}</b>) на обработку моих персональных данных.
        </p>

        <h2 className="pt-2 text-lg font-bold text-black">1. Перечень данных</h2>
        <p>
          Имя, номер телефона, email (если указан), текст сообщения/заявки и иные сведения, добровольно предоставленные
          мной через формы сайта.
        </p>

        <h2 className="pt-2 text-lg font-bold text-black">2. Цели обработки</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Обратная связь по заявке.</li>
          <li>Консультация и согласование условий оказания услуг.</li>
          <li>Подготовка и исполнение договорных отношений.</li>
        </ul>

        <h2 className="pt-2 text-lg font-bold text-black">3. Действия с данными</h2>
        <p>
          Сбор, запись, систематизация, накопление, хранение, уточнение, использование, обезличивание, блокирование,
          удаление — в пределах целей обработки.
        </p>

        <h2 className="pt-2 text-lg font-bold text-black">4. Срок действия согласия</h2>
        <p>Согласие действует до достижения целей обработки или до момента его отзыва мной.</p>

        <h2 className="pt-2 text-lg font-bold text-black">5. Отзыв согласия</h2>
        <p>
          Согласие может быть отозвано мной в любой момент путём направления письма на email оператора:{" "}
          <b>{OPERATOR.email}</b>.
        </p>

        <p className="pt-4 text-xs text-black/50">
          Дата: {new Date().toLocaleDateString("ru-RU")}
        </p>
      </section>
    </main>
  );
}