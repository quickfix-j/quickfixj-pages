import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'QuickFIX/J',
  tagline: 'The Open Source FIX Protocol Engine for Java',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url: 'https://quickfixj.org', // Placeholder URL
  baseUrl: process.env.BASE_URL || '/',

  organizationName: 'quickfix-j',
  projectName: 'quickfixj',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/quickfix-j/quickfixj-pages/edit/main/',
        },
        blog: false, // Disabling blog for a purely technical docs site
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/quickfixj-social-card.jpg',
    announcementBar: {
      id: 'quickfixj_news',
      content:
        '⚡ QuickFIX/J — The industry standard open source FIX engine for Java. <a target="_blank" rel="noopener noreferrer" href="https://github.com/quickfix-j/quickfixj">Star us on GitHub</a>',
      isCloseable: true,
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'QuickFIX/J',
      logo: {
        alt: 'QuickFIX/J Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/docs/architecture',
          label: 'Core Concepts',
          position: 'left',
        },
        {
          to: '/docs/developer-docs',
          label: 'Developer Guide',
          position: 'left',
        },
        {
          to: '/docs/acceptor-dynamic',
          label: 'Advanced Topics',
          position: 'left',
        },
        {
          href: 'https://github.com/quickfix-j/quickfixj',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'Overview',
              to: '/docs/overview',
            },
            {
              label: 'Architecture',
              to: '/docs/architecture',
            },
            {
              label: 'Configuration',
              to: '/docs/configuration',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Mailing List',
              href: 'https://sourceforge.net/p/quickfixj/mailman/',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/quickfixj',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/quickfix-j/quickfixj',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} QuickFIX/J Contributors. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'properties', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
