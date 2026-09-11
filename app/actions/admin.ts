"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendAdmissionStatusUpdateEmail } from "@/lib/email";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/portal");
  }

  return { supabase, user };
}

export async function updateAdmissionStatusAction(
  applicationId: string,
  newStatus: "under_review" | "accepted" | "rejected" | "waitlisted" | "withdrawn",
  publicMessage: string
) {
  const { supabase, user } = await assertAdmin();

  const { data: currentApp } = await supabase
    .from("admission_applications")
    .select("status")
    .eq("id", applicationId)
    .single();

  const fromStatus = currentApp?.status || "submitted";

  const { error: updateError } = await supabase
    .from("admission_applications")
    .update({ status: newStatus })
    .eq("id", applicationId);

  if (updateError) {
    return { error: updateError.message };
  }

  await supabase.from("admission_application_status_events").insert({
    application_id: applicationId,
    from_status: fromStatus,
    to_status: newStatus,
    public_message: publicMessage.trim() || `Status updated to ${newStatus.replace("_", " ")}.`,
    created_by: user.id,
  });

  revalidatePath(`/admin/admissions/${applicationId}`);
  revalidatePath("/admin/admissions");
  return { success: true };
}

export async function addAdmissionNoteAction(applicationId: string, note: string) {
  const { supabase, user } = await assertAdmin();

  if (!note.trim()) {
    return { error: "Note cannot be empty." };
  }

  const { error } = await supabase
    .from("admission_application_notes")
    .insert({
      application_id: applicationId,
      author_id: user.id,
      note: note.trim(),
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/admissions/${applicationId}`);
  return { success: true };
}

export async function getDocumentSignedUrl(storagePath: string) {
  const { supabase } = await assertAdmin();

  const { data, error } = await supabase.storage
    .from("applicant-documents")
    .createSignedUrl(storagePath, 3600);

  if (error || !data?.signedUrl) {
    return { error: error?.message || "Failed to generate download URL." };
  }

  return { url: data.signedUrl };
}

export async function saveCampusAction(formData: FormData) {
  const { supabase } = await assertAdmin();

  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString() || "";
  const slug = formData.get("slug")?.toString().toLowerCase().trim() || "";
  const address = formData.get("address")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const phone = formData.get("phone")?.toString() || "";
  const isPublished = formData.get("isPublished") === "true";
  const orderIndex = parseInt(formData.get("orderIndex")?.toString() || "0", 10);

  if (!name || !slug) {
    return { error: "Campus name and slug are required." };
  }

  const payload = {
    name,
    slug,
    address: address || null,
    description: description || null,
    phone: phone || null,
    is_published: isPublished,
    order_index: orderIndex,
  };

  if (id) {
    const { error } = await supabase.from("campuses").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("campuses").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/campuses");
  revalidatePath("/campuses");
  return { success: true };
}

export async function createAdmissionCycleAction(formData: FormData) {
  const { supabase } = await assertAdmin();

  const session = formData.get("academicSession")?.toString().trim() || "";
  const title = formData.get("title")?.toString().trim() || "";
  const isActive = formData.get("isActive") === "true";

  if (!session || !title) {
    return { error: "Academic session and title are required." };
  }

  const { error } = await supabase.from("admission_cycles").insert({
    academic_session: session,
    title,
    is_active: isActive,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/cycles");
  return { success: true };
}

export async function createAdmissionOfferingAction(formData: FormData) {
  const { supabase } = await assertAdmin();

  const cycleId = formData.get("cycleId")?.toString();
  const campusId = formData.get("campusId")?.toString();
  const track = formData.get("track")?.toString() as "conventional" | "tahfeez";
  const entryClass = formData.get("entryClass")?.toString().trim() || "";

  if (!cycleId || !campusId || !track || !entryClass) {
    return { error: "All offering fields are required." };
  }

  const { error } = await supabase.from("admission_offerings").insert({
    cycle_id: cycleId,
    campus_id: campusId,
    track,
    entry_class: entryClass,
    is_accepting_applications: true,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/cycles");
  return { success: true };
}

export async function saveJobOpeningAction(formData: FormData) {
  const { supabase } = await assertAdmin();

  const title = formData.get("title")?.toString().trim() || "";
  const slug = formData.get("slug")?.toString().toLowerCase().trim() || "";
  const department = formData.get("department")?.toString().trim() || "";
  const description = formData.get("description")?.toString() || "";
  const requirements = formData.get("requirements")?.toString() || "";
  const isPublished = formData.get("isPublished") === "true";

  if (!title || !slug || !description) {
    return { error: "Title, slug, and description are required." };
  }

  const { error } = await supabase.from("job_openings").insert({
    title,
    slug,
    department: department || null,
    description,
    requirements: requirements || null,
    is_published: isPublished,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  return { success: true };
}
