import { Suspense } from "react";
import JournalClient from "./JournalClient";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6">Loading journal...</p>}>
      <JournalClient />
    </Suspense>
  );
}