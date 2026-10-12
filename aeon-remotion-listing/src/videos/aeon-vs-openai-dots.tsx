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
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { BLACK, CREAM, HEADLINE_FONT, MONO_FONT, REMOTION_BLUE } from "../theme";

/*
 * STORYBOARD — aeon-vs-openai-dots
 * Source: https://www.aeon.fun/blog/aeon-vs-openai-dots ("aeon vs OpenAI Dots:
 * A real Open-Source Agent or a $500-a-Month Digital Employee?", 2026-09-30).
 * Comparison article -> comparison columns are the spine. Every number, label
 * and cell on screen is lifted verbatim from the article. Silent, 1920x1080
 * @ 30fps.
 *
 *  1. COLD OPEN (120f / 4.0s) — big "$500" counts $0->$500: OpenAI's new Pro
 *     tier, the blunt price hook. (CREAM)
 *  2. TITLE CARD (120f / 4.0s) — Aeon mark + "Aeon vs OpenAI Dots" + the core
 *     framing, "who owns the computer?" (BLACK — logo reads on black)
 *  3. COMPARE I (480f / 16.0s) — ownership axes as a two-column table
 *     (AEON vs DOTS): Runs on, Model, Source, Data. Staggered row reveals.
 *     (CREAM)
 *  4. EXTENSIBILITY (330f / 11.0s) — big-number contrast: 85 editable skills
 *     (aeon) vs 4,000+ plugins (Dots), both counters. (BLACK)
 *  5. COMPARE II (420f / 14.0s) — the sharp differentiators as a two-column
 *     table: Spend money, Audit trail, EU availability. (CREAM)
 *  6. CAVEAT (300f / 10.0s) — the honest limit, flat: Dots wins on zero setup;
 *     aeon still asks for homework, and its guardrails are cruder. (BLACK)
 *  7. CTA (210f / 7.0s) — aeon.fun/blog/aeon-vs-openai-dots + logo. (BLACK)
 *
 * Backgrounds alternate CREAM/BLACK; the two logo scenes (Title, Cta) sit on
 * BLACK like the house AeonHook/Cta scenes. Caveat->Cta is the one same-colour
 * cut, carried by a slide transition.
 *
 * Duration: 120+120+480+330+420+300+210 = 1980 frames of scene,
 * minus 6 x 15-frame transitions (90) = 1890 frames = 63.0s @ 30fps.
 */

const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const PAGE_PAD = 140; // >= 120px margin from every edge

// ---------------------------------------------------------------------------
// 1. COLD OPEN (CREAM)
// ---------------------------------------------------------------------------
export const DotsColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const count = Math.round(
    interpolate(frame, [0.3 * fps, 1.5 * fps], [0, 500], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    }),
  );

  return (
    <AbsoluteFill
      name="DotsColdOpen"
      style={{
        backgroundColor: CREAM,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 24,
      }}
    >
      <Interactive.Div
        name="BigPrice"
        style={{
          fontFamily: HEADLINE_FONT,
          fontWeight: 700,
          fontSize: 260,
          lineHeight: 1,
          color: REMOTION_BLUE,
          scale: interpolate(frame, [0.2 * fps, 1.1 * fps], [0.7, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 14 }),
            output: "perceptual-scale",
          }),
        }}
      >
        ${count}
      </Interactive.Div>
      <Interactive.Div
        name="ColdOpenLine"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 400,
          fontSize: 46,
          letterSpacing: "0.08em",
          color: BLACK,
          textAlign: "center",
          opacity: interpolate(frame, [1.3 * fps, 2.0 * fps], [0, 0.9], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
          translate: interpolate(
            frame,
            [1.3 * fps, 2.0 * fps],
            ["0px 26px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            },
          ),
        }}
      >
        a month for OpenAI's new Pro tier
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 2. TITLE CARD (BLACK)
// ---------------------------------------------------------------------------
export const DotsTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="DotsTitle"
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 40,
      }}
    >
      <Interactive.Div
        name="TitleLogo"
        style={{
          scale: interpolate(frame, [0.1 * fps, 1.0 * fps], [0.6, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 14 }),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [0.1 * fps, 0.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        <CanvasImage
          src={staticFile("logo.png")}
          style={{ width: 600, height: "auto" }}
        />
      </Interactive.Div>
      <Interactive.Div
        name="TitleHeadline"
        style={{
          fontFamily: HEADLINE_FONT,
          fontWeight: 700,
          fontSize: 100,
          color: CREAM,
          textAlign: "center",
          lineHeight: 1.05,
          opacity: interpolate(frame, [0.5 * fps, 1.1 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
          translate: interpolate(
            frame,
            [0.5 * fps, 1.1 * fps],
            ["0px 36px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            },
          ),
        }}
      >
        <span style={{ color: REMOTION_BLUE }}>Aeon</span> vs OpenAI Dots
      </Interactive.Div>
      <Interactive.Div
        name="TitleSub"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 400,
          fontSize: 42,
          letterSpacing: "0.04em",
          color: CREAM,
          opacity: interpolate(frame, [1.0 * fps, 1.6 * fps], [0, 0.75], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        who owns the computer?
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shared two-column comparison table (AEON vs DOTS)
// ---------------------------------------------------------------------------
type Row = { axis: string; aeon: string; dots: string };

const GRID = "420px 1fr 1fr";

const CompareScene: React.FC<{
  name: string;
  eyebrow: string;
  rows: Row[];
}> = ({ name, eyebrow, rows }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  return (
    <AbsoluteFill
      name={name}
      style={{
        backgroundColor: CREAM,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 44,
      }}
    >
      <Interactive.Div
        name="Eyebrow"
        style={{
          alignSelf: "flex-start",
          fontFamily: MONO_FONT,
          fontWeight: 600,
          fontSize: 34,
          letterSpacing: "0.3em",
          color: REMOTION_BLUE,
          opacity: interpolate(frame, [0.1 * fps, 0.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        {eyebrow}
      </Interactive.Div>

      <div style={{ width: 1640, display: "flex", flexDirection: "column", gap: 26 }}>
        {/* Column headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: GRID,
            gap: 36,
            alignItems: "center",
            opacity: headerOpacity,
          }}
        >
          <div />
          <div
            style={{
              justifySelf: "start",
              fontFamily: MONO_FONT,
              fontWeight: 600,
              fontSize: 36,
              letterSpacing: "0.12em",
              color: CREAM,
              backgroundColor: REMOTION_BLUE,
              borderRadius: 999,
              padding: "10px 36px",
            }}
          >
            AEON
          </div>
          <div
            style={{
              justifySelf: "start",
              fontFamily: MONO_FONT,
              fontWeight: 600,
              fontSize: 36,
              letterSpacing: "0.12em",
              color: CREAM,
              backgroundColor: BLACK,
              borderRadius: 999,
              padding: "10px 36px",
            }}
          >
            DOTS
          </div>
        </div>

        {/* Rows */}
        {rows.map((row, i) => {
          const enter = 0.7 * fps + i * 6; // 6-frame sibling stagger
          const opacity = interpolate(frame, [enter, enter + 0.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          });
          const translate = interpolate(
            frame,
            [enter, enter + 0.5 * fps],
            ["-44px 0px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            },
          );
          return (
            <Interactive.Div
              key={row.axis}
              name={`Row${i + 1}`}
              style={{
                display: "grid",
                gridTemplateColumns: GRID,
                gap: 36,
                alignItems: "center",
                borderTop: `2px solid ${BLACK}33`,
                paddingTop: 22,
                opacity,
                translate,
              }}
            >
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontWeight: 400,
                  fontSize: 34,
                  color: `${BLACK}99`,
                }}
              >
                {row.axis}
              </div>
              <div
                style={{
                  fontFamily: HEADLINE_FONT,
                  fontWeight: 500,
                  fontSize: 44,
                  color: REMOTION_BLUE,
                  lineHeight: 1.1,
                }}
              >
                {row.aeon}
              </div>
              <div
                style={{
                  fontFamily: HEADLINE_FONT,
                  fontWeight: 500,
                  fontSize: 44,
                  color: BLACK,
                  lineHeight: 1.1,
                }}
              >
                {row.dots}
              </div>
            </Interactive.Div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 3. COMPARE I — ownership axes (CREAM)
// ---------------------------------------------------------------------------
export const DotsCompareOwnership: React.FC = () => (
  <CompareScene
    name="DotsCompareOwnership"
    eyebrow="WHO OWNS THE COMPUTER"
    rows={[
      { axis: "Runs on", aeon: "Your repo", dots: "OpenAI's cloud" },
      { axis: "Model", aeon: "9 harnesses", dots: "GPT-6 Astra" },
      { axis: "Source", aeon: "MIT", dots: "Closed" },
      { axis: "Data", aeon: "Your secrets", dots: "OpenAI's cloud" },
    ]}
  />
);

// ---------------------------------------------------------------------------
// 4. EXTENSIBILITY — 85 skills vs 4,000+ plugins (BLACK)
// ---------------------------------------------------------------------------
export const DotsExtensibility: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const skills = Math.round(
    interpolate(frame, [0.4 * fps, 1.6 * fps], [0, 85], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    }),
  );
  const plugins = Math.round(
    interpolate(frame, [0.7 * fps, 2.1 * fps], [0, 4000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    }),
  );

  const col = {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: 14,
    width: 680,
  };
  const bigNum = {
    fontFamily: HEADLINE_FONT,
    fontWeight: 700,
    fontSize: 180,
    lineHeight: 1,
  };
  const tag = {
    fontFamily: MONO_FONT,
    fontWeight: 600,
    fontSize: 36,
    letterSpacing: "0.14em",
  };

  return (
    <AbsoluteFill
      name="DotsExtensibility"
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 56,
      }}
    >
      <Interactive.Div
        name="ExtHeadline"
        style={{
          fontFamily: HEADLINE_FONT,
          fontWeight: 700,
          fontSize: 64,
          color: CREAM,
          textAlign: "center",
          opacity: interpolate(frame, [0.1 * fps, 0.7 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        Extend it how?
      </Interactive.Div>
      <div style={{ display: "flex", gap: 120, alignItems: "flex-start" }}>
        <Interactive.Div
          name="AeonSkills"
          style={{
            ...col,
            opacity: interpolate(frame, [0.4 * fps, 1.0 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            }),
          }}
        >
          <div style={{ ...tag, color: REMOTION_BLUE }}>AEON</div>
          <div style={{ ...bigNum, color: REMOTION_BLUE }}>{skills}</div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontWeight: 400,
              fontSize: 36,
              color: CREAM,
              opacity: 0.85,
              textAlign: "center",
            }}
          >
            editable Markdown skills
          </div>
        </Interactive.Div>
        <Interactive.Div
          name="DotsPlugins"
          style={{
            ...col,
            opacity: interpolate(frame, [0.7 * fps, 1.3 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            }),
          }}
        >
          <div style={{ ...tag, color: CREAM, opacity: 0.7 }}>DOTS</div>
          <div style={{ ...bigNum, color: CREAM }}>
            {plugins.toLocaleString("en-US")}
            {plugins >= 4000 ? "+" : ""}
          </div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontWeight: 400,
              fontSize: 36,
              color: CREAM,
              opacity: 0.85,
              textAlign: "center",
            }}
          >
            plugins (curated)
          </div>
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 5. COMPARE II — the sharp differentiators (CREAM)
// ---------------------------------------------------------------------------
export const DotsCompareDiff: React.FC = () => (
  <CompareScene
    name="DotsCompareDiff"
    eyebrow="WHERE THEY SPLIT"
    rows={[
      { axis: "Spend money", aeon: "x402 wallet", dots: "Blocked" },
      { axis: "Audit trail", aeon: "git log", dots: "Activity View" },
      { axis: "EU at launch", aeon: "Anywhere GitHub works", dots: "Not available" },
    ]}
  />
);

// ---------------------------------------------------------------------------
// 6. CAVEAT — the one honest limit, flat (BLACK)
// ---------------------------------------------------------------------------
export const DotsCaveat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="DotsCaveat"
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: PAGE_PAD,
        gap: 32,
      }}
    >
      <Interactive.Div
        name="CaveatEyebrow"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 600,
          fontSize: 34,
          letterSpacing: "0.3em",
          color: REMOTION_BLUE,
          opacity: interpolate(frame, [0.1 * fps, 0.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        WHERE DOTS WINS
      </Interactive.Div>
      <Interactive.Div
        name="CaveatMain"
        style={{
          fontFamily: HEADLINE_FONT,
          fontWeight: 700,
          fontSize: 82,
          color: CREAM,
          lineHeight: 1.1,
          maxWidth: 1540,
          opacity: interpolate(frame, [0.5 * fps, 1.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
          translate: interpolate(
            frame,
            [0.5 * fps, 1.2 * fps],
            ["0px 32px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            },
          ),
        }}
      >
        Dots wins on zero setup. Aeon still asks for homework.
      </Interactive.Div>
      <Interactive.Div
        name="CaveatSub"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 400,
          fontSize: 46,
          color: REMOTION_BLUE,
          maxWidth: 1540,
          lineHeight: 1.2,
          opacity: interpolate(frame, [1.2 * fps, 1.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        And its guardrails are cruder than OpenAI's.
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 7. CTA (BLACK)
// ---------------------------------------------------------------------------
export const DotsCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="DotsCta"
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 48,
      }}
    >
      <Interactive.Div
        name="CtaLogo"
        style={{
          scale: interpolate(frame, [0.1 * fps, 0.9 * fps], [0.7, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 14 }),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [0.1 * fps, 0.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        <CanvasImage
          src={staticFile("logo.png")}
          style={{ width: 480, height: "auto" }}
        />
      </Interactive.Div>
      <Interactive.Div
        name="CtaUrl"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 600,
          fontSize: 54,
          color: CREAM,
          textAlign: "center",
          opacity: interpolate(frame, [0.7 * fps, 1.3 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
          translate: interpolate(
            frame,
            [0.7 * fps, 1.3 * fps],
            ["0px 28px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            },
          ),
        }}
      >
        aeon.fun/blog/aeon-vs-openai-dots
      </Interactive.Div>
      <Interactive.Div
        name="CtaSub"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 400,
          fontSize: 40,
          color: CREAM,
          opacity: interpolate(frame, [1.3 * fps, 1.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        Read the full breakdown
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// ASSEMBLY — 1980 scene frames - 90 transition frames = 1890 frames (63.0s)
// ---------------------------------------------------------------------------
export const AeonVsOpenAiDots: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={120} name="ColdOpen">
        <DotsColdOpen />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={120} name="Title">
        <DotsTitle />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={480} name="CompareOwnership">
        <DotsCompareOwnership />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={330} name="Extensibility">
        <DotsExtensibility />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={420} name="CompareDiff">
        <DotsCompareDiff />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={300} name="Caveat">
        <DotsCaveat />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={210} name="Cta">
        <DotsCta />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
