export default function DashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-2xl glass p-6">
        <div className="font-display text-2xl font-bold mb-2">Overview</div>
        <div className="text-muted-foreground">Statistiques, tendances, et réservations récentes.</div>
      </div>
      <div className="rounded-2xl glass p-6">
        <div className="font-display text-2xl font-bold mb-2">Quick Actions</div>
        <div className="text-muted-foreground">Réserver, recharger, payer.</div>
      </div>
    </div>
  );
}
