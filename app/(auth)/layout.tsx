export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            Al-Ihsan International Islamic School
          </p>
          <p className="mt-1 text-xs text-slate-400">Maiduguri, Borno State</p>
        </div>
        <div className="glass-panel p-8">{children}</div>
      </div>
    </div>
  );
}