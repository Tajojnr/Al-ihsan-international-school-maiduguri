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

export async function uploadPublicMediaAction(formData: FormData) {
  const { supabase, user } = await assertAdmin();

  const file = formData.get("file") as File | null;
  const title = formData.get("title")?.toString().trim() || "";
  const altText = formData.get("altText")?.toString().trim() || "";
  const category = (formData.get("category")?.toString() || "general") as
    | "campus"
    | "classroom"
    | "graduation"
    | "staff"
    | "excursion"
    | "logo"
    | "proprietor"
    | "general";

  if (!file || file.size === 0) {
    return { error: "Please choose an image file to upload." };
  }

  const fileExt = file.name.split(".").pop() || "jpg";
  const storagePath = `gallery/${category}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("public-media")
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: urlData } = supabase.storage
    .from("public-media")
    .getPublicUrl(storagePath);

  const { error: dbError } = await supabase.from("media").insert({
    title: title || file.name,
    alt_text: altText || title || "Al-Ihsan School Photo",
    category,
    storage_path: storagePath,
    public_url: urlData.publicUrl,
    file_size_bytes: file.size,
    mime_type: file.type,
    uploaded_by: user.id,
  });

  if (dbError) {
    return { error: dbError.message };
  }

  revalidatePath("/admin/media");
  return { success: true };
}

export async function deletePublicMediaAction(mediaId: string, storagePath: string) {
  const { supabase } = await assertAdmin();

  await supabase.storage.from("public-media").remove([storagePath]);
  await supabase.from("media").delete().eq("id", mediaId);

  revalidatePath("/admin/media");
  return { success: true };
}
