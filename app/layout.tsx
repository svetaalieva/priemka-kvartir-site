import "./globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Контроль качества — приёмка квартир в Крыму",
  description:
    "Профессиональная приёмка квартир в новостройках по всему Крыму. Проверка отделки, инженерии, площади. Акт замечаний для застройщика.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={montserrat.className}>
        {children}
      </body>
    </html>
  );
}
