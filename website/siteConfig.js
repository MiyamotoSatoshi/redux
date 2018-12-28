/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: "React Redux", // Title for your website.
  tagline: "Official React bindings for Redux",
  url: "https://react-redux.js.org", // Your website URL
  baseUrl: "/",
  docsUrl : "",
  algolia: {
    apiKey: '2d058d216b7fd5d68d481fd48ee72c06',
    indexName: 'react-redux',
    algoliaOptions: {}
  },

  // Used for publishing and more
  projectName: "react-redux",
  organizationName: "reduxjs",
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: "introduction/quick-start", label: "Quick Start" },
    { doc: "using-react-redux/connect-mapstate", label: "Using React Redux"},
    { doc: "api/connect", label: "API" },
    { href : "https://www.github.com/reduxjs/react-redux", label : "Github"},
    { href: "/introduction/quick-start#help-and-discussion", label: "Need help?" },
  ],

  /* path to images for header/footer */
  headerIcon: "img/redux_white.svg",
  footerIcon: "img/redux_white.svg",
  favicon: "img/favicon/favicon.ico",

  /* Colors for website */
  colors: {
    primaryColor: "#764ABC",
    secondaryColor: "#40216F",
    accentColor1: "#717171",
    accentColor2: "#F3EAFF",
    accentColor3: "#D2B9F3",
    accentColor4: "#ECF4F9",
    accentColor5: "#CBDDEA",
    accentColor6: "#2F5773"
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: 'Copyright (c) 2015-present Dan Abramov and the Redux documentation authors.',

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: "monokai"
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    "/scripts/sidebarScroll.js",
    "/scripts/codeblock.js",
    "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js",
    "https://buttons.github.io/buttons.js",
  ],


  enableUpdateTime: true,
  // On page navigation for the current documentation page.
  onPageNav: "separate",
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: "img/redux-logo-landscape.png",
  twitterImage: "img/redux-logo-twitter.png",

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: "https://github.com/reduxjs/react-redux",
  
  gaTrackingId : "UA-130598673-2",
};

module.exports = siteConfig;
