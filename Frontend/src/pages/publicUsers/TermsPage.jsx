import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import route from "../../utils/routes";

const NAV_ITEMS = [
  { id: "terms", label: "Terms of Service" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "cookies", label: "Cookie Policy" },
];

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
      {title}
    </h2>
    <div className="text-sm text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const SubSection = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="text-sm font-semibold text-gray-800 mb-2">{title}</h3>
    <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
  </div>
);

const List = ({ items }) => (
  <ul className="mt-2 space-y-1">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState("terms");
  const navigate = useNavigate();
  const location = useLocation();

  // If opened in a new tab, window.history.length === 1, so we navigate to signup instead
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(route.Signup);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-blue-900 text-base">Thrump Fix</span>
          </div>
          <button
            onClick={handleBack}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        </div>

        {/* Tab nav */}
        <div className="max-w-4xl mx-auto px-4 border-b border-gray-200">
          <div className="flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  borderBottom: activeTab === item.id ? "2px solid #2563eb" : "2px solid transparent",
                  color: activeTab === item.id ? "#2563eb" : "#9ca3af",
                  marginBottom: "-1px",
                }}
                className="px-4 py-3 text-xs font-semibold tracking-wide transition-all hover:text-gray-600 bg-transparent"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Page title */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-1">Legal</p>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {activeTab === "terms" && "Terms of Service"}
            {activeTab === "privacy" && "Privacy Policy"}
            {activeTab === "cookies" && "Cookie Policy"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">Effective Date: February 2026 · Last Updated: February 2026</p>
        </div>

        {/* ── TERMS OF SERVICE ── */}
        {activeTab === "terms" && (
          <div>
            <Section title="1. Introduction">
              <p>Welcome to Thrump Fix. We operate a web-based digital marketplace that connects individuals and businesses seeking plumbing services ("Users") with independent plumbing professionals ("Plumbers") within the Federal Republic of Nigeria.</p>
              <p>By accessing or using the Thrump Fix Platform, you agree to be bound by these Terms of Service. If you do not agree, you must discontinue use immediately.</p>
            </Section>

            <Section title="2. Nature of the Platform">
              <p>Thrump Fix is a technology intermediary platform only. We do not provide plumbing services. Plumbers are independent contractors and not employees, agents, or partners of Thrump Fix.</p>
              <List items={[
                "We do not supervise, control, or direct the services provided by Plumbers.",
                "All service agreements are solely between Users and Plumbers.",
                "Thrump Fix disclaims liability for service performance, workmanship, or disputes between parties.",
              ]} />
            </Section>

            <Section title="3. Eligibility">
              <p>To use the Platform, you must:</p>
              <List items={[
                "Be at least 20 years old",
                "Have legal capacity under Nigerian law",
                "Provide accurate and complete registration information",
                "Upload a clear and recent profile photograph to access core Platform features",
              ]} />
              <p className="mt-3">We reserve the right to suspend or terminate accounts that provide false or misleading information.</p>
            </Section>

            <Section title="4. Account Registration & Security">
              <p>You are responsible for maintaining the confidentiality of your login credentials, all activities under your account, and promptly notifying us of any unauthorized access.</p>
              <p>Thrump Fix may suspend accounts suspected of fraud, abuse, or security threats.</p>
            </Section>

            <Section title="5. User Obligations">
              <p>Users agree to:</p>
              <List items={[
                "Provide accurate job descriptions",
                "Upload lawful and relevant media",
                "Use the Platform for legitimate service requests only",
                "Not harass, threaten, or abuse Plumbers",
                "Not bypass or attempt to bypass Platform payment systems",
              ]} />
            </Section>

            <Section title="6. Plumber Obligations">
              <p>Plumbers agree to:</p>
              <List items={[
                "Provide truthful and accurate professional information",
                "Perform services with reasonable care and skill",
                "Comply with Nigerian laws and applicable safety standards",
                "Maintain required certifications and licenses where applicable",
                "Communicate pricing transparently",
                "Maintain an accurate and current profile photograph",
              ]} />
            </Section>

            <Section title="7. Plumber Verification & Trust Framework">
              <p>Thrump Fix implements structured verification measures to promote safety and reduce fraud risk. However, verification does not guarantee service quality.</p>

              <SubSection title="7.1 Identity Verification (KYC)">
                <p>Before accepting jobs, Plumbers may be required to provide government-issued identification, a verified phone number and email address, and a selfie or live verification confirmation where applicable.</p>
              </SubSection>

              <SubSection title="7.2 Business & Professional Verification">
                <p>Where applicable, Plumbers may be required to provide business registration documentation, trade certifications, technical qualifications, and tax identification information.</p>
              </SubSection>

              <SubSection title="7.3 Profile Transparency">
                <p>Verified profiles may display verification badges, years of experience, service categories, ratings and reviews, job completion statistics, and response time metrics.</p>
              </SubSection>

              <SubSection title="7.4 Ratings & Reviews">
                <p>Only Users who complete jobs through the Platform may submit reviews. Fake, manipulated, or incentivized reviews are prohibited. Thrump Fix reserves the right to moderate or remove reviews.</p>
              </SubSection>

              <SubSection title="7.5 Limitation of Verification">
                <p>Verification reduces but does not eliminate risk. Thrump Fix does not insure or guarantee service performance. Final service decisions remain between Users and Plumbers.</p>
              </SubSection>
            </Section>

            <Section title="8. Payments, Fees & Subscriptions">
              <SubSection title="8.1 Platform Fees">
                <p>Thrump Fix may charge subscription fees, commission per completed job, and transaction processing fees. All applicable fees will be disclosed before payment.</p>
              </SubSection>
              <SubSection title="8.2 Free Trial Policy">
                <p>Where offered, trial duration will be specified during signup. A paid subscription begins automatically unless cancelled before expiration.</p>
              </SubSection>
              <SubSection title="8.3 Payment Processing">
                <p>Payments are processed via secure third-party providers. Thrump Fix does not store full debit or credit card details.</p>
              </SubSection>
              <SubSection title="8.4 Refund Policy">
                <p>Refunds may be granted in cases of service non-performance, fraud, or platform technical errors. Refund determinations are made at our reasonable discretion.</p>
              </SubSection>
            </Section>

            <Section title="9. Dispute Resolution">
              <p>Thrump Fix may facilitate communication between parties but is not responsible for service dissatisfaction, property damage, personal injury, or financial losses resulting from services rendered.</p>
            </Section>

            <Section title="10. Acceptable Use Policy">
              <p>You must not engage in fraud or harassment, upload illegal content, attempt unauthorized access, reverse engineer platform systems, scrape data, or circumvent platform payment systems. Violations may result in immediate suspension.</p>
            </Section>

            <Section title="11. Intellectual Property">
              <p>All Platform software, branding, and content belong to Thrump Fix. Users retain ownership of uploaded content but grant Thrump Fix a limited license to use such content for service delivery and platform improvement.</p>
            </Section>

            <Section title="12. Limitation of Liability">
              <p>To the fullest extent permitted by Nigerian law, Thrump Fix shall not be liable for indirect or consequential damages, loss of profits, service-related damages or injuries, or acts or omissions of independent Plumbers.</p>
              <p className="mt-2">Total liability shall not exceed the amount paid to Thrump Fix in the preceding three (3) months.</p>
            </Section>

            <Section title="13. Indemnification">
              <p>Users and Plumbers agree to indemnify and hold Thrump Fix harmless from claims, damages, or expenses arising from misuse of the Platform, breach of these Terms, or service disputes.</p>
            </Section>

            <Section title="14. Account Suspension & Termination">
              <p>We may suspend or terminate accounts for fraud or misrepresentation, security threats, policy violations, or legal compliance requirements. Termination may occur without prior notice where necessary.</p>
            </Section>

            <Section title="15. Governing Law & Jurisdiction">
              <p>These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be subject to the exclusive jurisdiction of Nigerian courts.</p>
            </Section>

            <Section title="16. Amendments">
              <p>We may update these Terms periodically. Continued use of the Platform constitutes acceptance of revised Terms.</p>
            </Section>
          </div>
        )}

        {/* ── PRIVACY POLICY ── */}
        {activeTab === "privacy" && (
          <div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-sm text-blue-700">
              This Privacy Policy is compliant with the <span className="font-semibold">Nigeria Data Protection Act 2023 (NDPA 2023)</span>.
            </div>

            <Section title="1. Data Collected">
              <p>We may collect and process the following personal data:</p>
              <List items={[
                "Full name and profile photograph",
                "Email address and phone number",
                "Location data (during active jobs only)",
                "Uploaded images and videos",
                "Payment transaction records and subscription history",
                "Device and usage data (IP address, browser type, log files)",
              ]} />
            </Section>

            <Section title="2. Legal Basis for Processing">
              <p>We process personal data under one or more of the following lawful bases under the NDPA 2023:</p>
              <List items={[
                "Contractual necessity — to provide and manage services",
                "Legal obligations — to comply with applicable laws",
                "Legitimate interests — to improve security and prevent fraud",
                "Consent — where explicit consent is required (e.g., marketing)",
              ]} />
              <p className="mt-2">Where consent is relied upon, you may withdraw it at any time.</p>
            </Section>

            <Section title="3. Location Data">
              <p>Location data is used solely for service matching and active job tracking. It is disabled automatically upon job completion and retained only as reasonably necessary for operational, security, or legal purposes.</p>
            </Section>

            <Section title="4. Data Sharing & Disclosure">
              <p>We do not sell personal data. Data may be shared with:</p>
              <List items={[
                "Assigned Plumbers (for service fulfillment)",
                "Payment processors",
                "Cloud hosting and technology service providers",
                "Law enforcement or regulatory authorities where legally required",
              ]} />
              <p className="mt-2">All third-party service providers are required to maintain appropriate data protection standards.</p>
            </Section>

            <Section title="5. Data Subject Rights (NDPA 2023)">
              <p>Under the Nigeria Data Protection Act 2023, you have the right to:</p>
              <List items={[
                "Request access to your personal data",
                "Request correction of inaccurate data",
                "Request deletion (subject to legal limitations)",
                "Withdraw consent where processing is based on consent",
                "Request data portability where applicable",
                "Object to certain forms of processing",
              ]} />
              <p className="mt-3">To exercise these rights, contact us at <span className="text-blue-600 font-medium">thrumpfix@yahoo.com</span></p>
            </Section>

            <Section title="6. Data Security">
              <p>Thrump Fix implements appropriate safeguards including:</p>
              <List items={[
                "TLS/SSL encryption",
                "Encrypted storage systems",
                "Secure password hashing",
                "Role-Based Access Control (RBAC)",
                "Activity monitoring and logging",
                "Incident detection and response procedures",
              ]} />
              <p className="mt-2">While we implement strong safeguards, no online system is completely secure.</p>
            </Section>

            <Section title="7. Children's Privacy">
              <p>The Platform is not intended for individuals under 20 years of age. We do not knowingly collect personal data from minors. If such data is identified, it will be deleted promptly.</p>
            </Section>

            <Section title="8. International Data Transfers">
              <p>Where personal data is transferred outside Nigeria, we ensure appropriate safeguards are in place in compliance with NDPA 2023 requirements.</p>
            </Section>

            <Section title="9. Data Retention">
              <p>We retain personal data only for as long as necessary to fulfill contractual obligations, comply with legal or regulatory requirements, resolve disputes, and enforce agreements. When data is no longer required, it is securely deleted or anonymized.</p>
            </Section>

            <Section title="10. Contact">
              <p>For questions about this Privacy Policy or your personal data:</p>
              <p className="mt-2 font-medium text-gray-800">Thrump Fix</p>
              <p className="text-blue-600">thrumpfix@yahoo.com</p>
            </Section>
          </div>
        )}

        {/* ── COOKIE POLICY ── */}
        {activeTab === "cookies" && (
          <div>
            <Section title="Use of Cookies">
              <p>Thrump Fix uses cookies and similar technologies for the following purposes:</p>
              <List items={[
                "Secure session management",
                "Fraud prevention",
                "User authentication",
                "Preference storage",
                "Platform performance analytics",
              ]} />
            </Section>

            <Section title="Cookie Security Attributes">
              <p>Authentication cookies use the following security attributes to protect your session:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Secure", "HttpOnly", "SameSite"].map((attr) => (
                  <span key={attr} className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
                    {attr}
                  </span>
                ))}
              </div>
            </Section>

            <Section title="Managing Cookies">
              <p>Users may manage or disable cookies through their browser settings. Please note that disabling certain cookies may affect Platform functionality, including your ability to stay logged in or complete bookings.</p>
            </Section>

            <Section title="Changes to this Policy">
              <p>We may update this Cookie Policy from time to time. Updates will be published on the Platform with a revised effective date. Continued use of the Platform after updates constitutes acceptance of the revised Policy.</p>
            </Section>

            <Section title="Contact">
              <p>If you have questions about our use of cookies:</p>
              <p className="mt-2 font-medium text-gray-800">Thrump Fix</p>
              <p className="text-blue-600">thrumpfix@yahoo.com</p>
            </Section>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            By using the Thrump Fix Platform, you confirm that you have read, understood, and agree to be legally bound by these terms.
          </p>
          <p className="text-xs text-gray-300 mt-1">© {new Date().getFullYear()} Thrump Fix · Federal Republic of Nigeria</p>

          {/* Back to Signup — useful when opened in a new tab */}
          <button
            onClick={handleBack}
            className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Done — Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
}
