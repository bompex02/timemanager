import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
    '@pinia/nuxt',
    'nuxt-svgo',
    'nuxt-toast'
  ],
  ssr: false,
  // auto import paths
  imports: {
    dirs: [
      'types/**',
      'stores/**',
    ],
  },
  devtools: { enabled: true },
  // app configuraton
  app: {
    pageTransition: { name: 'page-fade', mode: 'out-in' },
  },
  css: [
    // custom css files
    './app/assets/css/main.css',
    './app/assets/css/tailwind.css',
  ],
  // runtime configuration
  runtimeConfig: {
    public: {
      baseApiUrl: process.env.BASE_API_URL || 'http://localhost:8080',
    },
  },
  // plugins
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  // eslint configurations
  eslint: {
    config: {
      stylistic: true,
    },
  },
  toast: {
    settings: {
      position: 'topRight'
    }
  },
  // i18n (multilanguage) configurations
  i18n: {
    defaultLocale: 'en',
    strategy: 'no_prefix',
    locales: [
      { code: 'en', name: 'English', file: 'en.yml' },
      { code: 'de', name: 'Deutsch', file: 'de.yml' },
    ],
  },
  // pinia store configurations
  pinia: {
    storesDirs: ['./app/stores/**'],
  },
  // svgo configurations
  svgo: {
    autoImportPath: false,
    global: false,
    defaultImport: 'component',
    svgoConfig: {
      plugins: [
        {
          // this is required for tailwind classes on svg files
          name: 'prefixIds',
          params: {
            prefixClassNames: false,
          },
        },
      ],
    },
  },
  alias: {
  '@shared/types': '../shared/types/src/index.ts', 
  '@shared': '../shared/types/src'
  }
})