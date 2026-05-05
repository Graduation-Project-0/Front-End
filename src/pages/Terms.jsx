import React, { useEffect } from "react";
import Footer from "../components/Footer";

const PAGE_TITLE = "Terms of Service — Vanguard";
const PAGE_DESCRIPTION =
  "Vanguard's Terms of Service - Read our terms and conditions for using our antivirus services.";

const muted = "text-gray-400 leading-relaxed";
const heading2 =
  "text-2xl font-semibold mt-8 mb-4 text-white";
const list =
  "mb-4 inline-block text-left list-disc pl-6 space-y-1 " + muted;

export default function Terms() {
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
        <div className="mx-auto max-w-[800px] px-6 py-12 text-center md:py-16">
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-white md:text-[2.5rem]">
            Terms of Service
          </h1>

          <div className={muted}>
            <p className="mb-6">
              <strong className="text-white">Last updated: March 2026</strong>
            </p>

            <h2 className={heading2}>1. Acceptance of Terms</h2>
            <p className="mb-4">
              By downloading, installing, or using Vanguard antivirus software,
              you agree to be bound by these Terms of Service. If you do not
              agree to these terms, please do not use our services.
            </p>

            <h2 className={heading2}>2. Description of Service</h2>
            <p className="mb-4">
              Vanguard provides cybersecurity solutions including but not
              limited to:
            </p>
            <ul className={list}>
              <li>Real-time malware detection and removal</li>
              <li>URL and email threat scanning</li>
              <li>Firewall protection</li>
              <li>VPN services</li>
              <li>Password management</li>
              <li>Cloud-based threat intelligence</li>
            </ul>

            <h2 className={heading2}>3. Subscription and Payment</h2>
            <p className="mb-4">
              Our services are provided on a subscription basis. By subscribing,
              you agree to:
            </p>
            <ul className={list}>
              <li>Pay the selected subscription fees (monthly or annual)</li>
              <li>Auto-renewal unless cancelled 24 hours before renewal</li>
              <li>
                Refund policy as outlined in our 30-day money-back guarantee
              </li>
              <li>Price changes with 30 days notice</li>
            </ul>

            <h2 className={heading2}>4. License and Restrictions</h2>
            <p className="mb-4">
              Vanguard grants you a limited, non-exclusive, non-transferable
              license to use our software. You agree NOT to:
            </p>
            <ul className={list}>
              <li>Reverse engineer, decompile, or disassemble the software</li>
              <li>Sublicense, rent, or lease the software</li>
              <li>Use the software for illegal purposes</li>
              <li>Attempt to bypass security measures</li>
              <li>Redistribute or modify the software</li>
            </ul>

            <h2 className={heading2}>5. Disclaimer of Warranties</h2>
            <p className="mb-4">
              THE SOFTWARE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF
              ANY KIND. WE DO NOT WARRANT THAT THE SOFTWARE WILL BE UNINTERRUPTED
              OR ERROR-FREE. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM
              ALL WARRANTIES, EXPRESS OR IMPLIED.
            </p>

            <h2 className={heading2}>6. Limitation of Liability</h2>
            <p className="mb-4">
              IN NO EVENT SHALL VANGUARD BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT
              LIMITATION, LOSS OF PROFITS, DATA, OR GOODWILL.
            </p>

            <h2 className={heading2}>7. Termination</h2>
            <p className="mb-4">
              We may terminate your access to the service for any reason,
              including violation of these terms. Upon termination, you must
              destroy all copies of the software.
            </p>

            <h2 className={heading2}>8. Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with
              the laws of the State of California, without regard to its
              conflict of law provisions.
            </p>

            <h2 className={heading2}>9. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="mb-4">
              <strong className="text-white">Email:</strong>{" "}
              legal@vanguard.example
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
