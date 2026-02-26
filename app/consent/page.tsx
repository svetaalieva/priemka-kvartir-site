export const metadata = {
  title: "Согласие на обработку персональных данных",
};

export default function ConsentPage() {
  return (
    <main className="site-container py-10 md:py-14">
      <h1 className="text-2xl md:text-3xl font-extrabold">
        Согласие на обработку персональных данных
      </h1>

      <section className="mt-6 space-y-4 text-sm leading-relaxed text-black/80">
        <p>
          Заполняя форму на сайте, я даю согласие самозанятому
          Негоде Сергею Владимировичу (ИНН 920353506310)
          на обработку моих персональных данных.
        </p>

        <h2 className="text-lg font-bold pt-2">Обрабатываемые данные:</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Имя</li>
          <li>Номер телефона</li>
        </ul>

        <h2 className="text-lg font-bold pt-2">Цель обработки:</h2>
        <p>Связь со мной и оказание услуг.</p>

        <h2 className="text-lg font-bold pt-2">Способы обработки:</h2>
        <p>
          Сбор, запись, хранение, использование, передача (включая передачу
          через сервисы уведомлений), удаление.
        </p>

        <h2 className="text-lg font-bold pt-2">Срок действия:</h2>
        <p>
          До достижения цели обработки либо до отзыва согласия.
        </p>

        <p>
          Согласие может быть отозвано путём направления письма на i@snegoda.ru.
        </p>
      </section>
    </main>
  );
}