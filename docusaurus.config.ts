import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {Plugin} from 'unified';
import type {Node} from 'unist';
import type {Root} from 'mdast';

const VERSION_PLACEHOLDER = '{{QUICKFIXJ_VERSION}}';
const VERSION_FALLBACK = '3.0.0';

async function fetchLatestVersion(fallback: string): Promise<string> {
  try {
    const response = await fetch(
      'https://api.github.com/repos/quickfix-j/quickfixj/releases/latest',
      {headers: {'User-Agent': 'quickfixj-pages-docusaurus'}},
    );
    if (!response.ok) {
      console.warn(`GitHub API returned ${response.status}, using fallback version ${fallback}`);
      return fallback;
    }
    const data = (await response.json()) as {tag_name: string};
    return data.tag_name.replace(/^v/, '');
  } catch (err) {
    console.warn(`Failed to fetch latest QuickFIX/J version: ${err}. Using fallback ${fallback}`);
    return fallback;
  }
}

// Remark plugin that replaces {{QUICKFIXJ_VERSION}} in all markdown text,
// inline-code, and fenced-code-block nodes at build time.
function versionReplacerPlugin(version: string): Plugin<[], Root> {
  return () => (tree: Root) => {
    function walk(node: Node & {value?: string; children?: Node[]}) {
      if (
        ['text', 'inlineCode', 'code'].includes(node.type) &&
        typeof node.value === 'string'
      ) {
        node.value = node.value.replaceAll(VERSION_PLACEHOLDER, version);
      }
      if (Array.isArray(node.children)) {
        node.children.forEach(walk);
      }
    }
    walk(tree);
  };
}

export default async function createConfig(): Promise<Config> {
  const quickfixjVersion = await fetchLatestVersion(VERSION_FALLBACK);

  return {
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

    customFields: {
      quickfixjVersion,
    },

    presets: [
      [
        'classic',
        {
          docs: {
            sidebarPath: './sidebars.ts',
            editUrl: 'https://github.com/quickfix-j/quickfixj-pages/edit/main/',
            remarkPlugins: [versionReplacerPlugin(quickfixjVersion)],
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
          srcDark: 'img/logo-dark.png',
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
}
