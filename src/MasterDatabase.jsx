// import React from 'react'
import { useNavigate } from 'react-router-dom'

function MasterDatabase() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Master Client Database</h1>
      <button
        onClick={() => navigate(-1)}
        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
      >
        Back
      </button>
    </div>
  )
}

export default MasterDatabase
