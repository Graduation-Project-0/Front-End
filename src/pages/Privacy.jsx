import React, { useEffect } from "react";
import Footer from "../components/Footer";

const PAGE_TITLE = "Privacy Policy — Vanguard";
const PAGE_DESCRIPTION =
  "Vanguard's Privacy Policy - Learn how we protect your data and privacy.";

const muted = "text-gray-400 leading-relaxed";
const heading2 =
  "text-2xl font-semibold mt-8 mb-4 text-white";
const list =
  "mb-4 inline-block text-left list-disc pl-6 space-y-1 " + muted;

export default function Privacy() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = PAGE_TITLE;

    let meta = document.querySelector('meta[name="description"]');
    const created = !meta;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    const prevDesc = meta.getAttribute("content") ?? "";
    meta.setAttribute("content", PAGE_DESCRIPTION);

    return () => {
      document.title = prevTitle;
      if (created) meta.remove();
      else meta.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <>
      <main className="min-h-screen bg-black text-white pt-8 pb-4">
        <div className="mx-auto max-w-[800px] px-6 py-12  md:py-16">
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-white md:text-[2.5rem]">
            Privacy Policy
          </h1>

          <div className={muted}>
            <p className="mb-6">
              <strong className="text-white">Last updated: March 2026</strong>
            </p>

            <h2 className={heading2}>1. Introduction</h2>
            <p className="mb-4">
              At Vanguard, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our antivirus software and services.
            </p>

            <h2 className={heading2}>2. Information We Collect</h2>
            <p className="mb-4">
              We collect information to provide better services to all our
              users. This includes:
            </p>
            <ul className={list}>
              <li>Personal information (name, email, payment details)</li>
              <li>Device information (hardware model, operating system)</li>
              <li>Security-related data (threat detections, scan results)</li>
              <li>Usage data (features used, performance metrics)</li>
            </ul>

            <h2 className={heading2}>3. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className={list}>
              <li>Provide and maintain our security services</li>
              <li>Detect and prevent malware, threats, and security risks</li>
              <li>Improve and personalize your user experience</li>
              <li>Communicate with you about product updates and support</li>
              <li>Process transactions and send related information</li>
            </ul>

            <h2 className={heading2}>4. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access,
              alteration, disclosure, or destruction. Our security measures
              include:
            </p>
            <ul className={list}>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>ISO 27001 and SOC 2 certified infrastructure</li>
            </ul>

            <h2 className={heading2}>5. Data Sharing</h2>
            <p className="mb-4">
              We do not sell your personal information. We may share your data
              with:
            </p>
            <ul className={list}>
              <li>Service providers who assist us in operating our platform</li>
              <li>Legal authorities when required by law</li>
              <li>
                Security partners for threat intelligence (anonymized data only)
              </li>
            </ul>

            <h2 className={heading2}>6. Your Rights</h2>
            <p className="mb-4">
              Under GDPR and other privacy regulations, you have the right to:
            </p>
            <ul className={list}>
              <li>Access your personal data</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Data portability</li>
            </ul>

            <h2 className={heading2}>7. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <p className="mb-4">
              <strong className="text-white">Email:</strong>{" "}
              privacy@vanguard.example
              <br />
              <strong className="text-white">Address:</strong> 123 Security
              Street, Cyber City, CA 94000
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
