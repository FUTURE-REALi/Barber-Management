import React, { useState } from "react";

const faqs = [
  {
    question: "How do I update my store information?",
    answer: "Go to the Outlet Info section, click 'Edit Info', update your details, and click Save.",
  },
  {
    question: "How can I add or edit services?",
    answer: "Navigate to the Menu section. You can add new services or edit existing ones from there.",
  },
  {
    question: "How do I view my sales and payouts?",
    answer: "Visit the Payout section to see your sales analytics and payout details.",
  },
  {
    question: "How can I contact support?",
    answer: "You can reach us at support@pocketsalon.com or call our helpline at 1800-123-456.",
  },
];

const HelpCentreSection = () => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="p-8 flex justify-center items-start min-h-[70vh] bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-blue-800 flex items-center gap-2">
          <span className="material-icons text-blue-600 text-4xl">help_center</span>
          Help Centre
        </h2>
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b pb-3">
                <button
                  className="w-full text-left flex justify-between items-center font-semibold text-gray-800 hover:text-blue-700 transition"
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                >
                  <span>{faq.question}</span>
                  <span className="material-icons text-base">
                    {openIdx === idx ? "expand_less" : "expand_more"}
                  </span>
                </button>
                {openIdx === idx && (
                  <div className="mt-2 text-gray-600">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Contact Support</h3>
          <div className="flex flex-col gap-2 text-gray-700">
            <div>
              <span className="font-semibold">Email:</span>{" "}
              <a href="mailto:support@pocketsalon.com" className="text-blue-600 underline">
                support@pocketsalon.com
              </a>
            </div>
            <div>
              <span className="font-semibold">Helpline:</span>{" "}
              <a href="tel:1800123456" className="text-blue-600 underline">
                1800-123-456
              </a>
            </div>
            <div>
              <span className="font-semibold">Live Chat:</span>{" "}
              <span className="text-gray-500">Coming soon!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCentreSection;