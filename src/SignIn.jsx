// src/SignInPage.jsx
import { SignIn } from '@clerk/clerk-react'

const SignInPage = () => (
  <div style={{ marginTop: '100px', textAlign: 'center' }}>
    <SignIn path="/sign-in" routing="path" />
  </div>
)

export default SignInPage
