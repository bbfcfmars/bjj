import { notFound } from "next/navigation";
import { getTechnique, getTechniqueIds } from "@/app/lib/techniques";
import { TechniqueBreakdown } from "@/components/TechniqueBreakdown";
import { ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const ids = getTechniqueIds();
  return ids.map((id) => ({ id }));
}

export default async function TechniquePage({ params }: Props) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const data = getTechnique(id);
  if (!data) notFound();

  const videoSrc = `/videos/${encodeURIComponent(id)}.mp4`;

  return (
    <div className="min-h-screen bg-slate-950">
      <main className="p-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-100">{data.technique_name}</h1>
          {data.portuguese_name && (
            <p className="text-slate-400">Also known as (Portuguese): {data.portuguese_name}</p>
          )}
          {data.difficulty && (
            <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
              {data.difficulty}
            </span>
          )}
          <p className="mt-3 text-slate-300 text-sm leading-relaxed">{data.description}</p>
        </div>
        <TechniqueBreakdown techniqueId={id} data={data} videoSrc={videoSrc} subtitleSrc={data.subtitle_path ?? null} />
      </main>
    </div>
  );
}
