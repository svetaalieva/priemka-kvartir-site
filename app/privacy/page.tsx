export const metadata = {
  title: "Политика конфиденциальности — Контроль Качества",
};

const OPERATOR = {
  fio: "Негода Сергей Владимирович",
  status: "Самозанятый (плательщик НПД)",
  inn: "920353506310",
  email: "i@snegoda.ru",
};

export default function PrivacyPage() {
  return (
    <main className="site-container py-10 md:py-14">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Политика конфиденциальности</h1>

      <section className="mt-6 space-y-3 text-sm leading-relaxed text-black/80">
        <p>
          Настоящая политика описывает, как обрабатываются персональные данные пользователей сайта «Контроль Качества».
          Оператор персональных данных:{" "}
          <b>
            {OPERATOR.status} — {OPERATOR.fio}
          </b>{" "}
          (ИНН: <b>{OPERATOR.inn}</b>, email: <b>{OPERATOR.email}</b>).
        </p>

        <h2 className="pt-2 text-lg font-bold text-black">1. Какие данные мы можем получать</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Имя, номер телефона и иные данные, которые вы укажете в форме.</li>
          <li>Технические данные: IP-адрес, cookies, данные браузера (если включена аналитика — только при согласии).</li>
        </ul>

        <h2 className="pt-2 text-lg font-bold text-black">2. Цели обработки</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Связаться с вами по заявке и оказать услугу.</li>
          <li>Улучшать работу сайта и качество сервиса (при наличии согласия на необязательные cookies).</li>
        </ul>

        <h2 className="pt-2 text-lg font-bold text-black">3. Правовые основания</h2>
        <p>Согласие субъекта персональных данных, а также необходимость исполнения запроса/договора на оказание услуг.</p>

        <h2 className="pt-2 text-lg font-bold text-black">4. Сроки хранения</h2>
        <p>Данные хранятся не дольше, чем это необходимо для целей обработки, либо до отзыва согласия.</p>

        <h2 className="pt-2 text-lg font-bold text-black">5. Передача третьим лицам</h2>
        <p>
          Мы не передаём персональные данные третьим лицам, кроме случаев, необходимых для обработки вашей заявки
          (например, технические сервисы доставки уведомлений), и в объёме, нужном для исполнения цели.
        </p>

        <h2 className="pt-2 text-lg font-bold text-black">6. Права пользователя</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Запросить сведения об обработке данных.</li>
          <li>Потребовать уточнения/удаления данных.</li>
          <li>Отозвать согласие на обработку, написав на: <b>{OPERATOR.email}</b>.</li>
        </ul>

        <p className="pt-2 text-black/70">
          Дата последнего обновления: <b>{new Date().toLocaleDateString("ru-RU")}</b>
        </p>
      </section>
    </main>
  );
}