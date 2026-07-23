import { Suspense } from "react";
import JournalClient from "./JournalClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <JournalClient />
    </Suspense>
  );
}