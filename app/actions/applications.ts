"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendAdmissionConfirmationEmail } from "@/lib/email";
import { z } from "zod";

const AdmissionDraftSchema = z.object({
  studentFirstName: z.string().trim().max(100).optional(),
  studentMiddleName: z.string().trim().max(100).optional(),
  studentLastName: z.string().trim().max(100).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  guardianRelationship: z.string().trim().max(100).optional(),
  guardianPhone: z.string().trim().max(40).optional(),
  guardianAltPhone: z.string().trim().max(40).optional(),
  guardianAddress: z.string().trim().max(300).optional(),
  previousSchool: z.string().trim().max(200).optional(),
  medicalConditions: z.string().trim().max(500).optional(),
  emergencyContactName: z.string().trim().max(200).optional(),
  emergencyContactPhone: z.string().trim().max(40).optional(),
});

const JobDraftSchema = z.object({
  coverLetter: z.string().trim().max(3000).optional(),
  highestQualification: z.string().trim().max(100).optional(),
  yearsOfExperience: z.coerce.number().min(0).max(50).optional(),
  portfolioUrl: z.string().trim().url().or(z.literal("")).optional(),
});

export async function createAdmissionDraft(offeringId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("admission_applications")
    .insert({
      applicant_id: user.id,
      offering_id: offeringId,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to initialize admission application.");
  }

  revalidatePath("/portal");
  redirect(`/portal/admissions/${data.id}`);
}

export async function saveAdmissionDraft(applicationId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to save progress." };
  }

  const raw = {
    studentFirstName: formData.get("studentFirstName")?.toString() || "",
    studentMiddleName: formData.get("studentMiddleName")?.toString() || "",
    studentLastName: formData.get("studentLastName")?.toString() || "",
    dateOfBirth: formData.get("dateOfBirth")?.toString() || undefined,
    gender: (formData.get("gender")?.toString() as "male" | "female" | "other") || undefined,
    guardianRelationship: formData.get("guardianRelationship")?.toString() || "",
    guardianPhone: formData.get("guardianPhone")?.toString() || "",
    guardianAltPhone: formData.get("guardianAltPhone")?.toString() || "",
    guardianAddress: formData.get("guardianAddress")?.toString() || "",
    previousSchool: formData.get("previousSchool")?.toString() || "",
    medicalConditions: formData.get("medicalConditions")?.toString() || "",
    emergencyContactName: formData.get("emergencyContactName")?.toString() || "",
    emergencyContactPhone: formData.get("emergencyContactPhone")?.toString() || "",
  };

  const parsed = AdmissionDraftSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("admission_applications")
    .update({
      student_first_name: parsed.data.studentFirstName,
      student_middle_name: parsed.data.studentMiddleName || null,
      student_last_name: parsed.data.studentLastName,
      date_of_birth: parsed.data.dateOfBirth || null,
      gender: parsed.data.gender || null,
      guardian_relationship: parsed.data.guardianRelationship || null,
      guardian_phone: parsed.data.guardianPhone || null,
      guardian_alt_phone: parsed.data.guardianAltPhone || null,
      guardian_address: parsed.data.guardianAddress || null,
      previous_school: parsed.data.previousSchool || null,
      medical_conditions: parsed.data.medicalConditions || null,
      emergency_contact_name: parsed.data.emergencyContactName || null,
      emergency_contact_phone: parsed.data.emergencyContactPhone || null,
    })
    .eq("id", applicationId)
    .eq("applicant_id", user.id)
    .eq("status", "draft");

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/portal/admissions/${applicationId}`);
  return { success: true };
}

export async function submitAdmissionAction(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data, error } = await supabase.rpc("submit_admission_application", {
    p_application_id: applicationId,
  });

  if (error) {
    return { error: error.message };
  }

  const result = data as { success: boolean; error?: string; reference_number?: string };

  if (!result.success) {
    return { error: result.error || "Submission failed." };
  }

  // Trigger confirmation email asynchronously
  (async () => {
    try {
      const { data: appData } = await supabase
        .from("admission_applications")
        .select(`
          student_first_name,
          student_last_name,
          admission_offerings (
            track,
            campuses (name)
          )
        `)
        .eq("id", applicationId)
        .single();

      if (user.email && appData) {
        const offeringRaw = appData.admission_offerings as unknown;
        const offering = Array.isArray(offeringRaw) ? offeringRaw[0] : offeringRaw as { track?: string; campuses?: { name?: string } | { name?: string }[] } | null;
        const campusRaw = offering?.campuses;
        const campus = Array.isArray(campusRaw) ? campusRaw[0] : campusRaw;

        await sendAdmissionConfirmationEmail({
          toEmail: user.email,
          applicantName: "Guardian",
          studentName: `${appData.student_first_name} ${appData.student_last_name}`,
          referenceNumber: result.reference_number || "ADM-PENDING",
          campusName: campus?.name || "Al-Ihsan Campus",
          track: offering?.track || "Conventional",
        });
      }
    } catch (e) {
      console.error("Submission email error", e);
    }
  })();

  revalidatePath("/portal");
  revalidatePath(`/portal/admissions/${applicationId}`);
  return { success: true, referenceNumber: result.reference_number };
}

export async function createJobDraft(jobOpeningId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("job_applications")
    .insert({
      applicant_id: user.id,
      job_opening_id: jobOpeningId,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to initialize job application.");
  }

  revalidatePath("/portal");
  redirect(`/portal/careers/${data.id}`);
}

export async function saveJobDraft(applicationId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required." };
  }

  const raw = {
    coverLetter: formData.get("coverLetter")?.toString() || "",
    highestQualification: formData.get("highestQualification")?.toString() || "",
    yearsOfExperience: formData.get("yearsOfExperience")?.toString() || undefined,
    portfolioUrl: formData.get("portfolioUrl")?.toString() || "",
  };

  const parsed = JobDraftSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("job_applications")
    .update({
      cover_letter: parsed.data.coverLetter || null,
      highest_qualification: parsed.data.highestQualification || null,
      years_of_experience: parsed.data.yearsOfExperience ?? null,
      linkedin_or_portfolio_url: parsed.data.portfolioUrl || null,
    })
    .eq("id", applicationId)
    .eq("applicant_id", user.id)
    .eq("status", "draft");

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/portal/careers/${applicationId}`);
  return { success: true };
}

export async function submitJobAction(applicationId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("submit_job_application", {
    p_application_id: applicationId,
  });

  if (error) {
    return { error: error.message };
  }

  const result = data as { success: boolean; error?: string; reference_number?: string };
  if (!result.success) {
    return { error: result.error || "Submission failed." };
  }

  revalidatePath("/portal");
  revalidatePath(`/portal/careers/${applicationId}`);
  return { success: true, referenceNumber: result.reference_number };
}

export async function uploadApplicationDocument(
  applicationId: string,
  docType: "birth_certificate" | "passport_photo" | "previous_result" | "medical_report" | "cv" | "certificate" | "other",
  applicationCategory: "admission" | "job",
  formData: FormData
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required." };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Please select a valid file to upload." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { error: "File exceeds maximum size limit (10MB)." };
  }

  const fileExt = file.name.split(".").pop() || "pdf";
  const storagePath = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("applicant-documents")
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const insertPayload: Record<string, unknown> = {
    uploader_id: user.id,
    document_type: docType,
    storage_path: storagePath,
    original_file_name: file.name,
    file_size_bytes: file.size,
    mime_type: file.type,
  };

  if (applicationCategory === "admission") {
    insertPayload.admission_application_id = applicationId;
  } else {
    insertPayload.job_application_id = applicationId;
  }

  const { error: dbError } = await supabase
    .from("application_documents")
    .insert(insertPayload);

  if (dbError) {
    return { error: dbError.message };
  }

  if (applicationCategory === "admission") {
    revalidatePath(`/portal/admissions/${applicationId}`);
  } else {
    revalidatePath(`/portal/careers/${applicationId}`);
  }

  return { success: true };
}

export async function deleteApplicationDocument(documentId: string, applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: doc } = await supabase
    .from("application_documents")
    .select("storage_path, admission_application_id")
    .eq("id", documentId)
    .eq("uploader_id", user.id)
    .single();

  if (doc) {
    await supabase.storage.from("applicant-documents").remove([doc.storage_path]);
    await supabase.from("application_documents").delete().eq("id", documentId);
  }

  if (doc?.admission_application_id) {
    revalidatePath(`/portal/admissions/${applicationId}`);
  } else {
    revalidatePath(`/portal/careers/${applicationId}`);
  }

  return { success: true };
}
