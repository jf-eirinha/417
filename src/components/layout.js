import React from "react"
import { Link } from "gatsby"
import Bio from "./bio"

const Layout = ({ title, summary, children }) => {
  return (
    <>
      <header className='header'>
        <p className='summary'>{summary}</p>
        <h1>
          <Link className='blog-title' to={`/`} >
            {title}
          </Link>
        </h1>
        <Bio />
      </header>
      <main className='articles'>{children}</main>
    </>
  )
}

export default Layout
