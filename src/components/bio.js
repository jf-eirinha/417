import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import AboutIcon from '../../content/assets/about-icon.svg'
import GithubIcon from '../../content/assets/github-icon.svg'

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          social {
            github
          }
        }
      }
    }
  `)

  const { social } = data.site.siteMetadata
  return (
    <div className='bio-link'>
      <div className='link-container'>
        <AboutIcon className='icon' />
        <a className='icon-link' href={`/about`}>
          About
        </a>
      </div>
      <div className='link-container'>
        <GithubIcon className='icon' />
        <a className='icon-link' target='_blank' rel='noreferrer' href={`https://github.com/${social.github}`}>
          Github
        </a>
      </div>
    </div>
  )
}

export default Bio
