/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: [
        'introduction/getting-started',
        'introduction/building-with-detox',
        'introduction/writing-first-test',
        'introduction/preparing-for-ci',
        'introduction/debugging'
      ]
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guide/parallel-test-execution',
        'guide/genymotion-saas',
        'guide/taking-screenshots',
        'guide/mocking',
        'guide/launch-args',
        'guide/mocking-open-with-url',
        'guide/mocking-user-notifications',
        'guide/mocking-user-activity',
        'guide/developing-while-writing-tests',
        'guide/android-dev-env',
        'guide/proguard-configuration',
        'guide/uninstalling',
      ]
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: [
        'troubleshooting/building-the-app',
        'troubleshooting/running-tests',
        'troubleshooting/synchronization',
        'troubleshooting/flakiness',
      ]
    },
    {
      type: 'doc',
      id: 'guide/migration',
    },
    {
      type: 'doc',
      label: 'Contributing',
      id: 'guide/contributing'
    },
  ],
  apiSidebar: [
    {
      type: 'category',
      label: 'Command Line Interface',
      items: [
        'cli/overview',
        'cli/init',
        'cli/build',
        'cli/test',
        'cli/recorder',
        'cli/build-framework-cache',
        'cli/clean-framework-cache',
        'cli/rebuild-framework-cache',
        'cli/reset-lock-file',
        'cli/run-server',
      ]
    },
    {
      type: 'category',
      label: 'Config file',
      items: [
        'config/overview',
        'config/devices',
        'config/apps',
        'config/artifacts',
        'config/behavior',
        'config/logger',
        'config/session',
        'config/testRunner',
      ]
    },
    {
      type: 'category',
      label: 'Client API',
      items: [
        'api/device',
        'api/matchers',
        'api/actions',
        'api/expect',
        'api/logger',
      ]
    },
    'api/internals',
    {
      type: 'category',
      label: 'Tech Articles',
      items: [
        'articles/design-principles',
        'articles/how-detox-works',
        'articles/third-party-drivers',
      ]
    },
  ]
};

module.exports = sidebars;