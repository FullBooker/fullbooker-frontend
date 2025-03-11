import MobileMiniAppBar from "@/components/layout/mobileMiniAppBar";
import React from "react";

const TermsOfServicePage = () => {
  return (
    <div>
      <MobileMiniAppBar title="Terms of Service" />
      <div className="h-fit md:max-w-6xl mx-auto px-7">
        <div className="py-3 md:py-8">
          <h1 className="text-2xl font-bold mb-4 hidden md:block">
            FULLBOOKER TERMS OF SERVICE
          </h1>
          <p className="mb-4">
            Welcome to Fullbooker! These Terms of Service ("Terms") are a
            binding legal agreement between you and Fullbooker Limited
            ("Fullbooker," "we," "us," or "our"). Fullbooker is a platform
            registered as a private limited company under the Companies Act of
            Kenya (PVT-ZQUXZ2KA). Our platform allows users to publish, search
            for, book, and pay for activities, events, and experiences.
          </p>
          <p className="mb-4">
            Here are some important definitions to help you navigate these
            Terms:
          </p>
          <ol className="list-decimal list-inside mb-4">
            <li className="mb-2">
              <strong>“Fullbooker Platform”</strong> means the online
              marketplace provided by Fullbooker, allowing users to publish,
              search for, book, and pay for Host Services.
            </li>
            <li className="mb-2">
              <strong>“Hosts”</strong> are Members who publish and offer
              services, including activities, experiences, events, and other
              recreational services (collectively, "Host Services"). Each Host
              Service is referred to as a "Listing."
            </li>
            <li className="mb-2">
              <strong>“Guests”</strong> are Members who search for, book, or use
              Host Services through the Fullbooker Platform.
            </li>
            <li className="mb-2">
              <strong>“Members”</strong> refer to both Hosts and Guests who have
              registered on the Fullbooker Platform.
            </li>
            <li className="mb-2">
              <strong>“Listings”</strong> refer to Host Service offerings that
              are published and made available for booking on the Fullbooker
              Platform.
            </li>
            <li className="mb-2">
              <strong>“Fullbooker Payments”</strong> means the payment
              processing service provided under Fullbooker's Payment Terms,
              governing transactions between Members.
            </li>
            <li className="mb-2">
              <strong>“Affiliates”</strong> refer to any entity that controls,
              is controlled by, or is under common control with Fullbooker.
            </li>
            <li className="mb-2">
              <strong>“Additional Policies”</strong> include Fullbooker's
              Privacy Policy, which outlines how personal data is collected and
              used, and Fullbooker's Payments Terms, which govern payment
              services provided to Members.
            </li>
          </ol>
          <p className="mb-4">
            As the provider of the Fullbooker Platform, Fullbooker (or its
            affiliates) does not own, control, offer, or manage any Listings or
            Host Services. Fullbooker is not a party to contracts entered into
            directly between Hosts and Guests, nor is it a travel agency, event
            organizer, or insurer. Fullbooker does not act as an agent in any
            capacity for any Member, except as specified in the Payments Terms
            of Service ("Payments Terms").
          </p>
          <h2 className="text-xl font-bold mb-4">TABLE OF CONTENTS</h2>
          <ol className="list-decimal list-inside mb-4">
            <li className="mb-2">General Terms</li>
            <li className="mb-2">Guest Terms</li>
            <li className="mb-2">Host Terms</li>
            <li className="mb-2">Fullbooker's Role</li>
            <li className="mb-2">
              Termination, Suspension, and Other Measures
            </li>
            <li className="mb-2">Export Controls And Restricted Countries</li>
            <li className="mb-2">Liability and Indemnification</li>
            <li className="mb-2">Disclaimer of Warranties</li>
            <li className="mb-2">
              Binding Arbitration And Class Action Waiver Provisions
            </li>
            <li className="mb-2">Reviews and Content</li>
            <li className="mb-2">Cancellations and Refunds</li>
            <li className="mb-2">Payments</li>
            <li className="mb-2">Taxes and Deductions</li>
            <li className="mb-2">Miscellaneous</li>
          </ol>
          <h2 className="text-xl font-bold mb-4">1. General Terms</h2>
          <p className="mb-4">
            Fullbooker provides an online platform enabling users ("Members") to
            discover, book, and list services categorized into Activities,
            Events, and Experiences. These services are provided by individual
            or organizational "Hosts" to "Guests" through Fullbooker's
            interface. Fullbooker itself does not own, manage, or operate these
            services, and therefore, acts as an intermediary connecting Hosts
            and Guests.
          </p>
          <h3 className="text-lg font-semibold mb-2">1.1 Scope of Agreement</h3>
          <p className="mb-4">
            These Terms govern all interactions with the Fullbooker platform,
            including but not limited to account registration, listing creation,
            booking services, and payment processing. Additional agreements,
            such as Privacy Policies or Payment Terms, supplement these Terms
            and are deemed an integral part of this agreement.
          </p>
          <h3 className="text-lg font-semibold mb-2">
            1.2 Registration Requirements
          </h3>
          <p className="mb-4">
            <strong>1.2.0 Eligibility:</strong> Individuals must be at least 18
            years old and legally able to enter binding contracts to register
            for a Fullbooker account. Businesses and organizations must be duly
            registered entities.
          </p>
          <p className="mb-4">
            <strong>1.2.1 Account Information:</strong> Members must provide
            accurate, complete, and up-to-date information during registration
            and maintain the security of their accounts. Fullbooker is not
            liable for unauthorized access resulting from Members' failure to
            secure their login credentials.
          </p>
          <h3 className="text-lg font-semibold mb-2">1.3 Prohibited Use</h3>
          <p className="mb-4">
            Fullbooker may not be used to engage in illegal activities, promote
            harmful or discriminatory behavior, or violate local laws in the
            regions where the platform operates. Members are strictly prohibited
            from:
          </p>
          <ol className="list-decimal list-inside mb-4">
            <li className="mb-2">
              Circumventing platform fees or conducting transactions outside the
              platform.
            </li>
            <li className="mb-2">Creating fraudulent accounts or Listings.</li>
            <li className="mb-2">
              Misrepresenting their identity or services.
            </li>
          </ol>
          <h3 className="text-lg font-semibold mb-2">
            1.4 Service Availability
          </h3>
          <p className="mb-4">
            Fullbooker does not guarantee uninterrupted or error-free operation
            of the platform. Planned maintenance and unexpected disruptions may
            temporarily affect accessibility. Fullbooker will strive to provide
            notifications and resolve disruptions promptly but is not liable for
            losses incurred due to platform downtime.
          </p>
          <h3 className="text-lg font-semibold mb-2">
            1.5 Communication and Notifications
          </h3>
          <p className="mb-4">
            All official communications, including updates to these Terms, will
            be sent electronically via email, SMS, or in-app notifications.
            Members are responsible for keeping their contact information up to
            date and regularly reviewing communications from Fullbooker.
          </p>
          <h3 className="text-lg font-semibold mb-2">
            1.6 Termination of Agreement
          </h3>
          <p className="mb-4">
            Fullbooker reserves the right to terminate Member accounts for
            violations of these Terms or any activity that jeopardizes the
            platform's integrity or other Members' safety and satisfaction.
            Members may terminate their accounts by providing written notice to
            Fullbooker. However, active bookings and financial obligations must
            be honored prior to termination.
          </p>
          <h3 className="text-lg font-semibold mb-2">
            1.7 Additional Policies
          </h3>
          <p className="mb-4">
            Members are expected to comply with all supplemental policies,
            including the Privacy Policy and Content Guidelines, which govern
            specific aspects of the Fullbooker experience.
          </p>
          <h2 className="text-xl font-bold mb-4">2. Guest Terms</h2>
          <h3 className="text-lg font-semibold mb-2">
            2.1 Searching and Booking
          </h3>
          <p className="mb-4">
            Guests can search and book Host Services using a variety of filters
            such as location, price range, service type, and duration. The
            search results are based on relevance to the Guest's criteria,
            availability, reviews, and other factors. Guests are encouraged to
            review the complete details of Listings before making bookings.
          </p>
          <p className="mb-4">
            By booking a Listing, Guests agree to pay the total cost, including
            the Listing price, service fees, taxes, and any other applicable
            charges identified during checkout ("TOTAL PRICE"). If a Guest pays
            in a currency different from the Host's listing currency, the price
            displayed is based on Fullbooker's currency conversion rate.
          </p>
          <h3 className="text-lg font-semibold mb-2">
            2.2 Booking Confirmation
          </h3>
          <p className="mb-4">
            A booking is confirmed when the Guest completes payment and receives
            a confirmation from Fullbooker. This confirmation forms a direct
            contract between the Guest and the Host, governed by these Terms and
            any additional conditions specified in the Listing, including
            cancellation policies, and other requirements.
          </p>
          <h3 className="text-lg font-semibold mb-2">
            2.3 Responsibilities of Guests
          </h3>
          <p className="mb-4">
            Guests must comply with the rules set forth by Hosts in their
            Listings, including any specific guidelines for participation in
            Activities, Events, or Experiences. Guests are expected to act
            responsibly and respectfully when interacting with Hosts, other
            Guests, or third parties during an Activity or Event.
          </p>
          <h3 className="text-lg font-semibold mb-2">2.4 Assumption of Risk</h3>
          <p className="mb-4">
            Some events and activities may carry inherent risk and by
            participating in those events, you choose to assume those risks
            voluntarily.
          </p>
          <h3 className="text-lg font-semibold mb-2">2.5 No-Show Policy</h3>
          <p className="mb-4">
            Guests who fail to show up for a booked service without prior
            cancellation are not eligible for refunds.
          </p>
          <h3 className="text-lg font-semibold mb-2">2.6 Prohibited Actions</h3>
          <p className="mb-4">
            Guests must not attempt to circumvent Fullbooker's payment system by
            arranging transactions directly with Hosts. Guests may not engage in
            abusive, fraudulent, or illegal behavior while using the platform or
            participating in services.
          </p>
          <h3 className="text-lg font-semibold mb-2">
            2.7 Feedback and Reviews
          </h3>
          <p className="mb-4">
            Guests are encouraged to leave honest and constructive reviews of
            their experiences. Reviews should focus on the quality of the
            service and must comply with Fullbooker's Content Guidelines.
          </p>
          <h2 className="text-xl font-bold mb-4">3. Host Terms</h2>
          <h3 className="text-lg font-semibold mb-2">3.1 Listings</h3>
          <p className="mb-4">
            Hosts are solely responsible for the accuracy and completeness of
            their Listings. This includes providing detailed descriptions,
            accurate pricing, clear rules, and availability schedules.
          </p>
          <h3 className="text-lg font-semibold mb-2">
            3.2 Contractual Obligations
          </h3>
          <p className="mb-4">
            By accepting a booking, Hosts enter into a binding agreement with
            the Guest to deliver the services as described in the Listing. Hosts
            are obligated to honor all confirmed bookings.
          </p>
          <h3 className="text-lg font-semibold mb-2">
            3.3 Compliance with Laws
          </h3>
          <p className="mb-4">
            Hosts must comply with all applicable local, regional, and national
            laws, including but not limited to licensing, taxation, and safety
            regulations.
          </p>
          <h3 className="text-lg font-semibold mb-2">3.4 Fees and Payments</h3>
          <p className="mb-4">
            Hosts acknowledge that Fullbooker charges service fees for
            facilitating bookings. These fees will be deducted from the payouts
            for each booking.
          </p>
          <h3 className="text-lg font-semibold mb-2">
            3.5 Prohibited Activities
          </h3>
          <p className="mb-4">
            Hosts must not create multiple accounts to manipulate search
            rankings or circumvent platform rules. Listings must not promote
            illegal activities, discrimination, or other prohibited content as
            outlined in Fullbooker's Content Guidelines.
          </p>
          <h2 className="text-xl font-bold mb-4">4. Fullbooker's Role</h2>
          <p className="mb-4">
            We provide you with access to a platform that allows Members to
            publish, offer, search for, book, and pay for Activities and Events.
            While we strive to ensure a great experience for all Members using
            Fullbooker, we do not and cannot control the actions of Guests and
            Hosts.
          </p>
          <h2 className="text-xl font-bold mb-4">
            5. Termination, Suspension, and Other Measures
          </h2>
          <p className="mb-4">
            Fullbooker reserves the right to suspend or terminate your right to
            use the Services at any time, including if you violate or breach
            these Terms.
          </p>
          <h2 className="text-xl font-bold mb-4">
            6. Liability and Indemnification
          </h2>
          <p className="mb-4">
            Fullbooker provides the platform "as is" and "as available" without
            warranties of any kind. To the maximum extent permitted by law,
            Fullbooker and its affiliates shall not be liable for any indirect,
            incidental, special, consequential, punitive, or exemplary damages.
          </p>
          <h2 className="text-xl font-bold mb-4">
            7. Disclaimer of Warranties
          </h2>
          <p className="mb-4">
            The Fullbooker Platform and all Content are provided "as is" without
            warranty of any kind, and Fullbooker (or its affiliates) disclaim
            all warranties, whether express or implied.
          </p>
          <h2 className="text-xl font-bold mb-4">
            8. Binding Arbitration and Class Action Waiver Provisions
          </h2>
          <p className="mb-4">
            In the unlikely event that our customer support team is unable to
            resolve your concerns, you and we each agree to resolve all disputes
            and claims through binding arbitration.
          </p>
          <h2 className="text-xl font-bold mb-4">9. Reviews and Content</h2>
          <p className="mb-4">
            Members are encouraged to provide honest and constructive reviews of
            their experiences with Hosts and Activities. Reviews must not
            include offensive language, personal attacks, or content that is
            irrelevant to the service being reviewed.
          </p>
          <h2 className="text-xl font-bold mb-4">
            10. Cancellations and Refunds
          </h2>
          <p className="mb-4">
            All bookings on the Fullbooker platform are deemed final and
            non-refundable unless explicitly stated otherwise in these Terms.
          </p>
          <h2 className="text-xl font-bold mb-4">11. Payments</h2>
          <p className="mb-4">
            All payments made through Fullbooker are processed via secure
            third-party payment systems integrated into the platform.
          </p>
          <h2 className="text-xl font-bold mb-4">12. Taxes and Deductions</h2>
          <p className="mb-4">
            All payments are subject to applicable taxes, including VAT or
            similar indirect taxes where required by law.
          </p>
          <h2 className="text-xl font-bold mb-4">13. Miscellaneous</h2>
          <p className="mb-4">
            These Terms, together with supplemental policies such as the Privacy
            Policy and Payment Terms, represent the entire agreement between
            Members and Fullbooker and govern your use of the Services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
