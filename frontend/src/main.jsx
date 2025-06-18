import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router"
import { ClerkProvider } from "@clerk/clerk-react"
import { ptBR } from "@clerk/localizations"
import { dark } from '@clerk/themes'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} localization={ptBR} appearance={{
    baseTheme: dark,
    variables: {
      colorPrimary: '#f84565',
      colorText: '#ffffff',
      colorTextOnPrimaryBackground: "#ffffff",
    }

  }}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>

)
