import React from "react"
import { BookMarked, Target, AlignCenterVertical } from "lucide-react"
import "./Feature.css"
export function Feature({ icon, title, description }) {
  const Icon = {
    BookMarked,
    Target,
    AlignCenterVertical,
  }[icon]

  return (
    <div className="feature">
      <div className="feature-icon">
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

