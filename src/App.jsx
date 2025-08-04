import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './dashboard'
import ClientDetailPage from "./ClientPage"
import SignInPage from './SignIn'


function App() {
 
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/mortgage-clients"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/clients/:id" element={<ClientDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
