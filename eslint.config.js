import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginVue from "eslint-plugin-vue";

export default [
  ...eslintPluginVue.configs["flat/strongly-recommended"],
  {
    plugins: {
      import: eslintPluginImport,
      "simple-import-sort": eslintPluginSimpleImportSort,
    },
    ignores: ["node_modules/*", "dist/*", "*.min.js", "assets/*"],
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/no-duplicates": "error",
      "no-console": ["error", { allow: ["info", "warn", "error"] }],
      "no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
      "vue/max-attributes-per-line": "off",
      "vue/valid-v-slot": "off",
      "vue/no-side-effects-in-computed-properties": "warn",
      "vue/require-v-for-key": "off",
      "vue/valid-v-for": "off",
      "vue/no-mutating-props": "warn",
    },
  },
  eslintConfigPrettier,
];
