import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, ArrowLeft, ArrowRight, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Campus: ${slug}`,
  };
}

export default async function CampusDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: campus } = await supabase
    .from("campuses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!campus) {
    notFound();
  }

  // Fetch campus-related photos
  const { data: campusPhotos } = await supabase
    .from("media")
    .select("id, title, public_url, alt_text")
    .in("category", ["campus", "classroom"])
    .limit(4);

  const campusName = campus.name;
  const address = campus.address || "Maiduguri, Borno State, Nigeria";
  const phone = campus.phone || "+234 800 000 0000";

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/campuses"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Campuses
      </Link>

      <div className="glass-panel p-8 lg:p-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          Campus Profile
        </span>
        <h1 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
          {campusName}
        </h1>

        <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gold" />
            <span>{address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gold" />
            <span>{phone}</span>
          </div>
        </div>

        <p className="mt-6 text-base leading-relaxed text-slate-300">
          {campus.description || "This campus offers both Conventional and Tahfeez tracks with modern facilities, qualified teaching staff, and a dedicated learning atmosphere."}
        </p>

        {/* Photos Strip */}
        {campusPhotos && campusPhotos.length > 0 && (
          <div className="mt-10 border-t border-white/10 pt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-base font-semibold text-white flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-gold" /> Campus Facilities
              </h2>
              <Link href="/gallery" className="text-xs text-gold hover:underline">
                View All in Gallery →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {campusPhotos.map((p) => (
                <div key={p.id} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.public_url}
                    alt={p.alt_text || p.title}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 border-t border-white/10 pt-8">
          <h2 className="font-heading text-lg font-semibold text-white">
            Available Programs at this Campus
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-signal shrink-0" />
              <div>
                <p className="font-medium text-sm text-white">Conventional Academic Track</p>
                <p className="text-xs text-slate-400">Nursery, Primary & Secondary</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-tahfeez shrink-0" />
              <div>
                <p className="font-medium text-sm text-white">Tahfeez al-Quran Track</p>
                <p className="text-xs text-slate-400">Quran Memorization & Tajweed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/admissions"
            className="inline-flex items-center gap-2 rounded-xl bg-magenta px-6 py-3 text-xs font-semibold text-white shadow-lg"
          >
            Apply to this Campus <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-xs font-semibold text-white hover:bg-white/10"
          >
            Contact Campus Office
          </Link>
        </div>
      </div>
    </main>
  );
}