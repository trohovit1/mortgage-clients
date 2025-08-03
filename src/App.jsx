import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './dashboard'
import ClientDetailPage from "./Client_Page"
// import MasterDatabase from './MasterDatabase'
import SignInPage from './SignIn' // Optional custom component


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
        {/* <Route path="/mortgage-clients/master-database" element={<MasterDatabase />} /> */}
        {/* Optional custom sign-in route */}
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/clients/:id" element={<ClientDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
