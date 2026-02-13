import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hero4Job",
    short_name: "Hero4Job",
    description: "Build, preview, and download a professional CV in minutes.",
    start_url: "/",
    display: "standalone",
    icons: [
      {
        src: "/hero4job-logo.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
  };
}
