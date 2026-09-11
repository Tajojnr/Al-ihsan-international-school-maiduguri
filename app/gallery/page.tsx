import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Explore life, learning, and facilities across the six campuses of Al-Ihsan International Islamic School Maiduguri.",
};

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function GalleryPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("media")
    .select("id, title, alt_text, category, public_url, created_at")
    .order("created_at", { ascending: false });

  // Exclude internal logos/private tags from public gallery unless specifically requested
  if (category) {
    query = query.eq("category", category);
  } else {
    query = query.neq("category", "logo");
  }

  const { data: photos } = await query;

  const categories = [
    { value: "", label: "All Photos" },
    { value: "campus", label: "Campuses" },
    { value: "classroom", label: "Classrooms & Labs" },
    { value: "graduation", label: "Tahfeez Walimah & Graduation" },
    { value: "excursion", label: "Excursions & Events" },
    { value: "staff", label: "Faculty & Staff" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" /> Campus Life & Activities
        </span>
        <h1 className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">
          School Photo Gallery
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-300">
          A glimpse into our classrooms, Quran memorization circles, science laboratories, and school events across Maiduguri.
        </p>
      </div>

      {/* Category Pills */}
      <div className="mt-10 flex flex-wrap gap-2 border-b border-white/10 pb-6">
        {categories.map((cat) => {
          const isActive = (category || "") === cat.value;
          return (
            <Link
              key={cat.value}
              href={cat.value ? `/gallery?category=${cat.value}` : "/gallery"}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-magenta text-white shadow-lg shadow-magenta/20"
                  : "glass-panel text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* Photo Grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos && photos.length > 0 ? (
          photos.map((photo) => (
            <article
              key={photo.id}
              className="glass-panel overflow-hidden group hover:border-gold/40 transition-colors flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.public_url}
                  alt={photo.alt_text || photo.title || "Al-Ihsan School Photo"}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 rounded-md bg-black/75 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold border border-white/10">
                  {photo.category}
                </span>
              </div>

              <div className="p-4">
                <h2 className="font-heading text-sm font-semibold text-white">
                  {photo.title || "Campus Moment"}
                </h2>
                {photo.alt_text && photo.alt_text !== photo.title && (
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {photo.alt_text}
                  </p>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full glass-panel p-16 text-center max-w-md mx-auto">
            <ImageIcon className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <h3 className="font-heading text-base font-semibold text-white">
              No photos published in this category yet
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Photographs uploaded via the admin media manager will automatically appear here.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
