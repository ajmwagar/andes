import { mountDocs } from "@ajmwagar/andes";
import bundle from "virtual:docs-kit";

mountDocs(bundle, {
  brand: { name: "Andes", mark: "A", badge: "Docs" },
  repo: __DOCS_INTERNAL__
    ? {
        url: "https://github.com/ajmwagar/andes",
        blobBase: "https://github.com/ajmwagar/andes/blob/main",
        rawBase: "https://raw.githubusercontent.com/ajmwagar/andes/main",
      }
    : {},
  defaultSlug: "introduction",
  storageKey: "andes-example",
  audience: {
    labels: { public: "Public", internal: "Internal" },
    scopes: { public: "Published pages", internal: "Everything, including drafts" },
  },
});
