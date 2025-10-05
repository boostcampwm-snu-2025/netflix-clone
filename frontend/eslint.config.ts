import css from "@eslint/css";
import js from "@eslint/js";
import markdown from "@eslint/markdown";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/", "node_modules/"]),
  { extends: ["js/recommended"], files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.browser }, plugins: { js } },
  tseslint.configs.recommended,
  { extends: ["markdown/recommended"], files: ["**/*.md"], language: "markdown/gfm", plugins: { markdown } },
  { extends: ["css/recommended"], files: ["**/*.css"], language: "css/css", plugins: { css } },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], ...perfectionist.configs["recommended-natural"] },
]);
