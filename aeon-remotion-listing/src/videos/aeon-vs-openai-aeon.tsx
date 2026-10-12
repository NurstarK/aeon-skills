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
 * STORYBOARD — aeon-vs-openai-aeon
 * Source: https://www.aeon.fun/blog/aeon-vs-openai-aeon
 *   ("Aeon, the open-source always-on agent (not the OpenAI one)").
 * A disambiguation piece: search "Aeon agent" and you hit one of two things —
 * this open-source framework, or a rumored OpenAI product. The comparison of
 * the two is the spine. Every number, label and cell on screen is lifted
 * verbatim from the article. Silent, 1920x1080 @ 30fps.
 *
 *  1. COLD OPEN (120f / 4.0s) — the article's blunt lede: search "aeon agent"
 *     and you get "one name, two agents." (CREAM)
 *  2. TITLE CARD (120f / 4.0s) — Aeon mark + "the open-source always-on agent"
 *     + "(not the OpenAI one)". (BLACK — logo reads on black)
 *  3. WHICH ONE (480f / 16.0s) — two-column table THIS AEON vs OPENAI'S:
 *     Status, Source, Evidence, When. Staggered row reveals. (CREAM)
 *  4. RECEIPTS (330f / 11.0s) — big-number trio for the open one: 1,300+
 *     commits (counter), 85 bundled skills (counter), MIT open source. (BLACK)
 *  5. WHAT'S DIFFERENT (330f / 11.0s) — staggered checklist of the distinctive
 *     traits: GitHub Actions / git memory / aeon.yml / one adapter. (CREAM)
 *  6. STRAIGHT TALK (300f / 10.0s) — the honest limit about the OpenAI side,
 *     flat: reports + a feature-flag model ID, "We don't know more than
 *     that." (BLACK)
 *  7. CTA (210f / 7.0s) — aeon.fun/blog/aeon-vs-openai-aeon + logo +
 *     "CONNECT IT. RUN IT. FORGET IT." (BLACK)
 *
 * Backgrounds alternate CREAM/BLACK; the two logo scenes (Title, Cta) sit on
 * BLACK like the house AeonHook/Cta scenes. StraightTalk->Cta is the one
 * same-colour cut, carried by a slide transition.
 *
 * Duration: 120+120+480+330+330+300+210 = 1890 frames of scene,
 * minus 6 x 15-frame transitions (90) = 1800 frames = 60.0s @ 30fps.
 */

const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const PAGE_PAD = 140; // >= 120px margin from every edge

// ---------------------------------------------------------------------------
// 1. COLD OPEN (CREAM)
// ---------------------------------------------------------------------------
export const AeonColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="AeonColdOpen"
      style={{
        backgroundColor: CREAM,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 36,
      }}
    >
      <Interactive.Div
        name="SearchQuery"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 400,
          fontSize: 46,
          letterSpacing: "0.08em",
          color: `${BLACK}99`,
          opacity: interpolate(frame, [0.2 * fps, 0.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
          translate: interpolate(
            frame,
            [0.2 * fps, 0.9 * fps],
            ["0px 24px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            },
          ),
        }}
      >
        search: "aeon agent"
      </Interactive.Div>
      <Interactive.Div
        name="ColdOpenBig"
        style={{
          fontFamily: HEADLINE_FONT,
          fontWeight: 700,
          fontSize: 164,
          lineHeight: 1.02,
          color: BLACK,
          textAlign: "center",
          scale: interpolate(frame, [0.6 * fps, 1.5 * fps], [0.7, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 14 }),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [0.6 * fps, 1.1 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        One name.
        <br />
        <span style={{ color: REMOTION_BLUE }}>Two agents.</span>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 2. TITLE CARD (BLACK)
// ---------------------------------------------------------------------------
export const AeonTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="AeonTitle"
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
          style={{ width: 620, height: "auto" }}
        />
      </Interactive.Div>
      <Interactive.Div
        name="TitleHeadline"
        style={{
          fontFamily: HEADLINE_FONT,
          fontWeight: 700,
          fontSize: 92,
          color: CREAM,
          textAlign: "center",
          lineHeight: 1.08,
          maxWidth: 1560,
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
        The <span style={{ color: REMOTION_BLUE }}>open-source</span> always-on
        agent
      </Interactive.Div>
      <Interactive.Div
        name="TitleSub"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 400,
          fontSize: 44,
          letterSpacing: "0.04em",
          color: CREAM,
          opacity: interpolate(frame, [1.0 * fps, 1.6 * fps], [0, 0.75], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        (not the OpenAI one)
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shared two-column comparison table (THIS AEON vs OPENAI'S)
// ---------------------------------------------------------------------------
type Row = { axis: string; mine: string; theirs: string };

const GRID = "360px 1fr 1fr";

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

      <div
        style={{
          width: 1640,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
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
            THIS AEON
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
            OPENAI'S
          </div>
        </div>

        {/* Rows */}
        {rows.map((row, i) => {
          const enter = 0.7 * fps + i * 6; // 6-frame sibling stagger
          const opacity = interpolate(
            frame,
            [enter, enter + 0.5 * fps],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            },
          );
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
                {row.mine}
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
                {row.theirs}
              </div>
            </Interactive.Div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 3. WHICH ONE — disambiguation table (CREAM)
// ---------------------------------------------------------------------------
export const AeonWhichOne: React.FC = () => (
  <CompareScene
    name="AeonWhichOne"
    eyebrow="WHICH AEON DO YOU MEAN?"
    rows={[
      { axis: "Status", mine: "Public since Mar 2026", theirs: "Rumored" },
      { axis: "Source", mine: "MIT, open source", theirs: "No official page" },
      { axis: "Evidence", mine: "1,300+ commits", theirs: "A feature-flag ID" },
      { axis: "When", mine: "Live daily now", theirs: "Maybe DevDay, Sep 29" },
    ]}
  />
);

// ---------------------------------------------------------------------------
// 4. RECEIPTS — big-number trio for the open one (BLACK)
// ---------------------------------------------------------------------------
export const AeonReceipts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const commits = Math.round(
    interpolate(frame, [0.4 * fps, 1.8 * fps], [0, 1300], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    }),
  );
  const skills = Math.round(
    interpolate(frame, [0.7 * fps, 2.0 * fps], [0, 85], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    }),
  );

  const col = {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: 12,
    width: 500,
  };
  const bigNum = {
    fontFamily: HEADLINE_FONT,
    fontWeight: 700,
    fontSize: 150,
    lineHeight: 1,
    color: REMOTION_BLUE,
  };
  const label = {
    fontFamily: MONO_FONT,
    fontWeight: 400,
    fontSize: 36,
    color: CREAM,
    opacity: 0.85,
    textAlign: "center" as const,
  };

  const stat = (i: number) =>
    interpolate(frame, [0.3 * fps + i * 8, 0.9 * fps + i * 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    });

  return (
    <AbsoluteFill
      name="AeonReceipts"
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 56,
      }}
    >
      <Interactive.Div
        name="ReceiptsHeadline"
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
        Public since March 2026
      </Interactive.Div>
      <div style={{ display: "flex", gap: 96, alignItems: "flex-start" }}>
        <Interactive.Div name="StatCommits" style={{ ...col, opacity: stat(0) }}>
          <div style={bigNum}>{commits.toLocaleString("en-US")}+</div>
          <div style={label}>commits</div>
        </Interactive.Div>
        <Interactive.Div name="StatSkills" style={{ ...col, opacity: stat(1) }}>
          <div style={bigNum}>{skills}</div>
          <div style={label}>bundled skills</div>
        </Interactive.Div>
        <Interactive.Div name="StatLicense" style={{ ...col, opacity: stat(2) }}>
          <div style={bigNum}>MIT</div>
          <div style={label}>open source</div>
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 5. WHAT'S DIFFERENT — staggered checklist (CREAM)
// ---------------------------------------------------------------------------
export const AeonDifferent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    "Runs in GitHub Actions — no server",
    "Memory committed to git",
    "85 skills, scheduled in aeon.yml",
    "One adapter: Claude Code, Codex, Grok, Kimi",
  ];

  return (
    <AbsoluteFill
      name="AeonDifferent"
      style={{
        backgroundColor: CREAM,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: PAGE_PAD,
        gap: 48,
      }}
    >
      <Interactive.Div
        name="DiffEyebrow"
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
        WHAT MAKES THIS ONE DIFFERENT
      </Interactive.Div>
      <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        {items.map((text, i) => {
          const enter = 0.6 * fps + i * 7; // 7-frame sibling stagger
          const opacity = interpolate(
            frame,
            [enter, enter + 0.5 * fps],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            },
          );
          const translate = interpolate(
            frame,
            [enter, enter + 0.5 * fps],
            ["-40px 0px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            },
          );
          const tick = interpolate(
            frame,
            [enter + 0.15 * fps, enter + 0.6 * fps],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 14 }),
            },
          );
          return (
            <Interactive.Div
              key={text}
              name={`Diff${i + 1}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 32,
                opacity,
                translate,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: REMOTION_BLUE,
                  flexShrink: 0,
                  scale: tick,
                }}
              />
              <div
                style={{
                  fontFamily: HEADLINE_FONT,
                  fontWeight: 500,
                  fontSize: 56,
                  color: BLACK,
                  lineHeight: 1.1,
                }}
              >
                {text}
              </div>
            </Interactive.Div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 6. STRAIGHT TALK — the honest limit about the OpenAI side, flat (BLACK)
// ---------------------------------------------------------------------------
export const AeonStraightTalk: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="AeonStraightTalk"
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: PAGE_PAD,
        gap: 32,
      }}
    >
      <Interactive.Div
        name="TalkEyebrow"
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
        ABOUT THE OPENAI ONE
      </Interactive.Div>
      <Interactive.Div
        name="TalkMain"
        style={{
          fontFamily: HEADLINE_FONT,
          fontWeight: 700,
          fontSize: 80,
          color: CREAM,
          lineHeight: 1.12,
          maxWidth: 1560,
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
        Reports and a model ID in a feature flag.
      </Interactive.Div>
      <Interactive.Div
        name="TalkSub"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 400,
          fontSize: 46,
          color: REMOTION_BLUE,
          maxWidth: 1560,
          lineHeight: 1.2,
          opacity: interpolate(frame, [1.2 * fps, 1.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        No official page. We don't know more than that.
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 7. CTA (BLACK)
// ---------------------------------------------------------------------------
export const AeonCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="AeonCta"
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
          fontSize: 50,
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
        aeon.fun/blog/aeon-vs-openai-aeon
      </Interactive.Div>
      <Interactive.Div
        name="CtaTagline"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 400,
          fontSize: 38,
          letterSpacing: "0.22em",
          color: CREAM,
          opacity: interpolate(frame, [1.3 * fps, 1.9 * fps], [0, 0.85], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        CONNECT IT. RUN IT. FORGET IT.
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// ASSEMBLY — 1890 scene frames - 90 transition frames = 1800 frames (60.0s)
// ---------------------------------------------------------------------------
export const AeonVsOpenAiAeon: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={120} name="ColdOpen">
        <AeonColdOpen />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={120} name="Title">
        <AeonTitle />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={480} name="WhichOne">
        <AeonWhichOne />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={330} name="Receipts">
        <AeonReceipts />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={330} name="Different">
        <AeonDifferent />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={300} name="StraightTalk">
        <AeonStraightTalk />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={210} name="Cta">
        <AeonCta />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
