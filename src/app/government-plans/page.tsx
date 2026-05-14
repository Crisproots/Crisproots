"use client";

import React, { useState, useEffect } from "react";

interface GovernmentPlan {
  id: number;
  title: string;
  description: string;
  ministry: string;
  startDate: string;
  status: "Active" | "Upcoming" | "Completed";
  link: string;
}

const GovernmentPlansPage = () => {
  const [plans, setPlans] = useState<GovernmentPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Dummy data for demonstration
  useEffect(() => {
    setPlans([
      {
        id: 1,
        title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        description: "A crop insurance scheme that provides financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        startDate: "2016-02-18",
        status: "Active",
        link: "https://pmfby.gov.in/",
      },
      {
        id: 2,
        title: "Kisan Credit Card (KCC) Scheme",
        description: "Provides adequate and timely credit support from the banking system to farmers for their cultivation needs.",
        ministry: "Ministry of Finance",
        startDate: "1998-08-01",
        status: "Active",
        link: "https://www.india.gov.in/spotlight/kisan-credit-card-scheme",
      },
      {
        id: 3,
        title: "National Agriculture Market (e-NAM)",
        description: "An online trading platform for agricultural commodities in India, facilitating better price discovery for farmers.",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        startDate: "2016-04-14",
        status: "Active",
        link: "https://www.enam.gov.in/",
      },
      {
        id: 4,
        title: "Paramparagat Krishi Vikas Yojana (PKVY)",
        description: "Promotes organic farming in India through a cluster approach and Participatory Guarantee Systems (PGS) of certification.",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        startDate: "2015-04-01",
        status: "Active",
        link: "https://pgsindia-ncof.gov.in/PKVY/index.aspx",
      },
      {
        id: 5,
        title: "Soil Health Card Scheme",
        description: "Aims to provide every farmer with a Soil Health Card to help them know the nutrient status of their soil and its recommendation on dosage of fertilizers.",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        startDate: "2015-02-19",
        status: "Active",
        link: "https://soilhealth.dac.gov.in/",
      },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 text-gray-800">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-cyan-800 animate-fade-in">Government Schemes for Farmers</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-cyan-700 mb-6 text-center animate-fade-in-up">
            Key Initiatives to Support Indian Agriculture
          </h2>
          {loading ? (
            <div className="text-center text-cyan-600 text-lg animate-pulse p-8 bg-white rounded-xl shadow-md">Loading government plans...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-xl shadow-lg p-7 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl animate-fade-in-up border border-cyan-200"
                  style={{ animationDelay: `${0.05 * plan.id}s` }}
                >
                  <h3 className="text-xl font-bold text-cyan-700 mb-3 leading-tight">{plan.title}</h3>
                  <p className="text-gray-700 mb-4 text-base leading-relaxed">{plan.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                    <span className="font-medium">Ministry: <span className="text-cyan-600">{plan.ministry}</span></span>
                    <span className="text-xs">Status: <span className={`font-semibold ${plan.status === "Active" ? "text-green-600" : plan.status === "Upcoming" ? "text-yellow-600" : "text-gray-500"}`}>{plan.status}</span></span>
                  </div>
                  {plan.link && (
                    <div className="mt-4 text-right">
                      <a
                        href={plan.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Learn More
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default GovernmentPlansPage;