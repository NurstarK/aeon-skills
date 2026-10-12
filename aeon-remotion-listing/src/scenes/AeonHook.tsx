import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLACK, CREAM, MONO_FONT } from "../theme";

export const AeonHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="AeonHook"
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CanvasImage
        name="HalftoneBackdrop"
        src={staticFile("aeon-mark.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: interpolate(frame, [0, 1 * fps], [0, 0.14], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0, 4 * fps], [1.05, 1.18], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      />
      <Interactive.Div
        name="AeonLogo"
        style={{
          scale: interpolate(frame, [0.2 * fps, 1.1 * fps], [0.6, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 14 }),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [0.2 * fps, 0.7 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <CanvasImage
          src={staticFile("logo.png")}
          style={{ width: 760, height: "auto" }}
        />
      </Interactive.Div>
      <Interactive.Div
        name="Tagline"
        style={{
          marginTop: 24,
          fontFamily: MONO_FONT,
          fontSize: 40,
          fontWeight: 400,
          letterSpacing: "0.35em",
          color: CREAM,
          opacity: interpolate(frame, [1.2 * fps, 1.8 * fps], [0, 0.85], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(
            frame,
            [1.2 * fps, 1.8 * fps],
            ["0px 24px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        AUTONOMOUS AGENT FRAMEWORK
      </Interactive.Div>
    </AbsoluteFill>
  );
};
