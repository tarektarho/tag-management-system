import React from "react"

// Custom loader
const Loading = () => {
  return (
    <div className="w-full h-screen flex justify-center">
      <span data-testid="loader" className="loading loading-infinity loading-lg"></span>
    </div>
  )
}

export default Loading
