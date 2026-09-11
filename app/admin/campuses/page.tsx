import { createClient } from "@/lib/supabase/server";
import { saveCampusAction } from "@/app/actions/admin";
import { Building2, Plus } from "lucide-react";

export default async function AdminCampusesPage() {
  const supabase = await createClient();
  const { data: campuses } = await supabase
    .from("campuses")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div>
      <header className="border-b border-white/10 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          Campus Network
        </span>
        <h1 className="mt-1 font-heading text-3xl font-bold text-white">
          Manage Campuses
        </h1>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Campus List */}
        <div className="lg:col-span-2 space-y-4">
          {campuses && campuses.length > 0 ? (
            campuses.map((c) => (
              <div key={c.id} className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-magenta">
                    Order #{c.order_index}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-white mt-0.5">{c.name}</h3>
                  <p className="text-xs text-slate-400">{c.address || "No address assigned"}</p>
                  <p className="text-xs text-slate-400">Slug: /{c.slug}</p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    c.is_published
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {c.is_published ? "Published" : "Draft"}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">No campuses configured yet.</p>
          )}
        </div>

        {/* Add/Edit Campus Form */}
        <div className="glass-panel p-6">
          <h2 className="font-heading text-base font-semibold text-white border-b border-white/10 pb-3">
            Add / Update Campus
          </h2>

          <form
            action={async (formData: FormData) => {
              "use server";
              await saveCampusAction(formData);
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Campus Name *
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Al-Ihsan Campus 1 (Main)"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Slug *
              </label>
              <input
                name="slug"
                required
                placeholder="campus-1"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Address
              </label>
              <input
                name="address"
                placeholder="Street address in Maiduguri"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Phone Contact
              </label>
              <input
                name="phone"
                placeholder="+234 800..."
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Description
              </label>
              <textarea
                name="description"
                rows={2}
                placeholder="Campus details & facilities"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" name="isPublished" value="true" className="rounded" />
                <span>Publish on Website</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-magenta px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-90"
            >
              Save Campus Record
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}