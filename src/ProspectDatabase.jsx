// import React from 'react'
import { useNavigate } from 'react-router-dom'

function ProspectDatabase() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Prospect Database</h1>
      <button
        onClick={() => navigate("/mortgage-clients")}
        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
      >
        Back
      </button>
    </div>
  )
}

export default ProspectDatabase
