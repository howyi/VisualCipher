import type { GatsbyConfig } from 'gatsby'

const config: GatsbyConfig = {
  // pathPrefix: '/VisualCipher',
  siteMetadata: {
    title: `VisualCipher`,
    // siteUrl: `https://howyi.github.io/VisualCipher/`,
    siteUrl: `https://visualcipher.sbox.studio`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-postcss',
    {
      resolve: 'gatsby-plugin-use-dark-mode',
      options: {
        classNameDark: 'dark',
        classNameLight: 'light',
        storageKey: 'dark',
        minify: true,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        icon: `static/logo.png`,
        name: `VisualCipher`,
        short_name: `VisualCipher`,
        description: `The application does cool things and makes your life better.`,
        start_url: `/`,
        background_color: `#020817FF`,
        theme_color: `#020817FF`,
        display: `standalone`,
      },
    },
  ],
}

export default config
