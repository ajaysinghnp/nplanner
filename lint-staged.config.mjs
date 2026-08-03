const lintStagedConfig = {
  "!(*.{test,spec}).{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{test,spec}.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write", "pnpm test:staged --"],
  "*.{json,css,md,mdx,yml,yaml}": ["prettier --write"],
};

export default lintStagedConfig;
