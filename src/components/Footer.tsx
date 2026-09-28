const REFERENCES = [
  {
    icon: '▶️',
    label: 'Video referensi perhitungan',
    source: 'YouTube',
    href: 'https://youtu.be/PkVR9qjF9yI',
  },
  {
    icon: '📚',
    label: 'Statistik bangunan, spell & equipment',
    source: 'Clash of Clans Wiki',
    href: 'https://clashofclans.fandom.com/wiki/Clash_of_Clans_Wiki',
  },
]

export function Footer() {
  return (
    <footer className="mx-auto mt-10 max-w-6xl px-4">
      <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 sm:p-6">
        <h2 className="mb-3 font-display text-lg tracking-wide text-amber-100">
          Referensi &amp; Credit
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {REFERENCES.map((reference) => (
            <li key={reference.href}>
              <a
                href={reference.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-slate-950/50 p-3 ring-1 ring-white/5 transition hover:ring-amber-400/30"
              >
                <span className="text-xl" aria-hidden>
                  {reference.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-100">
                    {reference.label}
                  </span>
                  <span className="block truncate text-xs text-amber-200/80">
                    {reference.source} ↗
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          <strong className="text-slate-400">Disclaimer:</strong> Rumus dan angka di aplikasi ini
          disusun dari sumber di atas serta pengujian di lapangan, dan bisa berubah mengikuti update
          game. Hasil perhitungan adalah perkiraan, jadi selalu cek kembali sebelum menyerang. Aplikasi
          ini adalah fan-made dan tidak berafiliasi dengan, didukung, atau disponsori oleh Supercell.
          Clash of Clans adalah merek dagang milik Supercell.
        </p>
      </div>
    </footer>
  )
}
