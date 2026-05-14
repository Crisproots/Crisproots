"use client";

import React, { useState, useEffect } from "react";

interface JobApplication {
  id: number;
  jobTitle: string;
  applicantName: string;
  contact: string;
  status: "Pending" | "Reviewed" | "Hired";
  appliedAt: string;
}

const KrishiPage = () => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [form, setForm] = useState({ jobTitle: "", applicantName: "", contact: "" });
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"apply" | "view">("apply"); // "apply" or "view"

  // Dummy data for demonstration
  useEffect(() => {
    setJobApplications([
      { id: 1, jobTitle: "Farm Hand", applicantName: "Ramesh Kumar", contact: "ramesh@example.com", status: "Pending", appliedAt: new Date().toLocaleString() },
      { id: 2, jobTitle: "Crop Specialist", applicantName: "Priya Sharma", contact: "priya@example.com", status: "Reviewed", appliedAt: new Date().toLocaleString() },
    ]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // In a real application, you would send this data to an API
    const newApplication: JobApplication = {
      id: jobApplications.length + 1,
      ...form,
      status: "Pending",
      appliedAt: new Date().toLocaleString(),
    };
    setJobApplications([newApplication, ...jobApplications]);
    setForm({ jobTitle: "", applicantName: "", contact: "" });
    setSubmitting(false);
    alert("Application submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-indigo-800 animate-fade-in">Krishi Connect</h1>
          <nav>
            <button
              onClick={() => setViewMode("apply")}
              className={`mr-4 px-4 py-2 rounded-lg font-semibold transition-colors ${
                viewMode === "apply" ? "bg-indigo-600 text-white shadow-md" : "text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              Apply for Jobs
            </button>
            <button
              onClick={() => setViewMode("view")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                viewMode === "view" ? "bg-indigo-600 text-white shadow-md" : "text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              View Applications
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4">
        {viewMode === "apply" ? (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center animate-fade-in-up">Apply for Farming Jobs</h2>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-lg p-8 animate-slide-in border border-indigo-200"
            >
              <div className="mb-5">
                <label htmlFor="jobTitle" className="block text-gray-700 text-sm font-semibold mb-2">Job Title</label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="e.g., Farm Manager, Harvester"
                  value={form.jobTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 ease-in-out text-lg"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="applicantName" className="block text-gray-700 text-sm font-semibold mb-2">Your Name</label>
                <input
                  type="text"
                  id="applicantName"
                  name="applicantName"
                  placeholder="e.g., Rahul Sharma"
                  value={form.applicantName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 ease-in-out text-lg"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="contact" className="block text-gray-700 text-sm font-semibold mb-2">Contact Information</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  placeholder="e.g., +91 9876543210 or email@example.com"
                  value={form.contact}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 ease-in-out text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting Application..." : "Submit Application"}
              </button>
            </form>
          </section>
        ) : (
          <section>
            <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center animate-fade-in-up">All Job Applications</h2>
            <div className="space-y-6">
              {jobApplications.length === 0 ? (
                <div className="text-center text-gray-500 text-lg animate-fade-in p-8 bg-white rounded-xl shadow-md">No applications yet.</div>
              ) : (
                jobApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-xl shadow-md p-7 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl animate-fade-in-up border border-indigo-100"
                    style={{ animationDelay: `${0.05 * app.id}s` }}
                  >
                    <h3 className="text-2xl font-bold text-indigo-700 mb-3 leading-tight">{app.jobTitle}</h3>
                    <p className="text-gray-700 mb-2 text-base">Applicant: <span className="font-medium">{app.applicantName}</span></p>
                    <p className="text-gray-700 mb-4 text-base">Contact: {app.contact}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                      <span className={`font-semibold ${app.status === "Pending" ? "text-yellow-600" : app.status === "Reviewed" ? "text-blue-600" : "text-green-600"}`}>
                        Status: {app.status}
                      </span>
                      <span className="text-xs">Applied: {app.appliedAt}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
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
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default KrishiPage;