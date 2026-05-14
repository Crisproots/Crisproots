"use client";

import React, { useState } from 'react';
import { MapPin, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface LocationPermissionGuideProps {
  onClose: () => void;
  onLocationReceived: (lat: number, lng: number) => void;
}

const LocationPermissionGuide: React.FC<LocationPermissionGuideProps> = ({ onClose, onLocationReceived }) => {
  const [step, setStep] = useState<'guide' | 'requesting' | 'success' | 'error'>('guide');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const requestLocation = () => {
    setStep('requesting');
    
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      setStep('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationReceived(latitude, longitude);
        setStep('success');
        setTimeout(() => {
          onClose();
        }, 2000);
      },
      (error) => {
        let message = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied. Please enable location permissions in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
        setErrorMessage(message);
        setStep('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Enable Location Services</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'guide' && (
            <div>
              <div className="text-center mb-6">
                <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Location Access Required
                </h4>
                <p className="text-gray-600">
                  To provide accurate crop management recommendations, we need access to your location.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-gray-900">Why we need your location:</h5>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                      <li>• Get local weather data for your farm</li>
                      <li>• Provide soil analysis for your region</li>
                      <li>• Customize drone flight recommendations</li>
                      <li>• Enable geofencing and safety features</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-green-800">Privacy Protected</h5>
                      <p className="text-sm text-green-700 mt-1">
                        Your location data is only used for agricultural analysis and is never shared with third parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Skip for Now
                </button>
                <button
                  onClick={requestLocation}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Enable Location
                </button>
              </div>
            </div>
          )}

          {step === 'requesting' && (
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Requesting Location Access
              </h4>
              <p className="text-gray-600">
                Please allow location access when prompted by your browser.
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Location Access Granted!
              </h4>
              <p className="text-gray-600">
                Your location has been successfully acquired. You can now access location-based features.
              </p>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Location Access Failed
              </h4>
              <p className="text-gray-600 mb-4">
                {errorMessage}
              </p>
              
              <div className="bg-yellow-50 p-4 rounded-lg mb-4 text-left">
                <h5 className="font-medium text-yellow-800 mb-2">Troubleshooting Steps:</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>1. Click the location icon in your browser&apos;s address bar</li>
                  <li>2. Select &quot;Allow&quot; for location access</li>
                  <li>3. Refresh the page and try again</li>
                  <li>4. Check your browser&apos;s privacy settings</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={requestLocation}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionGuide;
