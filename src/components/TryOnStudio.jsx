import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Camera, Sparkles, ShoppingBag, Upload, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import {
  initMediaPipeFaceMesh,
  detectLandmarksOnElement,
  getFaceLandmarks,
  drawPhotorealisticGlasses,
  preloadAllFrames
} from '../utils/faceTracker';
import { PRODUCTS } from '../data/products';

export default function TryOnStudio({ isOpen, onClose, selectedProduct, onSelectProduct, onAddToCart }) {
  if (!isOpen) return null;

  const [activeFrame, setActiveFrame] = useState(selectedProduct || PRODUCTS[0]);
  const [tryOnMode, setTryOnMode] = useState('camera'); // 'camera' | 'photo'
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [userPhotoUrl, setUserPhotoUrl] = useState(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [landmarksCache, setLandmarksCache] = useState(null);

  const videoRef = useRef(null);
  const liveCanvasRef = useRef(null);
  const photoCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const streamRef = useRef(null);
  const activeFrameRef = useRef(activeFrame);

  // Keep activeFrameRef in sync for the animation loop
  useEffect(() => {
    activeFrameRef.current = activeFrame;
  }, [activeFrame]);

  // Preload all frames & Initialize MediaPipe Face Mesh on Mount
  useEffect(() => {
    preloadAllFrames(PRODUCTS);
    initMediaPipeFaceMesh();
  }, []);

  // -------------------------------------------------------------
  // LIVE CAMERA STREAM & 60 FPS 3D TRACKING LOOP
  // -------------------------------------------------------------
  useEffect(() => {
    let isActive = true;

    if (tryOnMode === 'camera') {
      const startLiveCamera = async () => {
        setCameraError('');
        setIsCameraActive(false);

        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user'
            },
            audio: false
          });

          if (!isActive) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }

          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play().then(() => {
                if (isActive) {
                  setIsCameraActive(true);
                  startRenderLoop();
                }
              }).catch(err => {
                console.warn("Video play error:", err);
              });
            };
          }
        } catch (err) {
          console.error("Camera access error:", err);
          if (isActive) {
            setCameraError('Camera access was blocked or is unavailable. Please allow webcam permissions or upload a photo.');
          }
        }
      };

      startLiveCamera();
    } else {
      stopCamera();
    }

    return () => {
      isActive = false;
      stopCamera();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [tryOnMode]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Continuous 60 FPS Face Tracking & Canvas Render Loop
  const startRenderLoop = () => {
    let frameCounter = 0;

    const renderLoop = async () => {
      const video = videoRef.current;
      const canvas = liveCanvasRef.current;

      if (video && canvas && video.readyState >= 2) {
        const w = video.videoWidth || 640;
        const h = video.videoHeight || 480;

        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }

        const ctx = canvas.getContext('2d');

        // 1. Draw Mirrored Video Frame
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, w, h);
        ctx.restore();

        // 2. Run landmark detection periodically
        frameCounter++;
        if (frameCounter % 2 === 0) {
          try {
            await detectLandmarksOnElement(video);
          } catch (e) {}
        }

        // 3. Extract 3D Landmarks & Composite Commercial Studio Glasses
        const landmarks = getFaceLandmarks(w, h);
        if (landmarks) {
          const mirroredLandmarks = {
            ...landmarks,
            leftEye: { x: w - landmarks.leftEye.x, y: landmarks.leftEye.y },
            rightEye: { x: w - landmarks.rightEye.x, y: landmarks.rightEye.y },
            noseBridge: { x: w - landmarks.noseBridge.x, y: landmarks.noseBridge.y },
            angle: -landmarks.angle,
            yawOffset: -landmarks.yawOffset
          };

          drawPhotorealisticGlasses(ctx, activeFrameRef.current, mirroredLandmarks);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);
  };

  // -------------------------------------------------------------
  // PHOTO MODE: HIGH-RES USER IMAGE TRY-ON
  // -------------------------------------------------------------
  const drawPhotoOverlay = useCallback((landmarks, frame) => {
    if (!photoCanvasRef.current || !landmarks || !frame) return;
    const canvas = photoCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPhotorealisticGlasses(ctx, frame, landmarks, () => {
      drawPhotoOverlay(landmarks, frame);
    });
  }, []);

  const handlePhotoLoaded = async (e) => {
    const img = e.target;
    if (!img || !photoCanvasRef.current) return;

    const canvas = photoCanvasRef.current;
    canvas.width = img.naturalWidth || img.width || 640;
    canvas.height = img.naturalHeight || img.height || 480;

    setIsProcessingPhoto(true);
    await detectLandmarksOnElement(img);

    const landmarks = getFaceLandmarks(canvas.width, canvas.height);
    setLandmarksCache(landmarks);

    if (landmarks) {
      drawPhotoOverlay(landmarks, activeFrame);
    }
    setIsProcessingPhoto(false);
  };

  useEffect(() => {
    if (tryOnMode === 'photo' && landmarksCache && activeFrame) {
      drawPhotoOverlay(landmarksCache, activeFrame);
    }
  }, [tryOnMode, activeFrame, landmarksCache, drawPhotoOverlay]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsProcessingPhoto(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhotoUrl(event.target.result);
        setTryOnMode('photo');
        setIsProcessingPhoto(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Switch Frame in Carousel
  const handleSelectFrame = (prod) => {
    setActiveFrame(prod);
    onSelectProduct?.(prod);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col relative">
        
        {/* Top Title Bar & Mode Switcher */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between relative bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/20 text-teal-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-teal-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 3D AI Live AR
            </span>
            <h3 className="text-base font-extrabold font-['Outfit']">Lenskart 3D Virtual Try-On</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setTryOnMode('camera')}
                className={`text-[11px] font-bold px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                  tryOnMode === 'camera' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Camera className="w-3 h-3" /> Live Camera
              </button>
              <button
                onClick={() => {
                  if (!userPhotoUrl) {
                    fileInputRef.current?.click();
                  } else {
                    setTryOnMode('photo');
                  }
                }}
                className={`text-[11px] font-bold px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                  tryOnMode === 'photo' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Upload className="w-3 h-3" /> Photo Mode
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ---------------- LIVE CAMERA AR VIEWPORT ---------------- */}
        {tryOnMode === 'camera' && (
          <div className="relative w-full aspect-[4/3] bg-slate-950 flex items-center justify-center overflow-hidden">
            {/* Hidden Raw Video Stream Source */}
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="hidden"
            />

            {/* 60 FPS Mirrored AR Composite Canvas */}
            <canvas
              ref={liveCanvasRef}
              className="w-full h-full object-cover"
            />

            {/* Loading Camera Indicator */}
            {!isCameraActive && !cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm text-white text-sm gap-2 z-20">
                <div className="w-8 h-8 border-3 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-semibold text-teal-300">Connecting Live Camera...</span>
              </div>
            )}

            {/* Error Message & Upload Fallback */}
            {cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 text-white p-6 text-center z-20">
                <AlertCircle className="w-8 h-8 text-rose-400 mb-2" />
                <p className="text-xs font-medium text-slate-300 max-w-xs mb-3">{cameraError}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary text-xs py-2.5 px-5 rounded-xl flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Selfie Photo
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------- PHOTO MODE: HIGH-RES PORTRAIT TRY-ON ---------------- */}
        {tryOnMode === 'photo' && (
          <div className="relative w-full aspect-[4/3] bg-slate-950 flex items-center justify-center overflow-hidden p-2">
            {userPhotoUrl ? (
              <div className="relative w-full h-full flex items-center justify-center rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
                <img
                  id="user-tryon-image"
                  src={userPhotoUrl}
                  alt="User Portrait"
                  className="w-full h-full object-contain"
                  onLoad={handlePhotoLoaded}
                />
                <canvas
                  id="tryon-canvas"
                  ref={photoCanvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
                {isProcessingPhoto && (
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="text-xs font-bold text-teal-300 bg-slate-900/90 px-4 py-2 rounded-full border border-teal-500/40 animate-pulse">
                      Fitting 3D Eyewear...
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 text-white">
                <Upload className="w-10 h-10 text-teal-400 mb-2" />
                <p className="text-sm font-bold mb-3">Upload a Portrait Photo</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary text-xs py-2.5 px-5 rounded-xl"
                >
                  Choose Image
                </button>
              </div>
            )}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
        />

        {/* Selected Frame Specs Strip */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900">{activeFrame.name}</span>
            <span className="text-slate-500 ml-2">({activeFrame.brand})</span>
          </div>
          <span className="font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
            ₹{activeFrame.price}
          </span>
        </div>

        {/* Frame Swapping Carousel */}
        <div className="p-3 bg-slate-50 overflow-x-auto flex items-center gap-3 no-scrollbar">
          {PRODUCTS.map((prod) => {
            const thumbSrc = prod.image || prod.framePng || '/frames/frame1.jpg';
            const isSelected = activeFrame.sku === prod.sku || activeFrame.id === prod.id;
            return (
              <button
                key={prod.id}
                onClick={() => handleSelectFrame(prod)}
                className={`shrink-0 w-24 p-1.5 rounded-xl border bg-white transition-all text-left ${
                  isSelected ? 'border-2 border-teal-500 shadow-md scale-105 ring-2 ring-teal-400/20' : 'border-slate-200 opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={thumbSrc}
                  alt={prod.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/frames/frame1.jpg';
                  }}
                  className="h-8 w-full object-contain"
                />
                <p className="text-[10px] font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                <p className="text-[9px] text-teal-600 font-semibold">₹{prod.price}</p>
              </button>
            );
          })}
        </div>

        {/* Bottom Action Row */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Photo
          </button>

          <button
            onClick={() => {
              onAddToCart({
                product: activeFrame,
                lensPackage: { name: 'Classic UV400 G-15 Lenses', price: 0 },
                totalPrice: activeFrame.price,
                quantity: 1
              });
              onClose();
            }}
            className="btn-primary py-2.5 px-6 text-xs rounded-xl font-bold flex-1 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Select Lenses & Buy (₹{activeFrame.price})</span>
          </button>
        </div>

      </div>
    </div>
  );
}
