import { Composer } from "@/components/journal/Composer";

export default function JournalPage() {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6 text-foreground tracking-tight">Write Entry</h1>
      <div className="flex-1">
        <Composer />
      </div>
    </div>
  );
}
