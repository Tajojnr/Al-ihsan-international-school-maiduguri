"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") redirect("/portal");
  return { supabase, user };
}

export async function saveContentBlockAction(formData: FormData) {
  const { supabase, user } = await assertAdmin();

  const pageKey = formData.get("pageKey")?.toString() || "";
  const sectionKey = formData.get("sectionKey")?.toString() || "";
  const contentJson = formData.get("content")?.toString() || "{}";

  if (!pageKey || !sectionKey) {
    return { error: "Page and section keys are required." };
  }

  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(contentJson);
  } catch {
    return { error: "Invalid JSON content." };
  }

  const { error } = await supabase
    .from("content_blocks")
    .upsert(
      {
        page_key: pageKey,
        section_key: sectionKey,
        content: parsed,
        updated_by: user.id,
      },
      { onConflict: "page_key,section_key" }
    );

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/content");
  return { success: true };
}