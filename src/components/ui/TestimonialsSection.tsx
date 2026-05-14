"use client";

import React from 'react';
import { Star, Quote, MapPin, Zap } from 'lucide-react';

const testimonials = [
  {
    name: 'राजेश कुमार',
    nameEng: 'Rajesh Kumar',
    location: 'Punjab',
    crop: 'Wheat & Rice',
    image: '👨‍🌾',
    rating: 5,
    testimonial: 'AI crop prediction helped me increase my yield by 35%. The weather alerts saved my crops during unexpected rains.',
    testimonialHindi: 'AI फसल भविष्यवाणी से मेरी उपज 35% बढ़ गई। मौसम की चेतावनी ने अचानक बारिश में मेरी फसल बचाई।',
    savings: '₹2.5 Lakhs',
    achievement: 'Best Farmer 2024'
  },
  {
    name: 'सुनीता देवी',
    nameEng: 'Sunita Devi',
    location: 'Haryana',
    crop: 'Cotton & Sugarcane',
    image: '👩‍🌾',
    rating: 5,
    testimonial: 'Disease detection feature identified cotton leaf curl virus early. Treatment recommendations saved 80% of my crop.',
    testimonialHindi: 'रोग पहचान सुविधा ने कपास के पत्ते के कर्ल वायरस की जल्दी पहचान की। इलाज की सिफारिश से मेरी 80% फसल बच गई।',
    savings: '₹4.2 Lakhs',
    achievement: 'Organic Certified'
  },
  {
    name: 'अमित पटेल',
    nameEng: 'Amit Patel',
    location: 'Gujarat',
    crop: 'Groundnut & Cotton',
    image: '👨‍🌾',
    rating: 5,
    testimonial: 'Market analysis helped me sell at the right time. Got 40% better prices than my neighbors.',
    testimonialHindi: 'बाजार विश्लेषण से सही समय पर बेचने में मदद मिली। पड़ोसियों से 40% बेहतर दाम मिले।',
    savings: '₹6.8 Lakhs',
    achievement: 'Top Seller 2024'
  },
  {
    name: 'प्रिया शर्मा',
    nameEng: 'Priya Sharma',
    location: 'Uttar Pradesh',
    crop: 'Potato & Wheat',
    image: '👩‍🌾',
    rating: 5,
    testimonial: 'Soil analysis and fertilizer recommendations reduced my input costs by 45% while improving quality.',
    testimonialHindi: 'मिट्टी विश्लेषण और उर्वरक की सिफारिश से मेरी लागत 45% कम हुई और गुणवत्ता बेहतर हुई।',
    savings: '₹3.2 Lakhs',
    achievement: 'Sustainable Farmer'
  },
  {
    name: 'रवि चंद्र',
    nameEng: 'Ravi Chandra',
    location: 'Andhra Pradesh',
    crop: 'Rice & Chili',
    image: '👨‍🌾',
    rating: 5,
    testimonial: 'Cattle management module helped track my 50 cows efficiently. Milk production increased by 25%.',
    testimonialHindi: 'पशु प्रबंधन मॉड्यूल से मेरी 50 गायों को ट्रैक करना आसान हुआ। दूध उत्पादन 25% बढ़ा।',
    savings: '₹1.8 Lakhs',
    achievement: 'Dairy Excellence'
  },
  {
    name: 'गीता बाई',
    nameEng: 'Geeta Bai',
    location: 'Rajasthan',
    crop: 'Bajra & Mustard',
    image: '👩‍🌾',
    rating: 5,
    testimonial: 'Water management suggestions helped me save 60% water during drought. Crops survived and yielded well.',
    testimonialHindi: 'पानी प्रबंधन सुझावों से सूखे में 60% पानी बचाया। फसल बची और अच्छी उपज मिली।',
    savings: '₹2.1 Lakhs',
    achievement: 'Water Conservation'
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            किसान की आवाज (Farmer's Voice)
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Success Stories from <span className="text-blue-600">Indian Farmers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real farmers, real results. See how our AI-powered platform is transforming agriculture across India 
            and helping farmers achieve unprecedented success.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
            >
              {/* Achievement Badge */}
              <div className="absolute top-4 right-4">
                <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                  {testimonial.achievement}
                </div>
              </div>

              {/* Quote Icon */}
              <div className="absolute top-6 left-6 opacity-10">
                <Quote className="w-8 h-8 text-gray-400" />
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{testimonial.image}</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.nameEng}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {testimonial.location} • {testimonial.crop}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial */}
                <div className="space-y-3 mb-4">
                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    "{testimonial.testimonial}"
                  </p>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    "{testimonial.testimonialHindi}"
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{testimonial.savings}</div>
                    <div className="text-xs text-gray-500">Savings</div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                    Verified
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-600/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">4.9/5</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
              <div className="text-sm text-gray-500">Based on 50,000+ reviews</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">45%</div>
              <div className="text-gray-600 font-medium">Avg Yield Increase</div>
              <div className="text-sm text-gray-500">Across all crop types</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">₹3.5L</div>
              <div className="text-gray-600 font-medium">Avg Savings</div>
              <div className="text-sm text-gray-500">Per farmer per year</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600 font-medium">Satisfaction Rate</div>
              <div className="text-sm text-gray-500">Would recommend to others</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
