import Navbar from "@/src/components/Navbar";
import Head from "next/head";
import { useRef } from "react";

const TermsOfService = () => {
  const switchRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900">
      <Head>
        <title>ToS | Weave</title>
        <meta name="description" content="Weave's ToS" />
      </Head>
      <Navbar switchRef={switchRef} />
      <div className="min-h-screen py-[8vh] px-[8vw]">
        <div className="pb-10 text-center text-3xl">Weave Terms of Service</div>
        <div className="text-2xl">Welcome to Weave!</div>
        <div className="py-4 text-lg">
          By accessing or using our website, you agree to be bound by the
          following terms of service.
          <div>Please read them carefully.</div>
        </div>
        <ul>
          <li>
            <div className="text-xl underline underline-offset-4">Overview</div>
            <p className="w-[80vw] pl-4 pt-2 md:w-[65vw]">
              Weave is a group chatting and networking that allows users to
              communicate over text and voice. By using our website, you agree
              to these terms of service.
            </p>
          </li>
          <li>
            <div className="text-xl underline underline-offset-4">
              User Conduct
            </div>
            <p className="w-[80vw] pl-4 pt-2 md:w-[65vw]">
              You agree to use our website responsibly and not to engage in any
              of the following activities: Posting or transmitting any unlawful,
              threatening, abusive, harassing, defamatory, vulgar, obscene, or
              profane content. Engaging in any activity that is illegal or
              promotes illegal conduct. Spamming, phishing, or otherwise
              attempting to deceive other users. Misrepresenting yourself or
              your affiliation with any person or entity. Uploading any content
              that infringes upon any intellectual property rights.
            </p>
          </li>
          <li>
            <div className="text-xl underline underline-offset-4">
              User Content
            </div>
            <p className="w-[80vw] pl-4 pt-2 md:w-[65vw]">
              Weave is not for use of those under the age of 13, by using Weave
              you acknowledge this and affirm that you are above the age of 13.
              Additionally by posting or uploading any content to our website,
              you grant Weave a non-exclusive, perpetual, irrevocable,
              worldwide, royalty-free license to use, copy, modify, create
              derivative works based on, distribute, publicly display, publicly
              perform, and otherwise exploit in any manner such content in all
              formats and distribution channels now known or hereafter devised.
            </p>
          </li>
          <li>
            <div className="text-xl underline underline-offset-4">
              Intellectual Property
            </div>
            <p className="w-[80vw] pl-4 pt-2 md:w-[65vw]">
              All content and materials on our website, including but not
              limited to logos, trademarks, and copyrighted material, are the
              property of Weave and may not be used without our prior written
              consent. Liability You acknowledge and agree that Weave will not
              be liable for any damages or losses arising from your use of our
              website, including but not limited to loss of data, lost profits,
              or any other damages or losses.
            </p>
          </li>
          <li>
            <div className="text-xl underline underline-offset-4">
              Termination
            </div>
            <p className="w-[80vw] pl-4 pt-2 md:w-[65vw]">
              We may terminate your access to our website at any time if you
              violate these terms of service or engage in any unlawful behavior.
            </p>
          </li>
          <li>
            <div className="text-xl underline underline-offset-4">
              Dispute Resolution
            </div>
            <p className="w-[80vw] pl-4 pt-2 md:w-[65vw]">
              In the event of any disputes arising from or relating to these
              terms of service, you agree to first attempt to resolve the
              dispute informally by contacting us. If we are unable to resolve
              the dispute informally, you agree to submit the dispute to binding
              arbitration in accordance with the rules of the American
              Arbitration Association.
            </p>
          </li>
          <li>
            <div className="text-xl underline underline-offset-4">
              Governing Law
            </div>
            <p className="w-[80vw] pl-4 pt-2 md:w-[65vw]">
              These terms of service will be governed by and construed in
              accordance with the laws of the state or country where Weave is
              headquartered, without giving effect to any principles of
              conflicts of law.
            </p>
          </li>
          <li>
            <div className="text-xl underline underline-offset-4">
              Modifications
            </div>
            <p className="w-[80vw] pl-4 pt-2 md:w-[65vw]">
              We reserve the right to modify these terms of service at any time.
              You should check this page regularly to ensure that you are
              familiar with the current version of the terms. By continuing to
              use our website after any modifications, you agree to be bound by
              the updated terms of service.
            </p>
          </li>
          <li>
            <div className="text-xl underline underline-offset-4">
              Acknowledgment
            </div>
            <p className="w-[80vw] pl-4 pt-2 md:w-[65vw]">
              By using our website, you acknowledge that you have read these
              terms of service and agree to be bound by them. If you do not
              agree to these terms, you should not use our website.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TermsOfService;
