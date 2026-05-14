"use client";

import React from "react";

interface Video {
  title: string;
  link: string;
  summary: string;
}

const youtubeVideos: Video[] = [
  {
    title: "Why VERTICAL FARMING will FAIL in India | Agritalk by Abhinav Roy",
    link: "https://www.youtube.com/watch?v=At8jnZsEx_A",
    summary: "A critical analysis of why large-scale vertical farming faces unique financial, climatic, and technological hurdles in India, with practical lessons for farmers.",
  },
  {
    title: "Drip Irrigation System - How Farmers Save Water and Increase Yields",
    link: "https://www.youtube.com/watch?v=hvtGpuKeO0E",
    summary: "Explains the principles, setup, costs, and real-world benefits of drip irrigation, one of the most effective water-saving practices for Indian farms.",
  },
  {
    title: "Hydroponic Farming in India - Complete Guide",
    link: "https://www.youtube.com/watch?v=u-0Yay1C5kU",
    summary: "A beginner’s tutorial on hydroponics: how it works, crops best suited for it, and its business viability in Indian conditions.",
  },
  {
    title: "How to Make Biofertilizer at Home for Your Farm",
    link: "https://www.youtube.com/watch?v=i5vSyPd1mw4",
    summary: "Demonstrates simple steps to make high-value organic biofertilizer from kitchen waste, improving soil health without chemicals.",
  },
  {
    title: "Best Practices for Paddy (Rice) Cultivation in India",
    link: "https://www.youtube.com/watch?v=teZJKi1AyeI",
    summary: "Covers modern methods to boost yields, pest management, and input efficiency in rice farming—valuable for all rice growers.",
  },
  {
    title: "Zero Budget Natural Farming (ZBNF): The Indian Success Story",
    link: "https://www.youtube.com/watch?v=KkT6iYOyHk4",
    summary: "Showcases ZBNF principles as promoted by Subhash Palekar, demonstrating how farmers can reduce costs and restore soil fertility.",
  },
  {
    title: "Polyhouse Farming in India: Profitable Greenhouse Vegetables",
    link: "https://www.youtube.com/watch?v=49u3cNkMgJI",
    summary: "This video details polyhouse construction, crops that succeed, and financial planning for Indian conditions.",
  },
  {
    title: "Precision Agriculture with Drones: A Farmer’s Guide",
    link: "https://www.youtube.com/watch?v=OGZAPzREUaU",
    summary: "Explains how Indian farmers use drones for crop monitoring, pesticide spraying, and data-driven management.",
  },
  {
    title: "Maize Cultivation Practices for High Yield",
    link: "https://www.youtube.com/watch?v=v9XrLPMiros",
    summary: "Focuses on maize growing climates, planting, fertilizer schedules, and harvest techniques, tailored to Indian districts.",
  },
  {
    title: "Cotton Crop Management – Reduce Pest Attack and Boost Profit",
    link: "https://www.youtube.com/watch?v=qOLdssRSY7w",
    summary: "Provides actionable tips on pest-resistant seeds, timely interventions, and integrated crop management for cotton farmers.",
  },
];

const FarmerEducationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 text-gray-800">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-orange-800 animate-fade-in">Farmer Education Hub</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-orange-700 mb-6 text-center animate-fade-in-up">
            Learn and Grow with These Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {youtubeVideos.map((video, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl animate-fade-in-up border border-orange-200"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <h3 className="text-xl font-bold text-orange-700 mb-3 leading-tight">{video.title}</h3>
                <p className="text-gray-700 mb-4 text-base leading-relaxed">{video.summary}</p>
                <a
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Watch Video
                </a>
              </div>
            ))}
          </div>
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

export default FarmerEducationPage;