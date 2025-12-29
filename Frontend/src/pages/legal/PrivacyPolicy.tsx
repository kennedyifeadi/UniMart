import React from 'react'

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString()
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 prose prose-lg mt-20">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-gray-600">Last Updated: {lastUpdated}</p>

      <section>
        <h2>Overview</h2>
        <p>
          UniMart is committed to protecting the privacy of our users. This Privacy Policy explains what information we collect,
          how we use it, and your choices regarding that information.
        </p>
      </section>

      <section>
        <h2>Information We Collect</h2>
        <p>
          We may collect information you provide directly (such as account details), information about your use of the service,
          and aggregated usage data. We may also collect contact details and profile information for vendors and buyers.
        </p>
      </section>

      <section>
        <h2>How We Use Information</h2>
        <p>
          We use information to operate, maintain, and improve UniMart, to communicate with users, and to provide customer
          support. We may also use data for analytics and to enforce our policies.
        </p>
      </section>

      <section>
        <h2>Sharing & Disclosure</h2>
        <p>
          We do not sell personal information. We may share information with service providers and as required by law. Vendor
          listings are visible to other users as part of the marketplace functionality.
        </p>
      </section>

      <section>
        <h2>Your Choices</h2>
        <p>
          You can access and update your account information and opt out of certain communications. For questions about privacy,
          contact UniMart support.
        </p>
      </section>
    </main>
  )
}

export default PrivacyPolicy
