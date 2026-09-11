"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful
        </h1>
        <p className="text-gray-500 mb-2">
          Galatoomi! Subscription kee ni activate ta’a.
        </p>
        <p className="text-gray-500 mb-6">
          Thank you! Your subscription is being activated.
        </p>
        {txRef && (
          <p className="text-sm font-mono text-gray-400 mb-6 break-all">
            Ref: {txRef}
          </p>
        )}
        <div className="flex flex-col gap-3">
          <Link href="/seller" className="btn btn-primary w-full py-3">
            Go to Dashboard →
          </Link>
          <Link href="/pricing" className="btn btn-outline w-full py-3">
            View Plans
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
