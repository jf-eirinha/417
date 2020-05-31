module.exports = {
  siteMetadata: {
    title: `Status Code 417`,
    author: {
      name: `JFE`,
      summary: `Hello! Dis my blog:`,
    },
    description: `A starter blog demonstrating what Gatsby can do.`,
    siteUrl: `https://www.statuscode417.com/`,
    social: {
      github: `john-law`,
    },
  },
  plugins: [
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets/
        }
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Status Code 417`,
        short_name: `417`,
        start_url: `/`,
        background_color: `#DAD7E3`,
        theme_color: `#2A2A2C`,
        icon: `content/assets/bug-icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
  ],
}
