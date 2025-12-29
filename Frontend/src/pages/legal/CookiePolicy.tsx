import React from 'react'

const CookiePolicy: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString()
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 prose prose-lg mt-20">
      <h1>Cookie Policy</h1>
      <p className="text-sm text-gray-600">Last Updated: {lastUpdated}</p>

      <section>
        <h2>What are Cookies?</h2>
        <p>
          Cookies are small text files placed on your device to help websites remember information about your visit. UniMart
          uses cookies to provide core functionality and to improve your experience.
        </p>
      </section>

      <section>
        <h2>How We Use Cookies</h2>
        <p>
          We use cookies for authentication, to remember preferences, and for analytics. Third-party services used by UniMart may
          also set cookies as described in their policies.
        </p>
      </section>

      <section>
        <h2>Managing Cookies</h2>
        <p>
          You can control cookies through your browser settings. Disabling cookies may affect your ability to use certain
          features of UniMart.
        </p>
      </section>
    </main>
  )
}

export default CookiePolicy
