import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     
      <Link href="/challenges/qr-component-main/index.html">QR</Link>
      <Link href="/challenges/fylo-dark-theme-landing-page-master/index.html">Pag oscuro</Link>

    </div>
  );
}
