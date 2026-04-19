import Link from "next/link";
import AuthButton from "../components/AuthButton";
import { House, Map, GraduationCap, Heart, User } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#07152b] text-white">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_#071224,_#0a1830,_#071224)]" />
        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.14),_rgba(59,130,246,0.07),_transparent_70%)] blur-2xl" />
      </div>

      {/* Stars */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(60)].map((_, i) => {
          const size = Math.random() * 2 + 1; // 1px–3px
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 3;

          return (
            <span
              key={i}
              className="star"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-10 py-6">

        {/* LOGO */}
        <div className="flex items-end gap-1">
          <h1 className="font-[Be1Logo5] text-5xl tracking-wide sm:text-6xl">
            Be1
          </h1>
          <span className="font-[Be1Logo5] text-2xl tracking-wide text-white/70 sm:text-3xl">
            space
          </span>
        </div>

        {/* Sign in */}
        <AuthButton />
      </header>

      {/* HERO */}
      <section className="relative z-10 flex min-h-[calc(100vh-160px)] items-center justify-center px-6 pb-20 pt-6">

        <div className="w-full max-w-4xl text-center">

          {/* TITLE */}
          <div className="pt-4">
            <h2 className="font-[Be1space] text-3xl tracking-wide leading-[1.35] sm:text-4xl md:text-[4.5rem]">
              FIND YOUR
            </h2>

            <h2 className="font-[Be1space] mt-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-3xl tracking-wide leading-[1.35] text-transparent sm:text-4xl md:text-[4.5rem]">
              PERFECT SPACE
            </h2>
          </div>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-xl text-sm text-white/50 sm:text-base">
            Discover the ideal study and work spaces tailored to your needs
          </p>

          {/* BUTTON */}
          <div className="mt-7 mb-6">
            <Link
              href="/discover"
              className="inline-flex rounded-full bg-blue-600 px-7 py-3 text-base font-semibold shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:scale-105 hover:bg-blue-700"
            >
              Start Exploring
            </Link>
          </div>

        </div>
      </section>

      {/* Bottom Nav */}
      <nav className="relative z-10 border-t border-white/10 bg-[#0e1a31]/90 px-6 py-5 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl justify-around text-sm text-white/55">

          <Link href="/discover" className="flex flex-col items-center gap-1 hover:text-white">
            <House size={20} />
            <span>discover</span>
          </Link>

          <Link href="/map" className="flex flex-col items-center gap-1 hover:text-white">
            <Map size={20} />
            <span>map</span>
          </Link>

          <Link href="/nyu" className="flex flex-col items-center gap-1 hover:text-white">
            <GraduationCap size={20} />
            <span>NYU</span>
          </Link>

          <Link href="/favorites" className="flex flex-col items-center gap-1 hover:text-white">
            <Heart size={20} />
            <span>favorites</span>
          </Link>

          <Link href="/profile" className="flex flex-col items-center gap-1 hover:text-white">
            <User size={20} />
            <span>profile</span>
          </Link>

        </div>
      </nav>

    </main>
  );
}