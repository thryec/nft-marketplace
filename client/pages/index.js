import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div style={bodyStyle}>
      <h1>Welcome to Creators' Corner</h1>
    </div>
  )
}

const bodyStyle = {
  margin: 40,
}
