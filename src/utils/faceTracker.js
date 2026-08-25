/**
 * Lenskart High-Definition Commercial Eyewear AR Compositing Engine.
 */

let faceMeshInstance = null;
let isMediaPipeReady = false;
let currentLandmarksCache = null;
const loadedImagesCache = {};

// Preload all real studio cutouts into browser memory
export function preloadAllFrames(products) {
  if (!products) return;
  products.forEach(p => {
    const src = p.framePng || p.image;
    if (src && !loadedImagesCache[src]) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      loadedImagesCache[src] = img;
    }
  });
}

export async function initMediaPipeFaceMesh(onResultsCallback) {
  if (window.FaceMesh) {
    setupFaceMesh(onResultsCallback);
    return;
  }

  const script1 = document.createElement('script');
  script1.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
  script1.crossOrigin = 'anonymous';

  const script2 = document.createElement('script');
  script2.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js';
  script2.crossOrigin = 'anonymous';

  document.head.appendChild(script1);
  document.head.appendChild(script2);

  let loadedCount = 0;
  const checkLoaded = () => {
    loadedCount++;
    if (loadedCount === 2 || window.FaceMesh) {
      setupFaceMesh(onResultsCallback);
    }
  };

  script1.onload = checkLoaded;
  script2.onload = checkLoaded;
}

function setupFaceMesh(onResultsCallback) {
  if (!window.FaceMesh || faceMeshInstance) return;
  try {
    faceMeshInstance = new window.FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMeshInstance.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.3,
      minTrackingConfidence: 0.3
    });

    faceMeshInstance.onResults((results) => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        currentLandmarksCache = results.multiFaceLandmarks[0];
        isMediaPipeReady = true;
        if (onResultsCallback) onResultsCallback(currentLandmarksCache);
      } else {
        currentLandmarksCache = null;
      }
    });
  } catch (e) {
    console.warn("MediaPipe init error:", e);
  }
}

export async function detectLandmarksOnElement(imageOrVideoElement) {
  if (faceMeshInstance && imageOrVideoElement) {
    try {
      await faceMeshInstance.send({ image: imageOrVideoElement });
    } catch (e) {}
  }
}

export function detectFaceShape(landmarks) {
  return {
    shape: "Oval",
    description: "Balanced proportions with smooth jawline.",
    recommendedShapes: ["Rectangle", "Square", "Aviator"],
    badgeColor: "#00bac6"
  };
}

/**
 * Extract 3D Facial Landmarks
 */
export function getFaceLandmarks(canvasWidth, canvasHeight) {
  const width = canvasWidth;
  const height = canvasHeight;

  if (isMediaPipeReady && currentLandmarksCache && currentLandmarksCache.length >= 468) {
    const lm = currentLandmarksCache;

    // Pupil Iris Centers
    const leftPupil = {
      x: (lm[468]?.x ?? (lm[33].x + lm[133].x) / 2) * width,
      y: (lm[468]?.y ?? (lm[33].y + lm[133].y) / 2) * height
    };

    const rightPupil = {
      x: (lm[473]?.x ?? (lm[362].x + lm[263].x) / 2) * width,
      y: (lm[473]?.y ?? (lm[362].y + lm[263].y) / 2) * height
    };

    // Nose Bridge Top (Landmark 168 / Landmark 6)
    const noseBridge = {
      x: (lm[168]?.x ?? lm[6].x) * width,
      y: (lm[168]?.y ?? lm[6].y) * height
    };

    // Inter-Pupillary Distance (IPD)
    const ipd = Math.hypot(rightPupil.x - leftPupil.x, rightPupil.y - leftPupil.y);
    
    // Roll Angle (tilt between eyes)
    const rollAngle = Math.atan2(rightPupil.y - leftPupil.y, rightPupil.x - leftPupil.x);

    // Yaw Perspective
    const eyeMidX = (leftPupil.x + rightPupil.x) / 2;
    const yawOffset = (noseBridge.x - eyeMidX) / (ipd || 1);
    const yawScaleX = 1 - Math.min(Math.abs(yawOffset) * 0.25, 0.15);

    return {
      leftEye: leftPupil,
      rightEye: rightPupil,
      noseBridge,
      ipd,
      eyeDistance: ipd,
      angle: rollAngle,
      yawOffset,
      yawScaleX,
      isRealTracking: true
    };
  }

  // Smooth fallback centered in the upper-middle of video
  const centerX = width * 0.5;
  const centerY = height * 0.42;
  const ipd = width * 0.24;

  return {
    leftEye: { x: centerX - ipd / 2, y: centerY },
    rightEye: { x: centerX + ipd / 2, y: centerY },
    noseBridge: { x: centerX, y: centerY + 6 },
    ipd,
    eyeDistance: ipd,
    angle: 0,
    yawOffset: 0,
    yawScaleX: 1,
    isRealTracking: false
  };
}

/**
 * Pure Commercial Studio Cutout Compositor
 */
export function drawPhotorealisticGlasses(ctx, product, landmarks, onRedrawNeeded) {
  if (!ctx || !landmarks || !product) return;

  const { leftEye, rightEye, noseBridge, angle, ipd, yawScaleX } = landmarks;
  const frameSrc = product.framePng || product.frame_path || product.image || '/frames/frame_wayfarer_2.png';

  if (!loadedImagesCache[frameSrc]) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (onRedrawNeeded) onRedrawNeeded();
    };
    img.src = frameSrc;
    loadedImagesCache[frameSrc] = img;
  }

  const rawImg = loadedImagesCache[frameSrc];
  if (!rawImg || !rawImg.complete || rawImg.naturalWidth === 0) return;

  const glassesWidth = ipd * 2.32;
  const aspectRatio = (rawImg.naturalHeight / (rawImg.naturalWidth || 1)) || 0.42;
  const glassesHeight = glassesWidth * aspectRatio;

  const midX = (leftEye.x + rightEye.x) / 2;
  const midY = noseBridge.y - ipd * 0.05;

  // -------------------------------------------------------------
  // LAYER 1: NATURAL NOSE BRIDGE & CHEEK AMBIENT DROP-SHADOW
  // -------------------------------------------------------------
  ctx.save();
  ctx.translate(midX, midY);
  ctx.rotate(angle);
  ctx.scale(yawScaleX || 1, 1);

  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 8;

  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.beginPath();
  ctx.ellipse(0, glassesHeight * 0.12, glassesWidth * 0.22, glassesHeight * 0.10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // -------------------------------------------------------------
  // LAYER 2: AUTHENTIC HIGH-DEFINITION STUDIO EYEWEAR CUTOUT
  // -------------------------------------------------------------
  ctx.save();
  ctx.translate(midX, midY);
  ctx.rotate(angle);
  ctx.scale(yawScaleX || 1, 1);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    rawImg,
    -glassesWidth / 2,
    -glassesHeight * 0.48,
    glassesWidth,
    glassesHeight
  );

  ctx.restore();
}
