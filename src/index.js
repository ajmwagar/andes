//! andes — the FPL documentation theme.
//!
//! andes is intentionally a runtime, not a docs framework. The consumer
//! supplies `docs.json` plus Markdown and the Vite plugin supplies the bundle.
//! Renderers that are not Vite apps (the wiki daemon) import `theme.css` and
//! keep their own shell.
export { mountDocs } from "./runtime.js";
import "./style.css";
