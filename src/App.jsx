import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import MasterDatabase from './MasterDatabase'
import CurrentClients from './CurrentClients'
import ProspectDatabase from './ProspectDatabase'
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
        <Route path="/mortgage-clients/master-database" element={<MasterDatabase />} />
        <Route path="/mortgage-clients/current-clients" element={<CurrentClients />} />
        <Route path="/mortgage-clients/prospect-database" element={<ProspectDatabase />} />
        {/* Optional custom sign-in route */}
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
