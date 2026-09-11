import { createClient } from "@/lib/supabase/server";
import { createAdmissionCycleAction, createAdmissionOfferingAction } from "@/app/actions/admin";

interface OfferingCampusRelation {
  name: string;
}

interface OfferingItem {
  id: string;
  track: string;
  entry_class: string;
  campuses: OfferingCampusRelation | OfferingCampusRelation[] | null;
  admission_cycles: { academic_session: string } | { academic_session: string }[] | null;
}

export default async function AdminCyclesPage() {
  const supabase = await createClient();

  const { data: cycles } = await supabase
    .from("admission_cycles")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: campuses } = await supabase
    .from("campuses")
    .select("id, name");

  const { data: offeringsData } = await supabase
    .from("admission_offerings")
    .select(`
      id,
      track,
      entry_class,
      campuses (name),
      admission_cycles (academic_session)
    `);

  const offerings = (offeringsData || []) as unknown as OfferingItem[];

  return (
    <div>
      <header className="border-b border-white/10 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          Academic Offerings
        </span>
        <h1 className="mt-1 font-heading text-3xl font-bold text-white">
          Intake Sessions & Class Offerings
        </h1>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Create Cycle */}
        <div className="glass-panel p-6">
          <h2 className="font-heading text-base font-semibold text-white border-b border-white/10 pb-3">
            Add Admission Cycle (Session)
          </h2>

          <form
            action={async (formData: FormData) => {
              "use server";
              await createAdmissionCycleAction(formData);
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Academic Session *
              </label>
              <input
                name="academicSession"
                required
                placeholder="2026/2027"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Intake Title *
              </label>
              <input
                name="title"
                required
                placeholder="2026/2027 Annual Enrolment"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input type="checkbox" name="isActive" value="true" className="rounded" />
              <span>Set as Active Intake Session</span>
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-magenta px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-90"
            >
              Create Session
            </button>
          </form>

          {/* List Cycles */}
          <div className="mt-8 divide-y divide-white/10 border-t border-white/10 pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Existing Sessions</h3>
            {cycles && cycles.length > 0 ? (
              cycles.map((cyc) => (
                <div key={cyc.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white">{cyc.academic_session}</span>
                    <span className="text-slate-400 ml-2">({cyc.title})</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${cyc.is_active ? "text-emerald-400" : "text-slate-500"}`}>
                    {cyc.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No cycles added yet.</p>
            )}
          </div>
        </div>

        {/* Create Offering */}
        <div className="glass-panel p-6">
          <h2 className="font-heading text-base font-semibold text-white border-b border-white/10 pb-3">
            Add Campus Offering (Class & Track)
          </h2>

          <form
            action={async (formData: FormData) => {
              "use server";
              await createAdmissionOfferingAction(formData);
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Session *
              </label>
              <select name="cycleId" required className="mt-1.5 w-full rounded-xl border border-white/10 bg-space px-4 py-2 text-xs text-white">
                {cycles?.map((cyc) => (
                  <option key={cyc.id} value={cyc.id}>
                    {cyc.academic_session} ({cyc.title})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Campus *
              </label>
              <select name="campusId" required className="mt-1.5 w-full rounded-xl border border-white/10 bg-space px-4 py-2 text-xs text-white">
                {campuses?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Track *
                </label>
                <select name="track" required className="mt-1.5 w-full rounded-xl border border-white/10 bg-space px-4 py-2 text-xs text-white">
                  <option value="conventional">Conventional</option>
                  <option value="tahfeez">Tahfeez</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Entry Class *
                </label>
                <input
                  name="entryClass"
                  required
                  placeholder="e.g. Primary 1, JSS 1"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-magenta px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-90"
            >
              Add Offering
            </button>
          </form>

          {/* List Offerings */}
          <div className="mt-8 divide-y divide-white/10 border-t border-white/10 pt-4 max-h-60 overflow-y-auto">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Available Classes</h3>
            {offerings && offerings.length > 0 ? (
              offerings.map((o) => {
                const campusRaw = o.campuses;
                const campus = Array.isArray(campusRaw) ? campusRaw[0] : campusRaw;
                return (
                  <div key={o.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white">{campus?.name || "Campus"}</span>
                      <span className="text-slate-400 ml-2">({o.entry_class})</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-signal">{o.track}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500">No offerings configured yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}