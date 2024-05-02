import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed text-2xl">Terms of Service</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p>
                  Welcome to TestQuick. Please read these Terms of Service (&quot;Terms&quot;) carefully as they govern your access to and use of our services.
                </p>

                <h3 className="font-bold mt-4">1. Notifications</h3>
                <p>
                  By default users will receive email notifications, you consent to receive timely updates and alerts from our platform, which can be disabled at any time in settings.
                </p>
                <h3 className="font-bold mt-4">2. Data Collection</h3>
                <p>
                  At QuickTest, we are committed to enhancing educational experiences through our platform. To this end, we collect a wide range of data, including all information entered, generated, or uploaded to our platform. This data is used to continuously improve our services, ensuring they are efficient, effective, and tailored to the needs of educators and students. We adhere to strict privacy and security standards to protect the integrity and confidentiality of the data entrusted to us.</p>
                <h3 className="font-bold mt-4">3. Liability Limitation</h3>
                <p>
                  To the fullest extent permitted by applicable law, TestQuick shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                </p>

                <h3 className="font-bold mt-4">4. Changes to the Terms</h3>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It&apos;s your responsibility to review the Terms regularly. Your continued use of our service after any changes indicates acceptance of those changes.
                </p>

                <h3 className="font-bold mt-4">5. Termination</h3>
                <p>
                  We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the service, us, or third parties, or for any other reason.
                </p>

                <h3 className="font-bold mt-4">6. Governing Law</h3>
                <p>
                  These Terms are governed by the laws of the United States, without regard to its conflict of laws rules. You agree to submit to the exclusive jurisdiction of the courts located within the United States for the resolution of any dispute arising out of these Terms or the services.
                </p>

                <h3 className="font-bold mt-4">7. Contact</h3>
                <p>
                  If you have any questions about these Terms, please contact us at <a className="underline" href="mailto:support@testquick.org">support@testquick.org</a>.
                </p>

                <div className="pt-6 leading-6 font-bold sm:text-lg sm:leading-7">
                  <p>
                    To learn more about how we handle and protect your privacy, please visit our <Link href='/privacy-policy' className="text-blue-600 hover:underline">Privacy Policy</Link> page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}