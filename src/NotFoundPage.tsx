import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page not found.</p>
      <Link
        to="/mortgage-clients"
        className="text-blue-600 hover:underline text-lg"
      >
        Go back to homepage
      </Link>
    </div>
  )
}
