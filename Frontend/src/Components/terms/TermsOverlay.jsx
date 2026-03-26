import Logo from "../../assets/Logo.svg?react";
export default function TermsOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <Logo/>
            </div>
            <span className="font-bold text-blue-900 text-base">Thrump Fix</span>
          </div>
          <button onClick={onClose} className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4 w-full">
        <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-1">Legal</p>
        <h1 className="text-2xl font-extrabold text-gray-900">Terms, Privacy &amp; Cookie Policy</h1>
        <p className="text-sm text-gray-400 mt-1">Effective Date: February 2026 · Last Updated: February 2026</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-4 w-full">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10 space-y-10 text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide mb-6 pb-2 border-b border-gray-100">Thrump Fix — Terms of Service</h2>
            <div className="space-y-7">
              <section><h3 className="font-extrabold text-gray-900 mb-1">1. Introduction</h3><p>Welcome to Thrump Fix ("THRUMP FIX," "we," "our," or "us"). Thrump Fix is a web-based digital marketplace that connects individuals and businesses seeking plumbing services ("Users") with independent plumbing professionals ("Plumbers") within the Federal Republic of Nigeria.</p><p className="mt-2">By accessing or using the Thrump Fix website and related services (the "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must discontinue use immediately.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">2. Nature of the Platform</h3><ul className="list-disc pl-5 space-y-1"><li>Thrump Fix is a technology intermediary platform only.</li><li>We do not provide plumbing services.</li><li>Plumbers are independent contractors and not employees, agents, or partners of Thrump Fix.</li><li>We do not supervise, control, or direct the services provided by Plumbers.</li><li>All service agreements are solely between Users and Plumbers.</li><li>Thrump Fix disclaims liability for service performance, workmanship, or disputes between parties.</li></ul></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">3. Eligibility</h3><p>To use the Platform, you must be at least 20 years old, have legal capacity under Nigerian law, and provide accurate and complete registration information.</p><p className="mt-2">As part of account activation, all Users and Plumbers are required to upload a clear and recent profile photograph. Access to core Platform features may be restricted until this requirement is fulfilled.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">4. Account Registration &amp; Security</h3><p>You are responsible for maintaining the confidentiality of your login credentials, all activities under your account, and promptly notifying us of unauthorized access.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">5. User Obligations</h3><ul className="list-disc pl-5 space-y-1"><li>Provide accurate job descriptions.</li><li>Upload lawful and relevant media.</li><li>Use the Platform for legitimate service requests only.</li><li>Not harass, threaten, or abuse Plumbers.</li><li>Not bypass or attempt to bypass Platform payment systems.</li></ul></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">6. Plumber Obligations</h3><ul className="list-disc pl-5 space-y-1"><li>Provide truthful and accurate professional information.</li><li>Perform services with reasonable care and skill.</li><li>Comply with Nigerian laws and applicable safety standards.</li><li>Maintain required certifications and licenses where applicable.</li><li>Communicate pricing transparently.</li></ul></section>
              <section><h3 className="font-extrabold text-gray-900 mb-2">7. Plumber Verification &amp; Trust Framework</h3><p className="mb-3">Thrump Fix implements structured verification measures to promote safety and reduce fraud risk. However, verification does not guarantee service quality.</p><div className="space-y-4 pl-1"><div><h4 className="font-bold text-gray-800 mb-1">7.1 Identity Verification (KYC)</h4><p>Before accepting jobs, Plumbers may be required to provide government-issued identification, a verified phone number and email address, and selfie or live verification confirmation where applicable.</p></div><div><h4 className="font-bold text-gray-800 mb-1">7.2 Business &amp; Professional Verification</h4><p>Where applicable, Plumbers may be required to provide business registration documentation, trade certifications, technical qualifications, and tax identification information.</p></div><div><h4 className="font-bold text-gray-800 mb-1">7.3 Profile Transparency</h4><p>Verified profiles may display verification badges, years of experience, service categories, ratings and reviews, job completion statistics, and response time metrics.</p></div><div><h4 className="font-bold text-gray-800 mb-1">7.4 Ratings &amp; Reviews</h4><p>Only Users who complete jobs through the Platform may submit reviews. Fake or manipulated reviews, incentivized reviews, and harassment via reviews are prohibited.</p></div><div><h4 className="font-bold text-gray-800 mb-1">7.5 Ongoing Monitoring</h4><p>We may monitor for repeated complaints, suspicious activity patterns, payment circumvention attempts, and unusual cancellation behavior.</p></div><div><h4 className="font-bold text-gray-800 mb-1">7.6 Complaints &amp; Investigation</h4><p>Users may submit complaints concerning poor workmanship, fraud or misconduct, or safety concerns. Thrump Fix may temporarily suspend accounts, review communications and logs, and remove accounts where necessary.</p></div><div><h4 className="font-bold text-gray-800 mb-1">7.7 Limitation of Verification</h4><p>Verification reduces but does not eliminate risk. Thrump Fix does not insure or guarantee service performance.</p></div></div></section>
              <section><h3 className="font-extrabold text-gray-900 mb-2">8. Payments, Fees &amp; Subscriptions</h3><div className="space-y-4 pl-1"><div><h4 className="font-bold text-gray-800 mb-1">8.1 Platform Fees</h4><p>Thrump Fix may charge subscription fees (including free trials), commission per completed job, and transaction processing fees. All applicable fees will be disclosed before payment.</p></div><div><h4 className="font-bold text-gray-800 mb-1">8.2 Free Trial Policy</h4><p>Where offered, trial duration will be specified during signup. Paid subscription begins automatically unless cancelled before expiration.</p></div><div><h4 className="font-bold text-gray-800 mb-1">8.3 Payment Processing</h4><p>Payments are processed via secure third-party providers compliant with financial regulations. Thrump Fix does not store full debit or credit card details.</p></div><div><h4 className="font-bold text-gray-800 mb-1">8.4 Refund Policy</h4><p>Refunds may be granted in cases of service non-performance, fraud, or platform technical errors.</p></div></div></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">9. Dispute Resolution</h3><p>Thrump Fix may facilitate communication between parties but is not responsible for service dissatisfaction, property damage, personal injury, or financial losses resulting from services rendered.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">10. Acceptable Use Policy</h3><p>You must not engage in fraud or harassment, upload illegal content, attempt unauthorized access, reverse engineer platform systems, scrape data, or circumvent platform payment systems. Violations may result in immediate suspension.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">11. Intellectual Property</h3><p>All Platform software, branding, and content belong to Thrump Fix. Users retain ownership of uploaded content but grant Thrump Fix a limited license to use such content for service delivery and platform improvement.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">12. Limitation of Liability</h3><p>To the fullest extent permitted by Nigerian law, Thrump Fix shall not be liable for indirect or consequential damages, loss of profits, service-related damages or injuries, or acts or omissions of independent Plumbers. Total liability shall not exceed the amount paid to Thrump Fix in the preceding three (3) months.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">13. Indemnification</h3><p>Users and Plumbers agree to indemnify and hold Thrump Fix harmless from claims, damages, or expenses arising from misuse of the Platform, breach of these Terms, or service disputes.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">14. Account Suspension &amp; Termination</h3><p>We may suspend or terminate accounts for fraud or misrepresentation, security threats, policy violations, or legal compliance requirements. Termination may occur without prior notice where necessary.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">15. Governing Law &amp; Jurisdiction</h3><p>These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be subject to the exclusive jurisdiction of Nigerian courts.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">16. Amendments</h3><p>We may update these Terms periodically. Continued use of the Platform constitutes acceptance of revised Terms.</p></section>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide mb-6 pb-2 border-b border-gray-100">Thrump Fix — Privacy Policy</h2>
            <p className="mb-5 text-xs text-gray-400 font-medium">Compliant with Nigeria Data Protection Act 2023 · Effective Date: February 2026</p>
            <div className="space-y-7">
              <section><h3 className="font-extrabold text-gray-900 mb-1">1. Data Collected</h3><p>We may collect: name, email, phone number, location data (during active jobs), uploaded images/videos, payment transaction records, and device and usage data.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">2. Legal Basis for Processing</h3><p>We process personal data under contractual necessity, legal obligations, legitimate interests, and user consent where required.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">3. Location Data</h3><p>Location data is used for matching and active job tracking, disabled automatically upon job completion, and retained only as necessary.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">4. Data Sharing</h3><p>We do not sell personal data. Data may be shared with assigned Plumbers, payment processors, hosting providers, and law enforcement where legally required.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">5. Data Subject Rights (NDPA 2023)</h3><p>Users may request access, correction, deletion, withdrawal of consent, and data portability where applicable. Requests may be sent to our contact email below.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">6. Data Security</h3><p>We implement TLS encryption, encrypted storage, secure password hashing, Role-Based Access Control, monitoring and logging, and incident response procedures.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">7. Children's Privacy</h3><p>The Platform is not intended for individuals under 20 years of age.</p></section>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Cookie Policy</h2>
            <p>Thrump Fix uses cookies for secure session management, fraud prevention, and preference storage. Authentication cookies use Secure, HttpOnly, and SameSite attributes. Users may manage cookies via browser settings.</p>
          </div>

          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Contact Information</h2>
            <p>Thrump Fix · Federal Republic of Nigeria<br />Email:{" "}<a href="mailto:thrumpfix@yahoo.com" className="text-blue-600 font-semibold hover:underline">thrumpfix@yahoo.com</a></p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-10 w-full flex justify-center mt-4">
        <button onClick={onClose} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Done — Back to Signup
        </button>
      </div>
    </div>
  );
}