import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, X, RotateCw } from "lucide-react";

interface PhotoCaptureProps {
  onPhotoCapture: (imageData: string) => void;
  language: 'english' | 'hindi';
}

export default function PhotoCapture({ onPhotoCapture, language }: PhotoCaptureProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraTimeoutId, setCameraTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const content = {
    english: {
      title: "Applicant Photo",
      description: "Take a photo or upload from gallery",
      cameraButton: "Open Camera",
      uploadButton: "Upload Photo",
      captureButton: "Capture Photo",
      retakeButton: "Retake",
      usePhotoButton: "Use Photo",
      cancelButton: "Cancel"
    },
    hindi: {
      title: "आवेदक की फोटो",
      description: "फोटो लें या गैलरी से अपलोड करें",
      cameraButton: "कैमरा खोलें",
      uploadButton: "फोटो अपलोड करें",
      captureButton: "फोटो लें",
      retakeButton: "फिर से लें",
      usePhotoButton: "फोटो उपयोग करें",
      cancelButton: "रद्द करें"
    }
  };

  const currentContent = content[language];
  
  const startCamera = async () => {
    setCameraError(null);
    setIsVideoPlaying(false);
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      // Try different camera configurations
      let mediaStream;
      const cameraConfigs = [
        // Try front camera first
        { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } },
        // Fallback to any camera with constraints
        { video: { width: { ideal: 1280 }, height: { ideal: 720 } } },
        // Basic video only
        { video: true }
      ];

      for (const config of cameraConfigs) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(config);
          console.log('Camera started with config:', config);
          break;
        } catch (configError) {
          console.log('Camera config failed:', config, configError);
        }
      }

      if (!mediaStream) {
        throw new Error('Unable to access camera with any configuration');
      }
      
      setStream(mediaStream);
      setIsCameraActive(true);
      
      if (videoRef.current) {
        const video = videoRef.current;
        
        // Set up video element properties first
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        
        // Handle video loading and playing
        const handleVideoReady = async () => {
          try {
            if (video && video.srcObject) {
              await video.play();
              console.log('Video is now playing');
              setIsVideoPlaying(true);
            }
          } catch (playError) {
            console.error('Error playing video:', playError);
            // Try to play again after a short delay
            setTimeout(async () => {
              try {
                if (video && video.srcObject) {
                  await video.play();
                  setIsVideoPlaying(true);
                }
              } catch (retryError) {
                console.error('Retry play failed:', retryError);
              }
            }, 100);
          }
        };

        // Add event listeners before setting srcObject
        video.onloadedmetadata = () => {
          console.log('Video metadata loaded, dimensions:', video.videoWidth, 'x', video.videoHeight);
          handleVideoReady();
        };
        
        video.oncanplay = () => {
          console.log('Video can play');
          handleVideoReady();
        };
        
        video.onplaying = () => {
          console.log('Video is playing (onplaying event)');
          setIsVideoPlaying(true);
        };
        video.onpause = () => console.log('Video paused');
        video.onerror = (e) => {
          console.error('Video error:', e);
          setCameraError('Video error. Please retry or check your camera.');
        };
        
        // Reset video playing state
        setIsVideoPlaying(false);
        
        // Set the stream - this should trigger the events
        video.srcObject = mediaStream;
        
        // Force load if needed
        video.load();
        
        // Try to play immediately in case events don't fire
        setTimeout(() => {
          if (video.readyState >= 2) { // HAVE_CURRENT_DATA
            handleVideoReady();
          }
        }, 100);
        // Add a timeout: if video is not playing after 3 seconds, show error
        if (cameraTimeoutId) clearTimeout(cameraTimeoutId);
        const timeoutId = setTimeout(() => {
          if (!isVideoPlaying) {
            setCameraError(language === 'english' ? 'Camera failed to start. Please check permissions, close other apps, or try a different browser.' : 'कैमरा शुरू नहीं हो सका। कृपया अनुमति जांचें, अन्य ऐप बंद करें, या दूसरा ब्राउज़र आज़माएं।');
            stopCamera();
          }
        }, 3000);
        setCameraTimeoutId(timeoutId);
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      
      let errorMessage = '';
      if (language === 'english') {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found on this device.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'Camera not supported in this browser.';
        } else {
          errorMessage = 'Error accessing camera. Please check your browser settings.';
        }
      } else {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'कैमरा अनुमति नहीं दी गई। कृपया कैमरा एक्सेस की अनुमति दें और फिर कोशिश करें।';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'इस डिवाइस पर कोई कैमरा नहीं मिला।';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'इस ब्राउज़र में कैमरा समर्थित नहीं है।';
        } else {
          errorMessage = 'कैमरा एक्सेस में त्रुटि। कृपया अपनी ब्राउज़र सेटिंग्स जांचें।';
        }
      }
      setCameraError(errorMessage);
    }
  };

  // Helper to force play video on user interaction
  const forcePlayVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch((err) => {
        console.error('Force play video error:', err);
        setCameraError('Unable to start video. Please retry.');
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    setIsVideoPlaying(false);
    if (cameraTimeoutId) clearTimeout(cameraTimeoutId);
  };

  const capturePhoto = () => {
    if (!isVideoPlaying) {
      forcePlayVideo();
      return;
    }
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      onPhotoCapture(capturedImage);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (isCameraActive) {
      stopCamera();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{currentContent.title}</CardTitle>
        <p className="text-sm text-gray-600 text-center">{currentContent.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {cameraError && (
          <div className="bg-red-100 text-red-700 p-3 rounded text-center">
            {cameraError}
            <div className="mt-2">
              <Button onClick={startCamera} className="w-full">{language === 'english' ? 'Retry Camera' : 'कैमरा फिर से आज़माएं'}</Button>
            </div>
          </div>
        )}
        {!isCameraActive && !capturedImage && !cameraError && (
          <div className="space-y-3">
            <Button
              onClick={startCamera}
              className="w-full flex items-center justify-center gap-2"
            >
              <Camera size={20} />
              {currentContent.cameraButton}
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              {currentContent.uploadButton}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {isCameraActive && (
          <div className="space-y-3">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover bg-black"
                style={{ transform: 'scaleX(-1)' }}
                onLoadStart={() => console.log('Video load started')}
                onLoadedData={() => console.log('Video data loaded')}
                onLoadedMetadata={(e) => {
                  const video = e.target as HTMLVideoElement;
                  console.log('Video metadata loaded, size:', video.videoWidth, 'x', video.videoHeight);
                }}
                onPlaying={() => {
                  console.log('Video is playing');
                  setIsVideoPlaying(true);
                }}
                onPause={() => console.log('Video paused')}
                onError={(e) => {
                  console.error('Video error:', e);
                  const video = e.target as HTMLVideoElement;
                  console.error('Video error details:', {
                    error: video.error,
                    networkState: video.networkState,
                    readyState: video.readyState,
                    srcObject: video.srcObject
                  });
                }}
                onCanPlay={() => console.log('Video can play')}
              />
              {/* Loading overlay - only show when video is not playing */}
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black bg-opacity-50">
                  <span className="bg-black bg-opacity-75 px-3 py-2 rounded">
                    {language === 'english' ? 'Loading camera...' : 'कैमरा लोड हो रहा है...'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={capturePhoto}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                {currentContent.captureButton}
              </Button>
              <Button
                variant="outline"
                onClick={stopCamera}
                className="flex items-center justify-center gap-2"
              >
                <X size={20} />
                {currentContent.cancelButton}
              </Button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="space-y-3">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUsePhoto}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {currentContent.usePhotoButton}
              </Button>
              <Button
                variant="outline"
                onClick={handleRetake}
                className="flex items-center justify-center gap-2"
              >
                <RotateCw size={20} />
                {currentContent.retakeButton}
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
}