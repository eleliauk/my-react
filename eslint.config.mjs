import globals from "globals";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"], // 适用文件类型
    languageOptions: {
      parser: tsparser, // 使用 TypeScript 解析器
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules, // 推荐 JS 规则
      ...tseslint.configs.recommended.rules, // 推荐 TS 规则
      "prettier/prettier": "error", // 启用 Prettier 检查
      "no-case-declarations": "off",
      "no-constant-condition": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-var-requires": "off",
      "no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.ts"], // 仅 TypeScript 文件的规则
  },
];