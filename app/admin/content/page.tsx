import { createClient } from "@/lib/supabase/server";
import { saveContentBlockAction } from "@/app/actions/content";
import { FileText, Save } from "lucide-react";

interface ContentBlock {
  id: string;
  page_key: string;
  section_key: string;
  content: Record<string, string>;
  updated_at: string;
}

export default async function AdminContentPage() {
  const supabase = await createClient();
  const { data: rawBlocks } = await supabase
    .from("content_blocks")
    .select("*")
    .order("page_key", { ascending: true })
    .order("section_key", { ascending: true });

  const blocks = (rawBlocks || []) as unknown as ContentBlock[];

  const grouped: Record<string, ContentBlock[]> = {};
  for (const b of blocks) {
    if (!grouped[b.page_key]) {
      grouped[b.page_key] = [];
    }
    grouped[b.page_key].push(b);
  }

  return (
    <div>
      <header className="border-b border-white/10 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          Content Management
        </span>
        <h1 className="mt-1 font-heading text-3xl font-bold text-white">
          Edit Website Pages
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Update headlines, descriptions, and page copy across the public website. Changes appear instantly.
        </p>
      </header>

      <div className="mt-8 space-y-8">
        {Object.entries(grouped).map(([pageKey, sections]) => (
          <div key={pageKey}>
            <h2 className="font-heading text-lg font-bold text-magenta uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Page: /{pageKey}
            </h2>

            <div className="space-y-4">
              {sections.map((block) => {
                const contentObj = block.content || {};
                const fields = Object.entries(contentObj);

                return (
                  <div key={block.id} className="glass-panel p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                        Section: {block.section_key}
                      </h3>
                      <span className="text-[10px] text-slate-500">
                        Updated: {new Date(block.updated_at).toLocaleString()}
                      </span>
                    </div>

                    <form
                      action={async (formData: FormData) => {
                        "use server";
                        const json: Record<string, string> = {};
                        for (const [key] of fields) {
                          json[key] = formData.get(key)?.toString() || "";
                        }
                        formData.set("content", JSON.stringify(json));
                        await saveContentBlockAction(formData);
                      }}
                      className="space-y-4"
                    >
                      <input type="hidden" name="pageKey" value={pageKey} />
                      <input type="hidden" name="sectionKey" value={block.section_key} />

                      {fields.map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </label>
                          {String(value).length > 80 ? (
                            <textarea
                              name={key}
                              defaultValue={String(value)}
                              rows={3}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
                            />
                          ) : (
                            <input
                              name={key}
                              defaultValue={String(value)}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
                            />
                          )}
                        </div>
                      ))}

                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-magenta px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-90"
                      >
                        <Save className="h-3.5 w-3.5" /> Save Changes
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {blocks.length === 0 && (
          <div className="glass-panel p-12 text-center text-slate-500 text-sm">
            No editable content blocks found. Seed data may need to be inserted.
          </div>
        )}
      </div>
    </div>
  );
}