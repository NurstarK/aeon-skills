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
import { BLACK, CREAM, HEADLINE_FONT, MONO_FONT, REMOTION_BLUE } from "../theme";

export const Listing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Listing"
      style={{
        backgroundColor: CREAM,
        justifyContent: "center",
        alignItems: "center",
        gap: 48,
      }}
    >
      <Interactive.Div
        name="Breadcrumb"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontFamily: MONO_FONT,
          fontSize: 34,
          color: BLACK,
          opacity: interpolate(frame, [0.1 * fps, 0.6 * fps], [0, 0.7], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <CanvasImage
          src={staticFile("remotion-logo.svg")}
          style={{ width: 44, height: 46 }}
        />
        remotion.dev/docs/resources
      </Interactive.Div>
      <Interactive.Div
        name="Headline"
        style={{
          fontFamily: HEADLINE_FONT,
          fontWeight: 700,
          fontSize: 108,
          color: BLACK,
          textAlign: "center",
          lineHeight: 1.1,
          opacity: interpolate(frame, [0.3 * fps, 0.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(
            frame,
            [0.3 * fps, 0.9 * fps],
            ["0px 40px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        Aeon is now in the
        <br />
        <span style={{ color: REMOTION_BLUE }}>Remotion Resources</span>
      </Interactive.Div>
      <Interactive.Div
        name="ListingCard"
        style={{
          width: 1360,
          backgroundColor: "#ffffff",
          border: `3px solid ${BLACK}`,
          borderRadius: 20,
          boxShadow: `14px 14px 0 ${BLACK}`,
          padding: "44px 56px",
          opacity: interpolate(frame, [1.1 * fps, 1.7 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(
            frame,
            [1.1 * fps, 1.7 * fps],
            ["0px 70px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginBottom: 22,
          }}
        >
          <span
            style={{
              fontFamily: HEADLINE_FONT,
              fontWeight: 700,
              fontSize: 54,
              color: REMOTION_BLUE,
              textDecoration: "underline",
              textUnderlineOffset: 8,
            }}
          >
            Aeon
          </span>
          <span
            style={{
              fontFamily: MONO_FONT,
              fontWeight: 600,
              fontSize: 28,
              letterSpacing: "0.1em",
              color: CREAM,
              backgroundColor: BLACK,
              borderRadius: 999,
              padding: "8px 26px",
            }}
          >
            TOOLING
          </span>
        </div>
        <div
          style={{
            fontFamily: HEADLINE_FONT,
            fontWeight: 500,
            fontSize: 42,
            lineHeight: 1.4,
            color: "#333330",
          }}
        >
          Autonomous agent framework whose skill renders MP4 videos from an
          agent-authored storyboard using a bundled Remotion project.
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
