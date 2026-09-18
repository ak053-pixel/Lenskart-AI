# Lenskart AR Virtual Try-On Engine (Beta)

An enhanced augmented reality (AR) virtual try-on interface built to deliver precise frame placement, fit simulation, and spatial alignment under dynamic viewing angles and lighting variations.

> **Status: Active Development / Prototype**  
> This project is an ongoing experimental rebuild focused on refining frame placement accuracy and stress-testing rendering pipelines. It is **not fully optimized for production** and serves as an active testbed for performance and calibration improvements.

---

## Overview

This application evaluates and enhances real-time AR try-on performance for eyewear. The current iteration focuses on:

* **Fit & Pressure Simulation:** Modeling structural frame positioning, temple tension, and bridge contact points for more realistic physical placement on facial landmarks.
* **Rendering Pipelines:** Testing lightweight, low-latency 3D frame rendering directly in the browser.
* **Rapid Prototyping:** Powered by Vite with fast Hot Module Replacement (HMR) to iterate quickly on facial mesh anchors and geometry adjustments.

---

## Tech Stack & Architecture

* **Frontend:** React 19 + Vite
* **Linting & Code Quality:** [Oxlint](https://oxc.rs/) for high-speed static code analysis
* **Compiler / Transpiler Options:**
  * [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) (via Oxc)
  * [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) (via SWC)

---

## Known Limitations & Current Focus

* **Performance Overhead:** Mesh computations and real-time shader pipelines are currently unoptimized for lower-tier mobile hardware.
* **Calibration Drift:** Edge-case lighting environments and extreme head tilts may introduce minor tracking latency.
* **React Compiler:** Disabled by default during the prototyping phase to prioritize build speed and raw HMR latency. (To experiment with it, refer to the [React Compiler documentation](https://react.dev/learn/react-compiler/installation)).

---

## Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* npm / pnpm / yarn

### Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run Oxlint checks
npx oxlint
