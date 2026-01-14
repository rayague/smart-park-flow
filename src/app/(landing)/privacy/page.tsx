export default function PrivacyPage() {
  return (
    <main className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10">
          <div className="absolute -top-28 -right-28 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative">
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">Privacy</h1>
            <p className="text-muted-foreground max-w-2xl">Politique de confidentialité — contenu à compléter.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
