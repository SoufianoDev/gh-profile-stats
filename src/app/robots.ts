import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/card", "/api/badge", "/api/visits"],
      },
    ],
    sitemap: "https://gh-profile-stats.netlify.app/sitemap.xml",
  };
}
