import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Kept as `virtual:docs-kit` so the one existing consumer (the Transmog docs
// site) migrates with a dependency swap rather than an edit to every entry
// point. It is an internal module id, not a public interface.
const virtualId = "virtual:docs-kit";
const resolvedId = `\0${virtualId}`;

/**
 * Build a docs bundle from a manifest.
 *
 * `root` is the docs-site directory (where `docs.json` and `src/` live).
 * `repoRoot` is the repository root used to resolve page files.
 */
export function docsKit(options = {}) {
  const root = resolve(options.root || process.cwd());
  const repoRoot = resolve(options.repoRoot || resolve(root, ".."));
  const manifestPath = resolve(root, options.manifest || "docs.json");
  const audienceEnv = options.audienceEnv || "DOCS_AUDIENCE";
  const defaultAudience = options.defaultAudience || "public";
  const virtual = options.virtualId || virtualId;
  const resolved = options.virtualId ? `\0${options.virtualId}` : resolvedId;
  // Read the manifest once, at config time: the set of declared audiences
  // decides both the build mode and what the runtime is allowed to switch
  // between. A manifest with one audience has no split to build.
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const declaredAudiences = [
    ...new Set(manifest.navigation.map((group) => group.audience || "public")),
  ];
  const singleAudience =
    declaredAudiences.length === 1 ? declaredAudiences[0] : null;
  const requested = (process.env[audienceEnv] || defaultAudience).toLowerCase();
  if (!singleAudience && !["public", "internal"].includes(requested)) {
    throw new Error(`${audienceEnv} must be public or internal, got ${requested}`);
  }
  const audience = singleAudience || requested;

  return {
    name: "andes",
    config() {
      return {
        define: {
          __DOCS_INTERNAL__: JSON.stringify(audience === "internal"),
        },
      };
    },
    resolveId(id) {
      return id === virtual ? resolved : null;
    },
    load(id) {
      if (id !== resolved) return null;
      const navigation = singleAudience
        ? manifest.navigation
        : manifest.navigation.filter(
            (group) => audience === "internal" || group.audience === "public",
          );
      const content = {};
      for (const group of navigation) {
        for (const page of group.pages) {
          content[page.slug] = readFileSync(resolve(repoRoot, page.file), "utf8");
        }
      }
      const docs = {
        name: manifest.name,
        description: manifest.description,
        buildAudience: audience,
        navigation,
      };
      return `export default ${JSON.stringify({ docs, content })};`;
    },
    handleHotUpdate(context) {
      if (!context.file.endsWith(".md") && context.file !== manifestPath) {
        return;
      }
      context.server.ws.send({ type: "full-reload" });
      return [];
    },
  };
}

export default docsKit;
