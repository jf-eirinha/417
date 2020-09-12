import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
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
      <Link className='link-container margin-top custom-link' to='/about'>
        <AboutIcon className='icon' />
        <div className='icon-link' >
          About
        </div>
      </Link>
      <div className='link-container margin-top'>
        <GithubIcon className='icon' />
        <a className='icon-link custom-link' target='_blank' rel='noreferrer' href={`https://github.com/${social.github}`}>
          Github
        </a>
      </div>
    </div>
  )
}

export default Bio
