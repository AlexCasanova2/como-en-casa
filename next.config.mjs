import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
    './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['three', '@supabase/supabase-js', '@supabase/ssr'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'domqqachgkbklefgoalq.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
};

export default withNextIntl(nextConfig);
