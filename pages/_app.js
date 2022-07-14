import '../styles/globals.css'
import { Connect } from "@stacks/connect-react"

function MyApp({ Component, pageProps }) {
  return (
    <Connect>
      <Component {...pageProps} />
    </Connect>
  )
}

export default MyApp
