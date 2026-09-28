export function Header() {
  return (
    <header className="mx-auto max-w-6xl px-4 pt-10 pb-8 text-center sm:pt-14">
      <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold tracking-widest text-amber-200 uppercase">
        <span aria-hidden>⚔️</span> Clash of Clans
      </p>
      <h1 className="font-display text-4xl tracking-wide text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] sm:text-6xl">
        Damage <span className="text-amber-300">Calculator</span>
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-slate-400">
        Hitung kombinasi Earthquake, Spell &amp; Hero Equipment yang pas untuk meruntuhkan bangunan
        target — tanpa hitung manual.
      </p>
    </header>
  )
}
