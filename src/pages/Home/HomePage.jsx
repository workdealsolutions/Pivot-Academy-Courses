import React from "react"
import { AuthForm } from "../../components/Auth/AuthForm"
import { Features } from "../../components/Features/Features"
import styles from "./Home.module.css"

export function HomePage() {
  return (
    <div className={styles.home}>
      <div className={styles.homeContainer}>
        <div className={styles.greetingSection}>
          <h1>Welcome to LearnHub</h1>
          <p className={styles.introText}>
            Your journey to excellence starts here. Join our community of learners
            and unlock your full potential with our expert-led courses.
          </p>
        </div>
        <div className={styles.contentWrapper}>
          <Features />
          <div className={styles.authContainer}>
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  )
}
