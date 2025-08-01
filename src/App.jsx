import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './dashboard' // Your protected content
import SignInPage from './sign-in' // Optional custom component

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
        {/* Optional custom sign-in route */}
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
