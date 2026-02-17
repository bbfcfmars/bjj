import Link from "next/link";
import { getAllTechniques } from "./lib/techniques";
import { Video } from "lucide-react";

export default function HomePage() {
  const techniques = getAllTechniques();
  return (
    <div className="min-h-screen bg-slate-950">
      <section className="p-4 max-w-5xl mx-auto">
        {techniques.length === 0 ? (
          <div className="rounded-xl bg-slate-900/80 border border-slate-700 p-8 text-center text-slate-400">
            <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No techniques yet. Drop clips in <code className="text-slate-300">public/videos/</code> and run the agent.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {techniques.map(({ id, data }) => (
              <Link
                key={id}
                href={`/technique/${encodeURIComponent(id)}`}
                className="block rounded-xl overflow-hidden bg-slate-900/80 border border-slate-700 hover:border-blue-500/50 transition"
              >
                <div className="aspect-video bg-slate-800 relative">
                  {data.sequential_diagram_steps?.[0]?.image_path ? (
                    <img
                      src={encodeURI(data.sequential_diagram_steps[0].image_path)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Video className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-slate-100">{data.technique_name}</h2>
                  {data.portuguese_name && (
                    <p className="text-sm text-slate-400">Also known as (Portuguese): {data.portuguese_name}</p>
                  )}
                  {data.difficulty && (
                    <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      {data.difficulty}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
