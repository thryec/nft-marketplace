import '../styles/globals.css'
import Link from 'next/Link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav>
        <div style={navbarStyle}>
          <Link href="/">
            <a style={linkStyle}>🌈 Creators' Corner</a>
          </Link>
          <Link href="/create">
            <a style={linkStyle}>🎨 Create</a>
          </Link>
        </div>
      </nav>
      <div>
        <Component {...pageProps} />
      </div>
    </div>
  )
}

const linkStyle = {
  marginRight: 40,
}

const navbarStyle = {
  margin: 40,
}

export default MyApp
