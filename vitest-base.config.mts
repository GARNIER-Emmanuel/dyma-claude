import { defineConfig } from 'vitest/config';

// JobView has no environment-based backend. Tests must not load local secrets.
export default defineConfig({
  envDir: false,
  // Angular constructs an independent Vitest project; apply this there as well.
  plugins: [{ name: 'jobview-tests-without-env-files', config: () => ({ envDir: false }) }],
});
