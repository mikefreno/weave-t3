import Navbar from "@/src/components/Navbar";
import Head from "next/head";
import Link from "next/link";
import { useRef } from "react";

export default function PrivacyPolicy() {
  const switchRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div className="bg-zinc-100 dark:bg-zinc-900">
        <Head>
          <title>Privacy Policy | Weave</title>
          <meta name="description" content="Weave's Privacy Policy" />
        </Head>
        <Navbar switchRef={switchRef} />
        <div className="min-h-screen px-[8vw] py-[8vh]">
          <div className="py-4 text-xl">Weave&apos;s Privacy Policy</div>
          <div className="py-2">Last Updated: March 23rd</div>
          <div className="py-2">
            At Weave, the privacy of our visitors is of the utmost importance to us. This Privacy Policy document
            contains types of information collected and recorded by Weave, and how we use it.
          </div>
          <ol>
            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">1.</span> Information We Collect
              </div>
              <div className="pl-4">
                <div className="pb-2">
                  <div className="-ml-6">(a) Personal Information:</div> We may collect personal information from you
                  when you voluntarily provide it, for example, when you register on our site, or fill out a form.
                  Personal information may include, but is not limited to:
                  <ul>
                    <li className="list-disc">Name</li>
                    <li className="list-disc">Email</li>
                  </ul>
                </div>
                <div className="pb-2">
                  <div className="-ml-6">(b) Non-personal Information:</div> We may collect non-personal information
                  about you when you interact with our website. Non-personal information may include
                  <ul>
                    <li className="list-disc">browser type</li>
                    <li className="list-disc">operating system</li>
                  </ul>
                </div>
                <div className="pb-2">
                  <div className="-ml-6">(c) Cookies and Web Beacons:</div> Like any other website, Weave uses
                  &apos;cookies&apos; to store information about visitors&apos; preferences, to record user-specific
                  information on which pages the site visitor accesses or visits, and to personalize or customize our
                  web page content based on visitors&apos; browser type or other information that the visitor sends via
                  their browser.
                </div>
              </div>
            </div>
            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">2.</span>How We Use Your Information
              </div>
              <div className="text-lg">We use the information we collect in various ways, including:</div>
              <div className="pl-8">
                <ul>
                  <li className="list-disc">To provide and maintain our website</li>
                  <li className="list-disc">To improve, personalize, and expand our website</li>
                  <li className="list-disc">To understand and analyze how you use our website</li>
                  <li className="list-disc">To develop new products, services, features, and functionality</li>
                  <li className="list-disc">To send you emails</li>
                  <li className="list-disc">To find and prevent fraud</li>
                </ul>
              </div>
            </div>
            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">3.</span>Sharing Your Information
              </div>
              We will not share any user information with any outside party, except to comply with legal requirements,
              ie. A warrant from law enforcement.
            </div>
            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">4.</span>Children&apos;s Information
              </div>
              Weave does not knowingly collect any personally identifiable information from children under the age of
              13. If you think that your child provided this kind of information on our website or used this service in
              any way, we strongly encourage you to contact us immediately, and we will do our best to promptly remove
              such information from our records.
            </div>
            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">5.</span>Changes to This Privacy Policy
              </div>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page. Changes to this Privacy Policy are effective when they are posted on this
              page.
            </div>
            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">6.</span>
                If you have any questions about what is contained here please contact by:
              </div>
              <div className="pl-6">
                <li className="list-disc">Emailing michael@freno.me</li>
                <li className="list-disc">
                  Or by going{" "}
                  <Link href="/contact" className="underline-offset-4 hover:underline">
                    here
                  </Link>
                </li>
              </div>
            </div>
          </ol>
        </div>
      </div>
    </>
  );
}
