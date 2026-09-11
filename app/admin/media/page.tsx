import { createClient } from "@/lib/supabase/server";
import { uploadPublicMediaAction, deletePublicMediaAction } from "@/app/actions/media";
import { Image as ImageIcon, Trash2, UploadCloud, Copy } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function AdminMediaPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data: mediaItems } = await query;

  const categories = [
    { value: "", label: "All Photos" },
    { value: "logo", label: "Logo & Crest" },
    { value: "proprietor", label: "Proprietor & Leadership" },
    { value: "campus", label: "Campuses" },
    { value: "classroom", label: "Classrooms & Labs" },
    { value: "graduation", label: "Graduation & Tahfeez Walimah" },
    { value: "excursion", label: "Excursions & Activities" },
    { value: "staff", label: "Faculty & Staff" },
  ];

  return (
    <div>
      <header className="border-b border-white/10 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          Digital Assets
        </span>
        <h1 className="mt-1 font-heading text-3xl font-bold text-white">
          Media & Photo Library
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Upload, tag, and organize school photographs in the public CDN bucket.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Gallery Grid (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat.value}
                href={cat.value ? `/admin/media?category=${cat.value}` : "/admin/media"}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  (category || "") === cat.value
                    ? "bg-magenta text-white shadow"
                    : "glass-panel text-slate-400 hover:text-white"
                }`}
              >
                {cat.label}
              </a>
            ))}
          </div>

          {/* Photos Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mediaItems && mediaItems.length > 0 ? (
              mediaItems.map((item) => (
                <div key={item.id} className="glass-panel overflow-hidden flex flex-col justify-between group">
                  <div className="relative aspect-video bg-black/40 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.public_url}
                      alt={item.alt_text || item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-3">
                    <p className="font-semibold text-xs text-white truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.alt_text}</p>

                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-slate-400">
                      <span>{(item.file_size_bytes ? (item.file_size_bytes / 1024).toFixed(0) + " KB" : "")}</span>

                      <form
                        action={async () => {
                          "use server";
                          await deletePublicMediaAction(item.id, item.storage_path);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-slate-400 hover:text-red-400 p-1"
                          title="Delete photo"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full glass-panel p-12 text-center text-slate-500 text-xs">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                No media uploaded in this category yet.
              </div>
            )}
          </div>
        </div>

        {/* Upload Form (Right col) */}
        <div className="glass-panel p-6">
          <h2 className="font-heading text-base font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <UploadCloud className="h-4 w-4 text-gold" /> Upload New Photo
          </h2>

          <form
            action={async (formData: FormData) => {
              "use server";
              await uploadPublicMediaAction(formData);
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Photo Category *
              </label>
              <select
                name="category"
                required
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-space px-4 py-2 text-xs text-white"
              >
                <option value="campus">Campus Grounds & Buildings</option>
                <option value="classroom">Classroom & Laboratory</option>
                <option value="graduation">Graduation / Tahfeez Walimah</option>
                <option value="staff">Staff & Faculty</option>
                <option value="excursion">Excursions & Events</option>
                <option value="logo">School Logo & Crest</option>
                <option value="proprietor">Proprietor / Executive</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Photo Title / Label
              </label>
              <input
                name="title"
                placeholder="e.g. Campus 1 Science Lab Session"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Accessibility Alt Text
              </label>
              <input
                name="altText"
                placeholder="Descriptive text for screen readers"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Image File (JPEG, PNG, WebP) *
              </label>
              <input
                name="file"
                type="file"
                required
                accept="image/jpeg,image/png,image/webp"
                className="mt-1.5 text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-magenta file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-magenta px-4 py-2.5 text-xs font-semibold text-white shadow-lg hover:opacity-90"
            >
              Upload to Media Library
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}