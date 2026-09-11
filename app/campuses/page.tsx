import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Our Campuses",
  description: "Overview of the six Al-Ihsan International Islamic School campuses situated across Maiduguri.",
};

export default async function CampusesPage() {
  const supabase = await createClient();
  const { data: dbCampuses } = await supabase
    .from("campuses")
    .select("*")
    .order("order_index", { ascending: true });

  // Fallback if none in database yet
  const campuses = dbCampuses && dbCampuses.length > 0 ? dbCampuses : [
    { id: "1", name: "Campus 1 — Main Campus", slug: "campus-1", address: "Maiduguri, Borno State", phone: "+234 800 000 0001", description: "Flagship campus hosting Conventional Nursery, Primary, and Secondary sections." },
    { id: "2", name: "Campus 2", slug: "campus-2", address: "Maiduguri, Borno State", phone: "+234 800 000 0002", description: "Dedicated facility featuring specialized Tahfeez classrooms and laboratories." },
    { id: "3", name: "Campus 3", slug: "campus-3", address: "Maiduguri, Borno State", phone: "+234 800 000 0003", description: "Modern learning center providing early years and primary education." },
    { id: "4", name: "Campus 4", slug: "campus-4", address: "Maiduguri, Borno State", phone: "+234 800 000 0004", description: "Equipped with state-of-the-art ICT and STEM learning centers." },
    { id: "5", name: "Campus 5", slug: "campus-5", address: "Maiduguri, Borno State", phone: "+234 800 000 0005", description: "Focused on comprehensive Tahfeez and basic education." },
    { id: "6", name: "Campus 6", slug: "campus-6", address: "Maiduguri, Borno State", phone: "+234 800 000 0006", description: "Spacious learning environment with modern sports and recreational facilities." },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          Campus Network
        </span>
        <h1 className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">
          Six Campuses Across Maiduguri
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          Each Al-Ihsan campus is equipped to deliver a secure, supportive, and conducive environment for spiritual and academic growth.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campuses.map((campus, idx) => (
          <div key={campus.id || idx} className="glass-panel p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-magenta">
                Campus 0{idx + 1}
              </span>
              <h2 className="mt-2 font-heading text-xl font-bold text-white">
                {campus.name}
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                {campus.description}
              </p>

              <div className="mt-6 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold shrink-0" />
                  <span>{campus.address || "Maiduguri, Borno State"}</span>
                </div>
                {campus.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gold shrink-0" />
                    <span>{campus.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-4">
              <Link
                href={`/campuses/${campus.slug}`}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold hover:underline"
              >
                View Campus Details <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}