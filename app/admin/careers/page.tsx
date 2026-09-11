import { createClient } from "@/lib/supabase/server";
import { saveJobOpeningAction } from "@/app/actions/admin";
import { Briefcase } from "lucide-react";

export default async function AdminCareersPage() {
  const supabase = await createClient();
  const { data: jobOpenings } = await supabase
    .from("job_openings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <header className="border-b border-white/10 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          Recruitment Manager
        </span>
        <h1 className="mt-1 font-heading text-3xl font-bold text-white">
          Manage Job Openings
        </h1>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Openings List */}
        <div className="lg:col-span-2 space-y-4">
          {jobOpenings && jobOpenings.length > 0 ? (
            jobOpenings.map((job) => (
              <div key={job.id} className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-magenta">
                    {job.department || "General Faculty"}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-white mt-0.5">{job.title}</h3>
                  <p className="text-xs text-slate-400">Slug: /{job.slug}</p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    job.is_published
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {job.is_published ? "Published" : "Draft"}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">No job openings created yet.</p>
          )}
        </div>

        {/* Add Job Opening Form */}
        <div className="glass-panel p-6">
          <h2 className="font-heading text-base font-semibold text-white border-b border-white/10 pb-3">
            Post Vacancy
          </h2>

          <form
            action={async (formData: FormData) => {
              "use server";
              await saveJobOpeningAction(formData);
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Job Title *
              </label>
              <input
                name="title"
                required
                placeholder="e.g. Senior Tahfeez Instructor"
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
                placeholder="senior-tahfeez-instructor"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Department
              </label>
              <input
                name="department"
                placeholder="e.g. Islamic Studies & Tahfeez"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Job Description *
              </label>
              <textarea
                name="description"
                rows={3}
                required
                placeholder="Key responsibilities and daily schedule..."
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Requirements
              </label>
              <textarea
                name="requirements"
                rows={2}
                placeholder="Ijazah in Quran recitation, B.Ed, minimum 2 years experience..."
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input type="checkbox" name="isPublished" value="true" className="rounded" />
              <span>Publish on Careers Page</span>
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-magenta px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-90"
            >
              Save & Post Vacancy
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}