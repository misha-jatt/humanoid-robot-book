import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const lightCodeTheme = prismThemes.github;
const darkCodeTheme = prismThemes.dracula;

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'A comprehensive textbook on humanoid robotics and embodied AI',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://misha-jatt.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // Use '/' for local dev, '/humanoid-robot-book' for GitHub Pages
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'misha-jatt', // Usually your GitHub org/user name.
  projectName: 'humanoid-robot-book', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  clientModules: [
    require.resolve('./src/clientModules/injectChat.js'),
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/misha-jatt/humanoid-robot-book/tree/main",
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Physical AI & Humanoid Robotics',
        logo: {
          alt: 'Humanoid Robotics Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'modulesSidebar',
            position: 'left',
            label: 'Modules',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Modules',
            items: [
              {
                label: 'Module 1: ROS 2',
                to: '/docs/module1-ros2',
              },
              {
                label: 'Module 2: Digital Twin',
                to: '/docs/module-02-digital-twin',
              },
              {
                label: 'Module 3: NVIDIA Isaac',
                to: '/docs/modules/module-3-ai-robot-brain/overview',
              },
              {
                label: 'Module 4: Vision-Language-Action',
                to: '/docs/modules/module-4-vla',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['python', 'bash', 'yaml', 'json'],
      },
    }),
};

module.exports = config;
