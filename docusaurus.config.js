// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
require('dotenv').config()

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Codex',
  tagline: 'Codex is building a Decentralized Durability Engine',
  url: 'https://codex.storage',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  customFields: {
    ghostAPiKey: process.env.GHOST_API_KEY,
  },

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'status-im', // Usually your GitHub org/user name.
  projectName: 'codex-nim', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: '',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: { sidebar: { hideable: true } },
      metadata: [
        { name: 'keywords', content: 'codex, storage' },
        {
          name: 'description',
          content: 'Codex is building a Decentralized Durability Storage',
        },
        { name: 'image', content: 'img/codex-preview-image.png' },
      ],
      colorMode: {
        disableSwitch: true,
      },
      navbar: {
        title: '',
        logo: {
          alt: 'Codex',
          src: 'img/logo.svg',
          height: 26,
          width: 24,
        },
        items: [
          {
            to: 'blog',
            label: 'Blog',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        logo: {
          alt: 'Codex',
          src: 'img/logo.svg',
          href: '/',
          width: 22,
        },
        links: [
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: '4qdQN5JaWW',
              },
              {
                label: 'Twitter',
                href: 'codexstorage',
              },
            ],
          },
        ],
        copyright: `Codex, ${new Date().getFullYear()}`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  plugins: [
    'docusaurus-plugin-sass',
    [
      '@acid-info/docusaurus-search-local',
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        docsRouteBasePath: '/',
      },
    ],
  ],
}

module.exports = config
