"use client";

import { useRef, useCallback, useState } from "react";
import type { Technique } from "@/app/lib/techniques";

type Props = {
  techniqueId: string;
  data: Technique;
  videoSrc: string;
  /** Optional URL to English subtitles (VTT). Used when video audio is not in English. */
  subtitleSrc?: string | null;
};

export function TechniqueBreakdown({ techniqueId, data, videoSrc, subtitleSrc }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const steps = data.sequential_diagram_steps ?? [];

  const seekTo = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = seconds;
    video.play().catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-xl overflow-hidden bg-slate-900 ring-1 ring-slate-700">
        {videoError ? (
          <div className="w-full aspect-video flex items-center justify-center text-slate-400 text-sm">
            Video not found. Add <code className="text-slate-300">public/videos/{techniqueId}.mp4</code> and refresh.
          </div>
        ) : (
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            className="w-full aspect-video"
            preload="metadata"
            playsInline
            onError={() => setVideoError(true)}
          >
            {subtitleSrc && (
              <track kind="subtitles" src={subtitleSrc} srcLang="en" label="English" default />
            )}
          </video>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Step-by-step</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <button
              key={i}
              type="button"
              onClick={() => seekTo(step.timestamp_seconds ?? 0)}
              className="text-left rounded-lg overflow-hidden bg-slate-800/80 hover:bg-slate-700/80 ring-1 ring-slate-600 hover:ring-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {step.image_path ? (
                <img
                  src={encodeURI(step.image_path)}
                  alt={step.label}
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <div className="w-full aspect-video bg-slate-700 flex items-center justify-center text-slate-400 text-sm">
                  Step {i + 1}
                </div>
              )}
              <div className="p-3">
                <div className="font-medium text-blue-400 text-sm">{step.label}</div>
                <div className="text-slate-400 text-xs line-clamp-2">{step.detail}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {(data.enrichment?.diagram_images?.length ?? data.enrichment?.diagram_urls?.length) ? (
        <div>
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Reference diagrams</h2>
          {data.enrichment?.diagram_images?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {data.enrichment.diagram_images.map((img, i) => (
                <figure key={i} className="rounded-lg overflow-hidden bg-slate-800/80 ring-1 ring-slate-600">
                  <a href={img.url} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                      src={img.url}
                      alt={img.caption ?? "Reference diagram"}
                      className="w-full aspect-video object-contain bg-slate-900"
                    />
                  </a>
                  {(img.caption || img.source) && (
                    <figcaption className="p-2 text-slate-400 text-sm">
                      {img.caption}
                      {img.source && (
                        <span className="block mt-0.5 text-slate-500 text-xs">
                          Source: {img.source}
                        </span>
                      )}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          ) : null}
          {data.enrichment?.diagram_urls?.length ? (
            <ul className="space-y-1 text-sm text-slate-400">
              <li className="font-medium text-slate-300">More links</li>
              {data.enrichment.diagram_urls.map((url, i) => (
                <li key={i}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
