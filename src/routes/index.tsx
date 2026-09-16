import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const EspaceStagiaires = lazy(() => import("../components/espace-stagiaires.jsx"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Espace Stagiaires — Règles, documents et suivi" },
      {
        name: "description",
        content:
          "Espace multilingue pour les stagiaires : règlement signé, documents chiffrés, suivi quotidien et espace formateur.",
      },
      { name: "theme-color", content: "#16324F" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Espace Stagiaires" },
      { property: "og:title", content: "Espace Stagiaires" },
      {
        property: "og:description",
        content:
          "Règlement, documents et suivi quotidien pour les stagiaires, en 13 langues.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <EspaceStagiaires />
    </Suspense>
  );
}
