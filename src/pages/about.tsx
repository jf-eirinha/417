import React from "react"
import Layout from "../components/layout"
import { PageProps, graphql } from "gatsby"
import SEO from "../components/seo"

type Data = {
  site: {
    siteMetadata: {
      title: string
      author: {
        name: string
        summary: string
      }
    }
  }
}

const About = ({ data }: PageProps<Data>) => {
  const siteTitle = data.site.siteMetadata.title
  const siteSummary = data.site.siteMetadata.author.summary

  return (
    <Layout title={siteTitle} summary={siteSummary}>
      <SEO title="About" />
      <section>
        <ul>
          <li className='about-item'>
            Engineer.
          </li>
          <li className='about-item'>
            Based in Lisbon.
          </li>
          <li className='about-item'>
            Currently building Web Apps.
          </li>
          <li className='about-item'>
            Worked in Private Equity and IB in a former life, now I'm back at building things.
          </li>
          <li className='about-item'>
            Interests include: Web Development, Machine Learning, Finance.
          </li>
          <li className='about-item'>
            Proud owner of the best dog in the world.
          </li>
        </ul>
      </section>
    </Layout>
  )
}

export default About

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        author {
          name
          summary
        }
      }
    }
  }
`
