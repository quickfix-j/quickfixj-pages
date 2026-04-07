import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'overview',
        'installation',
        'configuration',
        'tutorials',
        'examples',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: false,
      items: [
        'architecture',
        'use-cases',
        {
          type: 'link',
          label: 'Threading Model (Technical Reference)',
          href: 'https://github.com/quickfix-j/quickfixj/blob/master/docs/threading-model.md',
        },
      ],
    },
    {
      type: 'category',
      label: 'Developer Guide',
      collapsed: false,
      items: [
        'developer-docs',
        'repeating-groups',
        'user-defined-fields',
        'validation',
        {
          type: 'link',
          label: 'Threading Developer Guide',
          href: 'https://github.com/quickfix-j/quickfixj/blob/master/docs/threading-developer-guide.md',
        },
      ],
    },
    {
      type: 'category',
      label: 'Advanced Topics',
      collapsed: false,
      items: [
        'acceptor-dynamic',
        'acceptor-failover',
        'secure-communications',
        'jmx',
        'charset',
        'codegen',
        'mina-filters',
        'deep-tech-reference',
      ],
    },
  ],
};

export default sidebars;
