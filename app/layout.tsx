import "./globals.css";

export const metadata = {
  title: "Simple Todo App",
  description: "Simple Todo App using NextJS and TailwindCSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
