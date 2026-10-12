import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";

const spaceGrotesk = loadSpaceGrotesk("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});

const plexMono = loadPlexMono("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});

export const HEADLINE_FONT = spaceGrotesk.fontFamily;
export const MONO_FONT = plexMono.fontFamily;

export const BLACK = "#0e0e0c";
export const CREAM = "#f2edd8";
export const REMOTION_BLUE = "#0b84f3";
