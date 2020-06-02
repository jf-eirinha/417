import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Share from "../components/share"

import BackIcon from '../../content/assets/back-icon.svg'
import ShareIcon from '../../content/assets/share-icon.svg'

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const siteSummary = data.site.siteMetadata.author.summary
  const [open, toggle] = React.useReducer(v => !v, false)

  return (
    <Layout location={location} title={siteTitle} summary={siteSummary}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article>
        <header>
          <h1>{post.frontmatter.title}</h1>
          <small>{post.frontmatter.date}</small>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <footer>
          <Link className='link-container' to='/'>
            <BackIcon className='icon' />
            <div className='footer-icon-link'>
              Back to posts
            </div>
          </Link>
          <button className='link-container margin-left' onClick={toggle}>
            <ShareIcon className='icon' />
            <div className='footer-icon-link'>
              Share
            </div>
          </button>
          {open && <Share />}
        </footer>
      </article>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author {
          name
          summary
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
