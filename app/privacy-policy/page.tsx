import Link from "next/link";


export default function PrivacyPolicy() {

  return (
    <>
      {/* Privacy Policy */}
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div className="max-w-md mx-auto">
              <div className="flex items-center space-x-5">
                <div className="block font-semibold text-xl self-start text-gray-700">
                  <h2 className="leading-relaxed text-2xl">Privacy Policy</h2>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <p>
                    The TestQuick team is committed to protecting the privacy of our users. This privacy policy outlines our data collection, use, and sharing practices.
                  </p>

                  <h3 className="font-bold mt-4">Information Collection and Use</h3>
                  <p>
                    We only collect information that is necessary for the proper functioning of our website and services. We do not collect personal data unless provided explicitly by the user.
                  </p>

                  <h3 className="font-bold mt-4">Cookies</h3>
                  <p>
                    We use cookies to improve your user experience on our website. These cookies are secure, for session only, and do not store any personal data. You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent.
                  </p>

                  <h3 className="font-bold mt-4">Data Sharing and Transfer</h3>
                  <p>
                    We do not sell, trade, or otherwise transfer your information to third parties. We may share aggregated, anonymized data that does not directly identify you for business purposes.
                  </p>

                  <h3 className="font-bold mt-4">Security</h3>
                  <p>
                    We use administrative and logical measures to safeguard your personal information against loss, theft, unauthorized access, use, and modification.
                  </p>

                  <h3 className="font-bold mt-4">Changes to This Policy</h3>
                  <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                  </p>

                  <h3 className="font-bold mt-4">Contact Us</h3>
                  <p>
                    If you have any questions regarding our privacy practices or this policy, please contact us at <a className="underline" href="mailto:support@testquick.org">support@testquick.org</a>.
                  </p>
                </div>
                <div className="pt-6  leading-6 font-bold sm:text-lg sm:leading-7">
                  <p>
                    To learn more about how we handle and protect your data, please visit our <Link href='/tos' className="text-blue-600 hover:underline">Terms of Service</Link> page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}