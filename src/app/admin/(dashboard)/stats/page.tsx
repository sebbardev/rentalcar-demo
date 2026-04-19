"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="animate-spin mx-auto mb-4 text-[var(--color-primary)]" size={48} />
        <p className="admin-label">Redirection vers le dashboard unifié...</p>
      </div>
    </div>
  );
}
