import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "/src/styles/functions" as *; 
        `,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    include: ['**/*.test.tsx', '**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'node_modules',
        'dist',
        'types',
        '**/config.*',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.types.*',
        '**/consts.*',
        '**/constants.*',
        '**/*.test.tsx',
        '**/*.test.ts',
        'src/setupTests.ts',
        'src/main.tsx',
        'src/index.tsx',
        '**/index.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
