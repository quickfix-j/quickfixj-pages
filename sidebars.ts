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
        'deep-tech-reference',
      ],
    },
  ],
};

export default sidebars;
