const path = require('path')
const nextPwa = require('next-pwa')

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  reactStrictMode: false,
  optimizeFonts: false,
  staticPageGenerationTimeout: 200,
  images: {
    domains: [
      'www.themoviedb.org',
      'kovkert.ru',
      'https://cdnmedia.220-volt.ru',
      'i.ibb.co',
      '8c115720-a33a-4064-bbcc-68604da2242f.selstorage.ru'
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }]
    })

    return config
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  async headers() {
    return [
      {
        source: '/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json'
          }
        ]
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|mp4|ttf|otf|woff|woff2)',
        headers: [{
          key: 'cache-control',
          value: 'public, max-age=31536000, immutable'
        }]
      }
    ]
  }
}

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs')

const withPWA = nextPwa({
  dest: 'public',
  register: true
})

module.exports = withPWA(
  withSentryConfig(
    module.exports,
    {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      // Suppresses source map uploading logs during build
      silent: true,
      org: 'kovkert',
      project: 'kovkert-shop',
      url: 'https://sentry.kovkert.ru'
    },
    {
      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Transpiles SDK to be compatible with IE11 (increases bundle size)
      transpileClientSDK: true,

      // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
      tunnelRoute: '/monitoring',

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Enables automatic instrumentation of Vercel Cron Monitors.
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true
    }
  )
)
