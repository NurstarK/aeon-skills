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
import { BLACK, CREAM, HEADLINE_FONT, MONO_FONT } from "../theme";

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Cta"
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
        gap: 64,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 72 }}
      >
        <Interactive.Div
          name="AeonLogoCta"
          style={{
            translate: interpolate(
              frame,
              [0.1 * fps, 0.8 * fps],
              ["-120px 0px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
            opacity: interpolate(frame, [0.1 * fps, 0.6 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <CanvasImage
            src={staticFile("logo.png")}
            style={{ width: 520, height: "auto" }}
          />
        </Interactive.Div>
        <Interactive.Div
          name="Times"
          style={{
            fontFamily: HEADLINE_FONT,
            fontWeight: 500,
            fontSize: 96,
            color: CREAM,
            opacity: interpolate(frame, [0.5 * fps, 0.9 * fps], [0, 0.7], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          ×
        </Interactive.Div>
        <Interactive.Div
          name="RemotionLogoCta"
          style={{
            translate: interpolate(
              frame,
              [0.1 * fps, 0.8 * fps],
              ["120px 0px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
            opacity: interpolate(frame, [0.1 * fps, 0.6 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <CanvasImage
            src={staticFile("remotion-logo.svg")}
            style={{ width: 260, height: 270 }}
          />
        </Interactive.Div>
      </div>
      <Interactive.Div
        name="Urls"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          fontFamily: MONO_FONT,
          fontSize: 44,
          color: CREAM,
          opacity: interpolate(frame, [1.0 * fps, 1.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(
            frame,
            [1.0 * fps, 1.6 * fps],
            ["0px 30px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        <div>remotion.dev/docs/resources</div>
        <div style={{ opacity: 0.6, fontSize: 36 }}>github.com/aeonfun/aeon</div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
