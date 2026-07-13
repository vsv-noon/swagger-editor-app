import path from 'path';

import createNextIntlPlugin from 'next-intl/plugin';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `@use "@/styles/functions" as *;`,
    includePaths: [path.join(__dirname, 'styles')],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
