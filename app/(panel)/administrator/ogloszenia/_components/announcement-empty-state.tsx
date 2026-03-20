export function AnnouncementEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
      <p className="text-sm font-medium text-stone-700">Nie masz jeszcze zadnych ogloszen.</p>
      <p className="mt-1 text-sm text-stone-500">
        Kliknij "Utworz nowa wiadomosc", aby dodac pierwszy komunikat.
      </p>
    </div>
  );
}
