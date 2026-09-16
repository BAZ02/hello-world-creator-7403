import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

const GOOGLE_TTS_LOCALES: Record<string, string> = {
  fr: "fr-FR",
  ar: "ar-XA",
  en: "en-US",
  tr: "tr-TR",
  pt: "pt-PT",
  es: "es-ES",
  prs: "ps-AF",
  fa: "fa-IR",
  ru: "ru-RU",
  uk: "uk-UA",
  ku: "ar-XA",
  krl: "tr-TR",
  zh: "cmn-CN",
};

type TtsRuntimeEnv = {
  VITE_TTS_API_KEY?: string;
  VITE_TTS_MOCK_AUDIO_URL?: string;
};

function getTtsRuntimeEnv(env: unknown): TtsRuntimeEnv {
  const runtimeEnv = env && typeof env === "object" ? env as TtsRuntimeEnv : {};
  const processEnv = (globalThis as typeof globalThis & {
    process?: { env?: TtsRuntimeEnv };
  }).process?.env;
  return {
    VITE_TTS_API_KEY: runtimeEnv.VITE_TTS_API_KEY || processEnv?.VITE_TTS_API_KEY,
    VITE_TTS_MOCK_AUDIO_URL: runtimeEnv.VITE_TTS_MOCK_AUDIO_URL || processEnv?.VITE_TTS_MOCK_AUDIO_URL,
  };
}

async function handleTtsRequest(request: Request, env: unknown): Promise<Response> {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let payload: { text?: unknown; language?: unknown };
  try {
    payload = await request.json() as { text?: unknown; language?: unknown };
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = typeof payload.text === "string" ? payload.text.trim() : "";
  const language = typeof payload.language === "string" ? payload.language : "fr";
  if (!text || text.length > 5000) {
    return Response.json({ error: "Text must contain between 1 and 5000 characters" }, { status: 400 });
  }

  const runtimeEnv = getTtsRuntimeEnv(env);
  if (runtimeEnv.VITE_TTS_MOCK_AUDIO_URL) {
    const mockResponse = await fetch(runtimeEnv.VITE_TTS_MOCK_AUDIO_URL);
    if (mockResponse.ok) {
      return new Response(mockResponse.body, {
        headers: { "content-type": mockResponse.headers.get("content-type") || "audio/mpeg", "cache-control": "no-store" },
      });
    }
  }

  if (!runtimeEnv.VITE_TTS_API_KEY) {
    return Response.json({ error: "TTS is not configured" }, { status: 503 });
  }

  const googleResponse = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(runtimeEnv.VITE_TTS_API_KEY)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: GOOGLE_TTS_LOCALES[language] || "fr-FR", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    }),
  });

  if (!googleResponse.ok) {
    console.error("Google Cloud TTS request failed", googleResponse.status);
    return Response.json({ error: "Cloud TTS request failed" }, { status: 502 });
  }

  const result = await googleResponse.json() as { audioContent?: string };
  if (!result.audioContent) return Response.json({ error: "Cloud TTS returned no audio" }, { status: 502 });
  const audioBytes = Uint8Array.from(atob(result.audioContent), (character) => character.charCodeAt(0));
  return new Response(audioBytes, {
    headers: { "content-type": "audio/mpeg", "cache-control": "no-store" },
  });
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      if (new URL(request.url).pathname === "/api/tts") {
        return await handleTtsRequest(request, env);
      }
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
