"use client";

import { useState } from "react";
import { getDocumentSignedUrl } from "@/app/actions/admin";
import { FileText, Download, Loader2 } from "lucide-react";

export function AdminDocumentLink({
  storagePath,
  fileName,
  docType,
}: {
  storagePath: string;
  fileName: string;
  docType: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    const res = await getDocumentSignedUrl(storagePath);
    setLoading(false);

    if (res.url) {
      window.open(res.url, "_blank");
    } else {
      alert("Unable to open document: " + res.error);
    }
  }

  return (
    <div className="py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <FileText className="h-4 w-4 text-gold shrink-0" />
        <div>
          <p className="text-xs font-semibold text-white">{fileName}</p>
          <p className="text-[10px] uppercase text-slate-400">{docType.replace("_", " ")}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Download className="h-3 w-3" />
        )}
        <span>Open / Download</span>
      </button>
    </div>
  );
}