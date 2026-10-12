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
 * STORYBOARD — aeon-connect
 * Source: https://www.aeon.fun/blog/aeon-connect ("Aeon Connect: start your
 * agent from the browser", 2026-10-03). Every number/claim on screen is lifted
 * from the article. Silent, 1920x1080 @ 30fps.
 *
 *  1. COLD OPEN (120f / 4.0s) — big "5" counts 0->5: five steps from sign-in
 *     to a running agent. The concrete hook. (CREAM)
 *  2. TITLE CARD (120f / 4.0s) — Aeon mark + "Aeon Connect" + the core claim,
 *     "start your agent from the browser". (BLACK — logo reads on black)
 *  3. FLOW (600f / 20.0s) — the five onboarding steps, exact article labels,
 *     revealed as staggered numbered nodes. The how-it-works spine. (CREAM)
 *  4. MODELS (360f / 12.0s) — big "9" counts 0->9: the nine models you can
 *     connect, named as chips. (BLACK)
 *  5. MINUTES (390f / 13.0s) — one comparison axis, GitHub Actions minutes:
 *     Public = Free, Private = 2,000 a month (counter). (CREAM)
 *  6. CAVEAT (270f / 9.0s) — the one honest limit, flat: on a public repo the
 *     memory and run logs are public too; secrets never are. (BLACK)
 *  7. CTA (210f / 7.0s) — aeon.fun/connect + "Sign in with GitHub".
 *     (BLACK — logo reads on black)
 *
 * Backgrounds alternate CREAM/BLACK; the two logo scenes (Title, Cta) sit on
 * BLACK like the house AeonHook/Cta scenes. Caveat->Cta is the one same-colour
 * cut, carried by a slide transition.
 *
 * Duration: 120+120+600+360+390+270+210 = 2070 frames of scene,
 * minus 6 x 15-frame transitions (90) = 1980 frames = 66.0s @ 30fps.
 */

const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const PAGE_PAD = 140; // >= 120px margin from every edge

// ---------------------------------------------------------------------------
// 1. COLD OPEN (CREAM)
// ---------------------------------------------------------------------------
export const ConnectColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const count = Math.round(
    interpolate(frame, [0.3 * fps, 1.4 * fps], [0, 5], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    }),
  );

  return (
    <AbsoluteFill
      name="ConnectColdOpen"
      style={{
        backgroundColor: CREAM,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 24,
      }}
    >
      <Interactive.Div
        name="BigFive"
        style={{
          fontFamily: HEADLINE_FONT,
          fontWeight: 700,
          fontSize: 300,
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
        {count}
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
          opacity: interpolate(frame, [1.2 * fps, 1.9 * fps], [0, 0.9], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
          translate: interpolate(
            frame,
            [1.2 * fps, 1.9 * fps],
            ["0px 26px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            },
          ),
        }}
      >
        steps from sign-in to a running agent
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 2. TITLE CARD (BLACK)
// ---------------------------------------------------------------------------
export const ConnectTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="ConnectTitle"
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
          fontSize: 104,
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
        Aeon <span style={{ color: REMOTION_BLUE }}>Connect</span>
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
        start your agent from the browser
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 3. FLOW — the five onboarding steps (exact article labels) (CREAM)
// ---------------------------------------------------------------------------
const STEPS = [
  "Sign in with GitHub",
  "Create your aeon",
  "Install the Aeon Connect GitHub App",
  "Connect a model",
  "Pick skills and run one",
];

export const ConnectFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="ConnectFlow"
      style={{
        backgroundColor: CREAM,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 56,
      }}
    >
      <Interactive.Div
        name="FlowEyebrow"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 600,
          fontSize: 36,
          letterSpacing: "0.32em",
          color: REMOTION_BLUE,
          opacity: interpolate(frame, [0.1 * fps, 0.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        ONBOARDING
      </Interactive.Div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 30,
          width: 1360,
        }}
      >
        {STEPS.map((label, i) => {
          const enter = 0.5 * fps + i * 6; // 6-frame sibling stagger
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
          const badgeScale = interpolate(
            frame,
            [enter, enter + 0.7 * fps],
            [0.4, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 14 }),
              output: "perceptual-scale",
            },
          );
          return (
            <Interactive.Div
              key={label}
              name={`Step${i + 1}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 36,
                opacity,
                translate,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 84,
                  height: 84,
                  borderRadius: 999,
                  backgroundColor: REMOTION_BLUE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: HEADLINE_FONT,
                  fontWeight: 700,
                  fontSize: 44,
                  color: CREAM,
                  scale: badgeScale,
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  fontFamily: HEADLINE_FONT,
                  fontWeight: 500,
                  fontSize: 52,
                  color: BLACK,
                  lineHeight: 1.1,
                }}
              >
                {label}
              </div>
            </Interactive.Div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 4. MODELS — nine you can connect (BLACK)
// ---------------------------------------------------------------------------
const MODELS = [
  "Claude Code",
  "Grok",
  "Codex",
  "Pi",
  "Vibe",
  "Kimi",
  "fx",
  "Cursor",
  "Hermes",
];

export const ConnectModels: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const count = Math.round(
    interpolate(frame, [0.3 * fps, 1.4 * fps], [0, 9], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    }),
  );

  return (
    <AbsoluteFill
      name="ConnectModels"
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 28,
        }}
      >
        <Interactive.Div
          name="ModelCount"
          style={{
            fontFamily: HEADLINE_FONT,
            fontWeight: 700,
            fontSize: 200,
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
          {count}
        </Interactive.Div>
        <Interactive.Div
          name="ModelLabel"
          style={{
            fontFamily: HEADLINE_FONT,
            fontWeight: 500,
            fontSize: 58,
            color: CREAM,
            opacity: interpolate(frame, [1.0 * fps, 1.5 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            }),
          }}
        >
          models you can connect
        </Interactive.Div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
          maxWidth: 1400,
          marginTop: 28,
        }}
      >
        {MODELS.map((m, i) => {
          const enter = 1.4 * fps + i * 5; // staggered chips
          return (
            <Interactive.Div
              key={m}
              name={`Model${i + 1}`}
              style={{
                fontFamily: MONO_FONT,
                fontWeight: 600,
                fontSize: 36,
                letterSpacing: "0.04em",
                color: BLACK,
                backgroundColor: CREAM,
                borderRadius: 999,
                padding: "14px 34px",
                opacity: interpolate(
                  frame,
                  [enter, enter + 0.5 * fps],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: EASE,
                  },
                ),
                translate: interpolate(
                  frame,
                  [enter, enter + 0.5 * fps],
                  ["0px 22px", "0px 0px"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: EASE,
                  },
                ),
              }}
            >
              {m}
            </Interactive.Div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 5. MINUTES — one comparison axis: GitHub Actions minutes (CREAM)
// ---------------------------------------------------------------------------
export const ConnectMinutes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const privateMinutes = Math.round(
    interpolate(frame, [1.2 * fps, 2.4 * fps], [0, 2000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    }),
  );

  const cardBase = {
    width: 680,
    borderRadius: 20,
    padding: "56px 48px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: 22,
  };

  return (
    <AbsoluteFill
      name="ConnectMinutes"
      style={{
        backgroundColor: CREAM,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 56,
      }}
    >
      <Interactive.Div
        name="MinutesAxis"
        style={{
          fontFamily: HEADLINE_FONT,
          fontWeight: 700,
          fontSize: 66,
          color: BLACK,
          textAlign: "center",
          opacity: interpolate(frame, [0.1 * fps, 0.7 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        GitHub Actions minutes
      </Interactive.Div>
      <div style={{ display: "flex", gap: 48 }}>
        <Interactive.Div
          name="PublicCard"
          style={{
            ...cardBase,
            backgroundColor: BLACK,
            opacity: interpolate(frame, [0.6 * fps, 1.2 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            }),
            translate: interpolate(
              frame,
              [0.6 * fps, 1.2 * fps],
              ["0px 50px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE,
              },
            ),
          }}
        >
          <div
            style={{
              fontFamily: MONO_FONT,
              fontWeight: 600,
              fontSize: 36,
              letterSpacing: "0.18em",
              color: CREAM,
              opacity: 0.65,
            }}
          >
            PUBLIC
          </div>
          <div
            style={{
              fontFamily: HEADLINE_FONT,
              fontWeight: 700,
              fontSize: 96,
              color: CREAM,
            }}
          >
            Free
          </div>
        </Interactive.Div>
        <Interactive.Div
          name="PrivateCard"
          style={{
            ...cardBase,
            backgroundColor: REMOTION_BLUE,
            opacity: interpolate(frame, [0.9 * fps, 1.5 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            }),
            translate: interpolate(
              frame,
              [0.9 * fps, 1.5 * fps],
              ["0px 50px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE,
              },
            ),
          }}
        >
          <div
            style={{
              fontFamily: MONO_FONT,
              fontWeight: 600,
              fontSize: 36,
              letterSpacing: "0.18em",
              color: CREAM,
              opacity: 0.85,
            }}
          >
            PRIVATE
          </div>
          <div
            style={{
              fontFamily: HEADLINE_FONT,
              fontWeight: 700,
              fontSize: 96,
              color: CREAM,
            }}
          >
            {privateMinutes.toLocaleString("en-US")}
          </div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontWeight: 400,
              fontSize: 34,
              color: CREAM,
              opacity: 0.85,
            }}
          >
            a month
          </div>
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 6. CAVEAT — the one honest limit, flat (BLACK)
// ---------------------------------------------------------------------------
export const ConnectCaveat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="ConnectCaveat"
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
        ONE HONEST CAVEAT
      </Interactive.Div>
      <Interactive.Div
        name="CaveatMain"
        style={{
          fontFamily: HEADLINE_FONT,
          fontWeight: 700,
          fontSize: 84,
          color: CREAM,
          lineHeight: 1.1,
          maxWidth: 1500,
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
        On a public repo, memory and run logs are public too.
      </Interactive.Div>
      <Interactive.Div
        name="CaveatSub"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 400,
          fontSize: 48,
          color: REMOTION_BLUE,
          opacity: interpolate(frame, [1.2 * fps, 1.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        Your secrets never are.
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 7. CTA (BLACK)
// ---------------------------------------------------------------------------
export const ConnectCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="ConnectCta"
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 52,
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
          fontSize: 66,
          color: CREAM,
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
        aeon.fun/connect
      </Interactive.Div>
      <Interactive.Div
        name="CtaSub"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          opacity: interpolate(frame, [1.3 * fps, 1.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        <div
          style={{
            fontFamily: MONO_FONT,
            fontWeight: 400,
            fontSize: 40,
            color: CREAM,
          }}
        >
          Sign in with GitHub
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// ASSEMBLY — 2070 scene frames - 90 transition frames = 1980 frames (66.0s)
// ---------------------------------------------------------------------------
export const AeonConnect: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={120} name="ColdOpen">
        <ConnectColdOpen />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={120} name="Title">
        <ConnectTitle />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={600} name="Flow">
        <ConnectFlow />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={360} name="Models">
        <ConnectModels />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={390} name="Minutes">
        <ConnectMinutes />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={270} name="Caveat">
        <ConnectCaveat />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={210} name="Cta">
        <ConnectCta />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
