# The Observable Self — Portfolio v2

Creative developer portfolio for **Sanket Nehe**, implementing a persistent WebGL cosmic identity sequence (`Three.js` / `React Three Fiber` / `GLSL` / `GSAP` / `Zustand`) transitioning seamlessly into the React DOM engineering portfolio.

## Stack

- **Framework:** React 19 + TypeScript + Vite
- **3D / Shaders:** Three.js (`MeshSurfaceSampler`, `GLTFLoader`, `MeshoptDecoder`), `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, custom GLSL vertex/fragment shaders (`noise.glsl`, `human.vert.glsl`, `human.frag.glsl`, `starfield.vert.glsl`, `starfield.frag.glsl`)
- **Animation & State:** GSAP timeline + Zustand state machine (`BOOT > COSMIC_IDLE > IDENTITY_READY > DECONSTRUCTING > WARP_ACCELERATION > WARP_TRAVEL > WARP_DECELERATION > PORTFOLIO_REVEAL > PORTFOLIO_ACTIVE`)
- **Styling & Testing:** Tailwind CSS v4 + Playwright

## Human Asset Attribution (`public/models/human.glb`)

The static mesh in `public/models/human.glb` is packed from `supermans_upper_body_portrait.zip` (baked transforms, normals, and triangle indices):

- **Title:** Superman's upper body portrait
- **Author:** [IITheDarkness94II](https://sketchfab.com/IITheDarkness94II)
- **Source:** https://sketchfab.com/3d-models/supermans-upper-body-portrait-d53894716d184be7883ef0bf669e799a
- **License:** [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/) (recorded in `public/models/ATTRIBUTION.md`)

`src/experience/HumanParticles.tsx` samples points proportionally across mesh surface area using `MeshSurfaceSampler`, hides the solid mesh, and drives ambient edge drift, ray-based pointer dispersion with 2–4s gradual return, deconstruction, and continuous starfield morphing via custom GLSL shaders.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run test:e2e
```
