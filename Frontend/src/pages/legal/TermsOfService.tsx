import React from 'react'

const TermsOfService: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString()
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 prose prose-lg">
      <h1>Terms of Service</h1>
      <p className="text-sm text-gray-600">Last Updated: {lastUpdated}</p>

      <section>
        <h2>Introduction</h2>
        <p>
          Welcome to UniMart, the University of Ibadan marketplace connecting students and local vendors. These Terms of Service
          govern your access to and use of UniMart's website and services. By using UniMart, you agree to these terms.
        </p>
      </section>

      <section>
        <h2>Use of Service</h2>
        <p>
          You may use UniMart for lawful purposes only. You agree not to misuse the services, interfere with other users, or
          attempt to access restricted areas of the platform.
        </p>
      </section>

      <section>
        <h2>Accounts</h2>
        <p>
          When creating an account you must provide accurate information. You are responsible for maintaining the confidentiality
          of your account credentials and for all activity that occurs under your account.
        </p>
      </section>

      <section>
        <h2>Vendor Listings & Transactions</h2>
        <p>
          UniMart provides a platform for vendors to list goods and services. UniMart is not a party to transactions between
          buyers and vendors and does not guarantee the quality, safety or legality of items sold by vendors.
        </p>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          To the extent permitted by law, UniMart and its affiliates will not be liable for indirect, incidental or consequential
          damages arising from your use of the service.
        </p>
      </section>

      <section>
        <h2>Governing Law</h2>
        <p>These Terms are governed by the laws applicable to the University of Ibadan jurisdiction.</p>
      </section>
    </main>
  )
}

export default TermsOfService
