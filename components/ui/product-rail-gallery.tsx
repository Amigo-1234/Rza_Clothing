"use client";

import * as React from "react";
import { createPortal } from "react-dom";

export type GarmentKind = "tee" | "knit" | "hoodie" | "shirt" | "jacket" | "coat";

export interface RailGarment {
  id: string;
  /** Accessible name, caption and detail title. */
  name: string;
  description?: string;
  /** Built-in illustration, used when no image is supplied. */
  kind?: GarmentKind;
  /** Fabric colour of the illustration (any CSS colour). */
  color?: string;
  /** Trim colour for ribs, cords and buttons. */
  trim?: string;
  /** Front photo. Best as a transparent cut-out on a 200 × 310 portrait canvas. Front, back and side photos of one piece must share the same canvas and scale, or the piece changes size as it turns. */
  image?: string;
  /** Back photo; the front photo is reused when omitted. */
  backImage?: string;
  /** Side-on photo shown while the piece rests on the rail; omit to show the front photo turned away. */
  sideImage?: string;
  /** Short hang-tag text such as a price or a size. */
  tag?: string;
  /** Short facts listed in the detail view. */
  details?: string[];
}

export interface ClothingRailHeroLabels {
  front: string;
  back: string;
  close: string;
  show: string;
}

export interface ClothingRailHeroProps extends React.ComponentProps<"section"> {
  items: RailGarment[];
  eyebrow?: string;
  heading?: string;
  /** Shown under the rail while nothing is turned to the front. */
  caption?: string;
  /** Call to action rendered under the caption. */
  action?: React.ReactNode;
  /** Turns the pieces to the front one by one until the visitor interacts. */
  autoplay?: boolean;
  /** Milliseconds each piece faces the front during autoplay. */
  interval?: number;
  /** Drawn hanger. Use "none" when your photos already include a hanger with its hook at the top. */
  hanger?: "wood" | "matte" | "none";
  labels?: ClothingRailHeroLabels;
  onOpenChange?: (index: number | null) => void;
}

const VB_W = 200;
const VB_H = 310;
const ASPECT = VB_W / VB_H;
const HOOK_TOP = 4;
const RAIL_R = 4.6;
const REST = -70;
const PERSPECTIVE = 1100;
const GAP = 0.035;
const MAX_H = 400;
const MIN_WIDE_H = 200;
const CAROUSEL_H = 340;
const DEFAULT_LABELS: ClothingRailHeroLabels = { front: "Front", back: "Back", close: "Close", show: "Show" };

type Tone = { d: string; t: number };
type Art = {
  body: string;
  sleeves: string[];
  under?: string;
  hood?: string;
  ribs: string[];
  panels: Tone[];
  seams: string[];
  stitches: string[];
  folds: string[];
  cords?: string[];
  buttons?: number[][];
};

const CREW = "M80,34 C88,45 112,45 120,34";

const ART = {
  tee: {
    front: {
      body: `${CREW} C132,36 146,40 156,45 C160,48 163,52 164,57 C158,72 152,88 152,102 L153,236 C128,241 72,241 47,236 L48,102 C48,88 42,72 36,57 C37,52 40,48 44,45 C54,40 68,36 80,34 Z`,
      sleeves: ["M44,45 C38,47 33,50 31,55 C24,64 17,76 13,92 C18,100 24,106 30,110 C35,106 42,102 48,102 C47,84 45,62 44,45 Z", "M156,45 C162,47 167,50 169,55 C176,64 183,76 187,92 C182,100 176,106 170,110 C165,106 158,102 152,102 C153,84 155,62 156,45 Z"],
      under: "M80,34 C90,30 110,30 120,34 C112,45 88,45 80,34 Z",
      ribs: ["M80,34 C88,45 112,45 120,34 L124,36 C114,50 86,50 76,36 Z"],
      panels: [],
      seams: ["M80,34 C68,36 54,40 44,45", "M120,34 C132,36 146,40 156,45", "M48,102 C47,84 45,62 44,45", "M152,102 C153,84 155,62 156,45"],
      stitches: ["M14,93 C19,101 25,106 30,109", "M186,93 C181,101 175,106 170,109", "M50,229 C74,233 126,233 150,229"],
      folds: ["M40,56 C58,76 76,94 90,120", "M160,56 C142,76 124,94 110,120", "M70,126 C66,164 72,204 66,234", "M131,128 C135,164 129,204 134,234", "M100,112 C98,160 103,204 100,236", "M31,62 C27,74 23,84 21,96", "M169,62 C173,74 177,84 179,96", "M78,50 C88,58 112,58 122,50"],
    },
    back: {
      body: "M80,34 C90,31 110,31 120,34 C132,36 146,40 156,45 C160,48 163,52 164,57 C158,72 152,88 152,102 L153,236 C128,241 72,241 47,236 L48,102 C48,88 42,72 36,57 C37,52 40,48 44,45 C54,40 68,36 80,34 Z",
      sleeves: ["M44,45 C38,47 33,50 31,55 C24,64 17,76 13,92 C18,100 24,106 30,110 C35,106 42,102 48,102 C47,84 45,62 44,45 Z", "M156,45 C162,47 167,50 169,55 C176,64 183,76 187,92 C182,100 176,106 170,110 C165,106 158,102 152,102 C153,84 155,62 156,45 Z"],
      ribs: ["M80,34 C90,31 110,31 120,34 L121,38 C110,35 90,35 79,38 Z"],
      panels: [],
      seams: ["M80,34 C68,36 54,40 44,45", "M120,34 C132,36 146,40 156,45"],
      stitches: ["M14,93 C19,101 25,106 30,109", "M186,93 C181,101 175,106 170,109", "M50,229 C74,233 126,233 150,229"],
      folds: ["M40,56 C60,74 80,88 96,104", "M160,56 C140,74 120,88 104,104", "M72,120 C68,164 74,204 68,234", "M128,122 C132,164 126,204 132,234", "M100,60 C98,150 102,200 100,236", "M31,62 C27,74 23,84 21,96", "M169,62 C173,74 177,84 179,96"],
    },
  },
  knit: {
    front: {
      body: "M80,34 C88,46 112,46 120,34 L158,46 C162,52 163,60 163,70 L163,226 C140,231 60,231 37,226 L37,70 C37,60 38,52 42,46 Z",
      sleeves: ["M42,46 C32,52 27,62 26,76 L20,216 C26,221 36,222 44,219 L47,98 C46,80 45,62 42,46 Z", "M158,46 C168,52 173,62 174,76 L180,216 C174,221 164,222 156,219 L153,98 C154,80 155,62 158,46 Z"],
      under: "M80,34 C90,30 110,30 120,34 C112,46 88,46 80,34 Z",
      ribs: ["M37,211 L163,211 L163,226 C140,231 60,231 37,226 Z", "M21,203 L45,206 L44,219 C36,222 26,221 20,216 Z", "M179,203 L155,206 L156,219 C164,222 174,221 180,216 Z", "M80,34 C88,46 112,46 120,34 L125,37 C115,53 85,53 75,37 Z"],
      panels: [],
      seams: ["M47,98 C46,80 45,62 42,46", "M153,98 C154,80 155,62 158,46"],
      stitches: [],
      folds: ["M66,60 C62,110 70,160 64,210", "M134,62 C138,112 130,162 136,210", "M100,56 C98,110 102,160 100,210", "M33,80 C31,130 33,170 30,204", "M167,80 C169,130 167,170 170,204"],
    },
    back: {
      body: "M80,34 C90,31 110,31 120,34 L158,46 C162,52 163,60 163,70 L163,226 C140,231 60,231 37,226 L37,70 C37,60 38,52 42,46 Z",
      sleeves: ["M42,46 C32,52 27,62 26,76 L20,216 C26,221 36,222 44,219 L47,98 C46,80 45,62 42,46 Z", "M158,46 C168,52 173,62 174,76 L180,216 C174,221 164,222 156,219 L153,98 C154,80 155,62 158,46 Z"],
      ribs: ["M37,211 L163,211 L163,226 C140,231 60,231 37,226 Z", "M21,203 L45,206 L44,219 C36,222 26,221 20,216 Z", "M179,203 L155,206 L156,219 C164,222 174,221 180,216 Z", "M80,34 C90,31 110,31 120,34 L122,39 C110,35 90,35 78,39 Z"],
      panels: [],
      seams: ["M47,98 C46,80 45,62 42,46", "M153,98 C154,80 155,62 158,46"],
      stitches: [],
      folds: ["M68,60 C64,110 70,160 66,210", "M132,62 C136,112 130,162 134,210", "M100,50 C99,110 101,160 100,210"],
    },
  },
  hoodie: {
    front: {
      body: "M80,36 C88,47 112,47 120,36 L160,48 C164,54 165,62 165,72 L165,228 C141,233 59,233 35,228 L35,72 C35,62 36,54 40,48 Z",
      sleeves: ["M40,48 C30,54 25,64 24,80 L18,218 C24,223 35,224 43,221 L46,100 C45,82 43,64 40,48 Z", "M160,48 C170,54 175,64 176,80 L182,218 C176,223 165,224 157,221 L154,100 C155,82 157,64 160,48 Z"],
      hood: "M72,42 C64,28 68,12 86,8 L114,8 C132,12 136,28 128,42 C116,30 84,30 72,42 Z",
      under: "M78,38 C88,31 112,31 122,38 C112,48 88,48 78,38 Z",
      ribs: ["M35,213 L165,213 L165,228 C141,233 59,233 35,228 Z", "M19,205 L45,208 L43,221 C35,224 24,223 18,218 Z", "M181,205 L155,208 L157,221 C165,224 176,223 182,218 Z"],
      panels: [{ d: "M62,148 L138,148 L150,196 L50,196 Z", t: 0.035 }, { d: "M80,36 C76,46 80,56 92,60 L96,55 C88,52 84,45 85,38 Z", t: -0.12 }, { d: "M120,36 C124,46 120,56 108,60 L104,55 C112,52 116,45 115,38 Z", t: -0.12 }],
      seams: ["M62,148 L52,186", "M138,148 L148,186", "M46,100 C45,82 43,64 40,48", "M154,100 C155,82 157,64 160,48"],
      stitches: ["M64,151 L136,151", "M51,193 L149,193"],
      folds: ["M68,64 C64,110 70,140 66,148", "M132,66 C136,110 130,140 134,148", "M100,62 C98,100 102,130 100,148", "M31,84 C29,130 31,170 28,206", "M169,84 C171,130 169,170 172,206", "M76,198 C74,204 76,208 74,212", "M124,198 C126,204 124,208 126,212"],
      cords: ["M92,50 C91,72 89,88 90,104", "M108,50 C109,72 111,88 110,104"],
    },
    back: {
      body: "M80,36 C90,32 110,32 120,36 L160,48 C164,54 165,62 165,72 L165,228 C141,233 59,233 35,228 L35,72 C35,62 36,54 40,48 Z",
      sleeves: ["M40,48 C30,54 25,64 24,80 L18,218 C24,223 35,224 43,221 L46,100 C45,82 43,64 40,48 Z", "M160,48 C170,54 175,64 176,80 L182,218 C176,223 165,224 157,221 L154,100 C155,82 157,64 160,48 Z"],
      ribs: ["M35,213 L165,213 L165,228 C141,233 59,233 35,228 Z", "M19,205 L45,208 L43,221 C35,224 24,223 18,218 Z", "M181,205 L155,208 L157,221 C165,224 176,223 182,218 Z"],
      panels: [{ d: "M76,36 C66,50 64,82 80,110 C88,120 112,120 120,110 C136,82 134,50 124,36 C112,30 88,30 76,36 Z", t: -0.06 }],
      seams: ["M100,32 L100,118", "M46,100 C45,82 43,64 40,48", "M154,100 C155,82 157,64 160,48"],
      stitches: ["M80,108 C90,116 110,116 120,108"],
      folds: ["M70,120 C66,160 72,190 68,212", "M130,120 C134,160 128,190 132,212", "M31,84 C29,130 31,170 28,206", "M169,84 C171,130 169,170 172,206"],
    },
  },
  shirt: {
    front: {
      body: "M80,34 C88,40 112,40 120,34 L160,47 C164,53 165,60 165,70 L163,232 C150,244 124,242 100,238 C76,242 50,244 37,232 L35,70 C35,60 36,53 40,47 Z",
      sleeves: ["M40,47 C30,53 26,63 25,78 L21,204 L45,206 L47,98 C46,80 44,63 40,47 Z", "M160,47 C170,53 174,63 175,78 L179,204 L155,206 L153,98 C154,80 156,63 160,47 Z"],
      under: "M80,34 C90,29 110,29 120,34 L120,39 C110,34 90,34 80,39 Z",
      ribs: [],
      panels: [{ d: "M21,204 L45,206 L45,218 C37,220 28,220 21,217 Z", t: -0.05 }, { d: "M179,204 L155,206 L155,218 C163,220 172,220 179,217 Z", t: -0.05 }, { d: "M96,46 L104,46 L104,238 L96,238 Z", t: -0.03 }, { d: "M55,84 L87,84 L87,118 L71,124 L55,118 Z", t: 0.02 }, { d: "M113,84 L145,84 L145,118 L129,124 L113,118 Z", t: 0.02 }, { d: "M54,81 L88,81 L88,92 L71,96 L54,92 Z", t: -0.06 }, { d: "M112,81 L146,81 L146,92 L129,96 L112,92 Z", t: -0.06 }, { d: "M100,48 L80,34 C78,42 74,52 69,62 L90,64 Z", t: 0.04 }, { d: "M100,48 L120,34 C122,42 126,52 131,62 L110,64 Z", t: 0.04 }],
      seams: ["M96,64 L96,238", "M104,64 L104,238", "M47,98 C46,80 44,63 40,47", "M153,98 C154,80 156,63 160,47"],
      stitches: ["M57,116 L71,121 L85,116", "M115,116 L129,121 L143,116", "M39,230 C54,239 76,238 100,234 C124,238 146,239 161,230"],
      folds: ["M66,128 C62,170 68,200 62,234", "M134,128 C138,170 132,200 138,234", "M31,90 C29,130 31,170 28,200", "M169,90 C171,130 169,170 172,200"],
      buttons: [[100, 72], [100, 102], [100, 132], [100, 162], [100, 192], [100, 222], [71, 92], [129, 92]],
    },
    back: {
      body: "M80,34 C90,30 110,30 120,34 L160,47 C164,53 165,60 165,70 L163,232 C150,244 124,242 100,238 C76,242 50,244 37,232 L35,70 C35,60 36,53 40,47 Z",
      sleeves: ["M40,47 C30,53 26,63 25,78 L21,204 L45,206 L47,98 C46,80 44,63 40,47 Z", "M160,47 C170,53 174,63 175,78 L179,204 L155,206 L153,98 C154,80 156,63 160,47 Z"],
      ribs: [],
      panels: [{ d: "M21,204 L45,206 L45,218 C37,220 28,220 21,217 Z", t: -0.05 }, { d: "M179,204 L155,206 L155,218 C163,220 172,220 179,217 Z", t: -0.05 }, { d: "M80,34 C90,30 110,30 120,34 L122,41 C110,36 90,36 78,41 Z", t: 0.03 }, { d: "M40,47 L80,34 C90,30 110,30 120,34 L160,47 C162,56 163,62 164,68 C130,74 70,74 36,68 C37,62 38,56 40,47 Z", t: 0.025 }],
      seams: ["M36,68 C70,74 130,74 164,68", "M97,72 L97,238", "M103,72 L103,238"],
      stitches: ["M39,230 C54,239 76,238 100,234 C124,238 146,239 161,230"],
      folds: ["M70,90 C66,150 72,200 66,234", "M130,90 C134,150 128,200 134,234", "M31,90 C29,130 31,170 28,200", "M169,90 C171,130 169,170 172,200"],
    },
  },
  jacket: {
    front: {
      body: "M80,34 C88,40 112,40 120,34 L162,48 C166,54 167,61 167,72 L166,230 L34,230 L33,72 C33,61 34,54 38,48 Z",
      sleeves: ["M38,48 C28,54 24,64 23,80 L19,218 C26,222 37,222 44,219 L46,100 C45,82 42,64 38,48 Z", "M162,48 C172,54 176,64 177,80 L181,218 C174,222 163,222 156,219 L154,100 C155,82 158,64 162,48 Z"],
      under: "M80,34 C90,30 110,30 120,34 L122,40 C110,35 90,35 78,40 Z",
      ribs: [],
      panels: [{ d: "M100,58 L106,58 L106,230 L100,230 Z", t: -0.07 }, { d: "M112,86 L142,86 L142,118 L112,118 Z", t: 0.025 }, { d: "M46,152 L88,152 L88,198 L46,198 Z", t: 0.025 }, { d: "M112,152 L154,152 L154,198 L112,198 Z", t: 0.025 }, { d: "M100,58 L80,34 C72,40 64,50 58,64 L90,72 Z", t: -0.04 }, { d: "M100,58 L120,34 C128,40 136,50 142,64 L110,72 Z", t: -0.04 }],
      seams: ["M100,58 L100,230", "M46,100 C45,82 42,64 38,48", "M154,100 C155,82 158,64 162,48"],
      stitches: ["M114,88 L140,88 L140,116 L114,116 Z", "M48,154 L86,154 L86,196 L48,196 Z", "M114,154 L152,154 L152,196 L114,196 Z", "M35,224 L165,224", "M22,208 L44,210", "M178,208 L156,210"],
      folds: ["M70,74 C66,110 72,130 68,150", "M130,122 C134,136 130,146 132,150", "M68,200 C66,212 70,220 66,228", "M30,92 C28,140 30,180 27,214", "M170,92 C172,140 170,180 173,214"],
      buttons: [[106, 84], [106, 118], [106, 152], [106, 186], [106, 218]],
    },
    back: {
      body: "M80,34 C90,30 110,30 120,34 L162,48 C166,54 167,61 167,72 L166,230 L34,230 L33,72 C33,61 34,54 38,48 Z",
      sleeves: ["M38,48 C28,54 24,64 23,80 L19,218 C26,222 37,222 44,219 L46,100 C45,82 42,64 38,48 Z", "M162,48 C172,54 176,64 177,80 L181,218 C174,222 163,222 156,219 L154,100 C155,82 158,64 162,48 Z"],
      ribs: [],
      panels: [{ d: "M80,34 C90,30 110,30 120,34 L126,46 C110,39 90,39 74,46 Z", t: -0.04 }],
      seams: ["M36,76 C70,82 130,82 164,76", "M46,100 C45,82 42,64 38,48", "M154,100 C155,82 158,64 162,48"],
      stitches: ["M35,224 L165,224", "M36,80 C70,86 130,86 164,80"],
      folds: ["M70,90 C66,150 72,196 68,228", "M130,90 C134,150 128,196 132,228", "M30,92 C28,140 30,180 27,214", "M170,92 C172,140 170,180 173,214"],
    },
  },
  coat: {
    front: {
      body: "M80,34 C88,40 112,40 120,34 L164,50 C168,56 169,63 169,74 L174,294 L26,294 L31,74 C31,63 32,56 36,50 Z",
      sleeves: ["M36,50 C26,56 22,66 21,82 L16,240 C23,244 34,244 42,241 L45,104 C44,86 40,66 36,50 Z", "M164,50 C174,56 178,66 179,82 L184,240 C177,244 166,244 158,241 L155,104 C156,86 160,66 164,50 Z"],
      under: "M80,34 C90,28 110,28 120,34 L118,42 C110,37 90,37 82,42 Z",
      ribs: [],
      panels: [{ d: "M100,128 L106,128 L106,294 L100,294 Z", t: -0.06 }, { d: "M100,128 L80,34 C74,44 70,56 66,72 L76,78 L70,90 Z", t: 0.045 }, { d: "M100,128 L120,34 C126,44 130,56 134,72 L124,78 L130,90 Z", t: 0.045 }, { d: "M42,206 L84,206 L84,217 L42,217 Z", t: -0.05 }, { d: "M116,206 L158,206 L158,217 L116,217 Z", t: -0.05 }],
      seams: ["M100,128 L100,294", "M45,104 C44,86 40,66 36,50", "M155,104 C156,86 160,66 164,50", "M42,217 L84,217", "M116,217 L158,217"],
      stitches: ["M28,288 L172,288"],
      folds: ["M60,96 C56,170 64,230 54,292", "M140,96 C144,170 136,230 146,292", "M84,140 C82,200 86,250 82,292", "M28,96 C26,150 28,200 24,236", "M172,96 C174,150 172,200 176,236"],
      buttons: [[112, 146], [112, 180], [112, 214]],
    },
    back: {
      body: "M80,34 C90,30 110,30 120,34 L164,50 C168,56 169,63 169,74 L174,294 L26,294 L31,74 C31,63 32,56 36,50 Z",
      sleeves: ["M36,50 C26,56 22,66 21,82 L16,240 C23,244 34,244 42,241 L45,104 C44,86 40,66 36,50 Z", "M164,50 C174,56 178,66 179,82 L184,240 C177,244 166,244 158,241 L155,104 C156,86 160,66 164,50 Z"],
      ribs: [],
      panels: [{ d: "M80,34 C90,30 110,30 120,34 L124,48 C110,41 90,41 76,48 Z", t: 0.04 }, { d: "M100,232 L106,232 L106,294 L100,294 Z", t: -0.07 }],
      seams: ["M100,44 L100,294", "M45,104 C44,86 40,66 36,50", "M155,104 C156,86 160,66 164,50"],
      stitches: ["M28,288 L172,288"],
      folds: ["M62,96 C58,170 66,230 56,292", "M138,96 C142,170 134,230 144,292", "M28,96 C26,150 28,200 24,236", "M172,96 C174,150 172,200 176,236"],
    },
  },
} as const;

const KINDS = ["tee", "knit", "hoodie", "shirt", "jacket", "coat"] as const;

const SIDE = {
  tee: { hem: 240, long: false, hood: false, width: 0.23 },
  knit: { hem: 232, long: true, hood: false, width: 0.25 },
  hoodie: { hem: 234, long: true, hood: true, width: 0.33 },
  shirt: { hem: 244, long: true, hood: false, width: 0.25 },
  jacket: { hem: 234, long: true, hood: false, width: 0.27 },
  coat: { hem: 296, long: true, hood: false, width: 0.27 },
} as const;

function sideShapes(kind: GarmentKind) {
  const side = SIDE[kind];
  const hem = side.hem;
  const cuff = side.long ? hem - 24 : 104;
  const body = `M86,60 C85,96 88,132 85,168 C83,196 84,${hem - 18} 85,${hem} C92,${hem + 5} 109,${hem + 5} 116,${hem} C117,${hem - 18} 118,196 116,168 C113,132 116,96 114,60 Z`;
  const sleeve = `M84,56 C84,47 90,43 100,43 C110,43 116,47 116,56 C117,${Math.round(cuff * 0.62)} 119,${cuff - 14} 119,${cuff - 2} C119,${cuff + 4} 116,${cuff + 7} 111,${cuff + 7} C100,${cuff + 8} 90,${cuff + 6} 83,${cuff + 2} C80,${cuff - 1} 80,${cuff - 6} 81,${cuff - 10} C83,${cuff - 24} 83,70 84,56 Z`;
  const hood = side.hood ? "M110,46 C128,36 138,54 134,76 C130,90 118,94 113,86 C113,74 112,60 110,46 Z" : null;
  return { body, sleeve, hood, cuff };
}

function artFor(kind: GarmentKind, side: "front" | "back"): Art {
  const entry = ART[kind] as unknown as { front: Art; back: Art };
  return side === "front" ? entry.front : entry.back;
}

function silhouettePaths(art: Art) {
  return [art.body, ...art.sleeves, ...(art.hood ? [art.hood] : [])];
}

const maskCache = new Map();
function silhouetteMask(kind: GarmentKind, side: "front" | "back") {
  const key = `${kind}:${side}`;
  const cached = maskCache.get(key) as string | undefined;
  if (cached) return cached;
  const paths = silhouettePaths(artFor(kind, side)).map((d) => `<path d='${d}'/>`).join("");
  const url = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${VB_W} ${VB_H}' preserveAspectRatio='xMidYMin meet'>${paths}</svg>`)}")`;
  maskCache.set(key, url);
  return url;
}

function mix(color: string, amount: number) {
  if (amount === 0) return color;
  const keep = Math.round((1 - Math.min(1, Math.abs(amount))) * 1000) / 10;
  return `color-mix(in oklab, ${color} ${keep}%, ${amount > 0 ? "white" : "black"})`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lambert(angle: number) {
  const r = (angle * Math.PI) / 180;
  const diffuse = Math.max(0, Math.sin(r) * 0.42 + Math.cos(r) * 0.91);
  return 0.66 + 0.34 * diffuse;
}

function Defs({ uid }: { uid: string }) {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute" focusable="false">
      <defs>
        {KINDS.map((kind) => (["front", "back"] as const).map((side) => (
          <clipPath key={`${kind}-${side}`} id={`${uid}-clip-${kind}-${side}`}>
            {silhouettePaths(artFor(kind, side)).map((d) => <path key={d} d={d} />)}
          </clipPath>
        )))}
        <linearGradient id={`${uid}-volume`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="black" stopOpacity="0.34" />
          <stop offset="0.16" stopColor="black" stopOpacity="0.1" />
          <stop offset="0.42" stopColor="white" stopOpacity="0.07" />
          <stop offset="0.58" stopColor="white" stopOpacity="0.04" />
          <stop offset="0.84" stopColor="black" stopOpacity="0.12" />
          <stop offset="1" stopColor="black" stopOpacity="0.38" />
        </linearGradient>
        <linearGradient id={`${uid}-drape`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0.16" />
          <stop offset="0.22" stopColor="white" stopOpacity="0" />
          <stop offset="0.75" stopColor="black" stopOpacity="0.04" />
          <stop offset="1" stopColor="black" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`${uid}-sidevol`} gradientUnits="userSpaceOnUse" x1="80" x2="120" y1="0" y2="0">
          <stop offset="0" stopColor="white" stopOpacity="0.14" />
          <stop offset="0.28" stopColor="white" stopOpacity="0.04" />
          <stop offset="0.7" stopColor="black" stopOpacity="0.08" />
          <stop offset="0.95" stopColor="black" stopOpacity="0.3" />
          <stop offset="1" stopColor="black" stopOpacity="0.18" />
        </linearGradient>
        <filter id={`${uid}-cloth`} x="-12%" y="-4%" width="124%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016 0.028" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {KINDS.map((kind) => (
          <React.Fragment key={`side-${kind}`}>
            <clipPath id={`${uid}-sb-${kind}`}><path d={sideShapes(kind).body} /></clipPath>
            <clipPath id={`${uid}-ss-${kind}`}><path d={sideShapes(kind).sleeve} /></clipPath>
          </React.Fragment>
        ))}
        <linearGradient id={`${uid}-wood`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="color-mix(in oklab, sienna 55%, white)" />
          <stop offset="0.45" stopColor="color-mix(in oklab, sienna 80%, black)" />
          <stop offset="1" stopColor="color-mix(in oklab, sienna 45%, black)" />
        </linearGradient>
        <linearGradient id={`${uid}-woodgrain`} gradientUnits="userSpaceOnUse" spreadMethod="repeat" x1="0" x2="11" y1="0" y2="0.6">
          <stop offset="0" stopColor="black" stopOpacity="0" />
          <stop offset="0.45" stopColor="black" stopOpacity="0.16" />
          <stop offset="0.6" stopColor="white" stopOpacity="0.08" />
          <stop offset="1" stopColor="black" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-chrome`} gradientUnits="userSpaceOnUse" x1="98.5" x2="101.7" y1="0" y2="0">
          <stop offset="0" stopColor="color-mix(in oklab, white 45%, gray)" />
          <stop offset="0.35" stopColor="white" />
          <stop offset="0.78" stopColor="color-mix(in oklab, gray 65%, black)" />
          <stop offset="1" stopColor="color-mix(in oklab, gray 75%, white)" />
        </linearGradient>
        <pattern id={`${uid}-rib`} width="2.6" height="8" patternUnits="userSpaceOnUse">
          <rect width="1.1" height="8" fill="black" fillOpacity="0.2" />
          <rect x="1.3" width="0.7" height="8" fill="white" fillOpacity="0.08" />
        </pattern>
        <pattern id={`${uid}-knit`} width="5" height="4" patternUnits="userSpaceOnUse">
          <path d="M0,0 L2.5,4 L5,0" fill="none" stroke="black" strokeOpacity="0.09" strokeWidth="0.7" />
        </pattern>
        <filter id={`${uid}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.55" />
          </feComponentTransfer>
        </filter>
        <filter id={`${uid}-soft`} x="-20%" y="-5%" width="140%" height="110%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>
    </svg>
  );
}

const HOOK = "M100,36 L100,-0.4 C100,-3.4 102.2,-4.2 103.9,-2.8 C104.9,-2 105.4,-1.2 105.6,-0.2";
const HOOK_HI = "M99.5,30 L99.5,-0.2 C99.5,-2.4 101,-3.2 102.4,-2.6";
const BAR = "M38,57 Q70,38 100,36 Q130,38 162,57";
const BAR_HI = "M40,54.5 Q71,35.5 100,33.5 Q129,35.5 160,54.5";

function Hook({ uid }: { uid: string }) {
  return (
    <>
      <path d={HOOK} fill="none" stroke="black" strokeOpacity="0.28" strokeWidth="3.4" strokeLinecap="round" transform="translate(0.9 1.1)" />
      <path d={HOOK} fill="none" stroke={`url(#${uid}-chrome)`} strokeWidth="2.6" strokeLinecap="round" />
      <path d={HOOK_HI} fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="0.6" strokeLinecap="round" />
      <ellipse cx="105.9" cy="0.6" rx="1.9" ry="0.9" fill="black" fillOpacity="0.4" />
      <rect x="96" y="27" width="8" height="9" rx="2" fill={`url(#${uid}-chrome)`} />
      <rect x="97.2" y="28.2" width="2" height="6.6" rx="1" fill="white" fillOpacity="0.5" />
    </>
  );
}

function Hanger({ uid, side, kind, material }: { uid: string; side: "front" | "back"; kind: GarmentKind | null; material: "wood" | "matte" | "none" }) {
  const art = kind ? artFor(kind, side) : null;
  const bar = material === "wood" ? `url(#${uid}-wood)` : "currentColor";
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMin meet" className={`absolute inset-0 size-full overflow-visible ${material === "matte" ? "text-foreground/85" : ""}`}>
      {art?.hood && <path d={art.hood} fill="var(--garment-color)" />}
      {art?.hood && <path d={art.hood} fill="black" fillOpacity="0.22" />}
      {art?.under && <path d={art.under} fill="var(--garment-under)" />}
      {material !== "none" && (
        <>
          <path d={BAR} fill="none" stroke="black" strokeOpacity="0.25" strokeWidth="9.5" strokeLinecap="round" transform="translate(0.6 1.6)" />
          <path d={BAR} fill="none" stroke={bar} strokeWidth="8.5" strokeLinecap="round" />
          {material === "wood" && <path d={BAR} fill="none" stroke={`url(#${uid}-woodgrain)`} strokeWidth="8.5" strokeLinecap="round" />}
          <path d={BAR_HI} fill="none" stroke="white" strokeOpacity={material === "wood" ? 0.3 : 0.14} strokeWidth="1.1" strokeLinecap="round" />
          <Hook uid={uid} />
        </>
      )}
    </svg>
  );
}

function SideHanger({ uid, material }: { uid: string; material: "wood" | "matte" | "none" }) {
  if (material === "none") return null;
  const bar = material === "wood" ? `url(#${uid}-wood)` : "currentColor";
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMin meet" className={`absolute inset-0 size-full overflow-visible ${material === "matte" ? "text-foreground/85" : ""}`}>
      <path d="M97.8,35 L102.2,35 L104.5,50 L95.5,50 Z" fill={bar} />
      <path d="M98.6,36 L100,36 L100,49 L97.3,49 Z" fill="white" fillOpacity="0.22" />
      <Hook uid={uid} />
    </svg>
  );
}

function Fabric({ uid, kind, side, color, trim }: { uid: string; kind: GarmentKind; side: "front" | "back"; color: string; trim: string }) {
  const art = artFor(kind, side);
  const clip = `url(#${uid}-clip-${kind}-${side})`;
  const knitted = kind === "knit";
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMin meet" className="absolute inset-0 size-full overflow-visible">
      <path d={art.body} fill={color} />
      {art.sleeves.map((d) => <path key={d} d={d} fill={color} />)}
      <g clipPath={clip}>
        {knitted && <rect width={VB_W} height={VB_H} fill={`url(#${uid}-knit)`} />}
        {art.panels.map((panel) => <path key={panel.d} d={panel.d} fill={mix(color, panel.t)} />)}
        {art.ribs.map((d) => <path key={d} d={d} fill={mix(trim, 0)} />)}
        {art.ribs.map((d) => <path key={`${d}-rib`} d={d} fill={`url(#${uid}-rib)`} />)}
        <g filter={`url(#${uid}-soft)`} fill="none" strokeLinecap="round">
          {art.folds.map((d) => <path key={d} d={d} stroke="black" strokeOpacity="0.22" strokeWidth="4" />)}
          {art.folds.map((d) => <path key={`${d}-hi`} d={d} stroke="white" strokeOpacity="0.1" strokeWidth="2" transform="translate(2.2 0)" />)}
          {art.sleeves.map((d) => <path key={`${d}-edge`} d={d} stroke="black" strokeOpacity="0.2" strokeWidth="3" />)}
        </g>
        <rect width={VB_W} height={VB_H} fill={`url(#${uid}-volume)`} />
        <rect width={VB_W} height={VB_H} fill={`url(#${uid}-drape)`} />
        <rect width={VB_W} height={VB_H} filter={`url(#${uid}-grain)`} opacity="0.16" style={{ mixBlendMode: "multiply" }} />
      </g>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {art.seams.map((d) => <path key={d} d={d} stroke="black" strokeOpacity="0.22" strokeWidth="0.8" />)}
        {art.stitches.map((d) => <path key={d} d={d} stroke={mix(color, 0.35)} strokeOpacity="0.5" strokeWidth="0.6" strokeDasharray="1.6 1.4" />)}