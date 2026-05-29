"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SearchRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q") || searchParams.get("search") || "";
    router.replace(`/products?search=${encodeURIComponent(q)}`);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#FFF6F6] flex items-center justify-center flex-col gap-4 text-center">
      <div className="w-12 h-12 rounded-full border-4 border-[#D4AF37]/35 border-t-[#D4AF37] animate-spin" />
      <span className="text-xs uppercase font-bold tracking-widest text-[#2E2528]/80">Loading Premium Curation Search...</span>
    </div>
  );
}

export default function SearchRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFF6F6] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#D4AF37]/35 border-t-[#D4AF37] animate-spin" />
      </div>
    }>
      <SearchRedirectContent />
    </Suspense>
  );
}
