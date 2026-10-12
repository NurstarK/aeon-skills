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
 * STORYBOARD — skill-packs-cult-os-and-aeon
 * Source: https://www.aeon.fun/blog/skill-packs-cult-os-and-aeon
 * ("Skill Packs, Cult OS, and $AEON", 2026-09-30). Every number/claim on screen
 * is lifted verbatim from the article. Silent, 1920x1080 @ 30fps.
 *
 *  1. COLD OPEN (120f / 4.0s) — big "85" counts 0->85: the skills that move
 *     between operators as free, scanned packs. The concrete hook. (CREAM)
 *  2. TITLE CARD (120f / 4.0s) — Aeon mark + "Skill Packs, Cult OS & $AEON" +
 *     the core claim, "free to share, paid per call". (BLACK — logo on black)
 *  3. PACKS (330f / 11.0s) — big "6" first-party packs, named as chips:
 *     Core, Evolution, Basics, Dev & Code, Crypto & Markets, Productivity. (CREAM)
 *  4. INSTALL (600f / 20.0s) — the install-skill-pack sequence as staggered
 *     numbered nodes; the how-it-works + safety spine. (BLACK)
 *  5. PRICING (360f / 12.0s) — Cult OS hires work per call: 0.20 USDC for the
 *     four Aeon audits, 0.003 for signal feeds, settles on Base or Arc. (CREAM)
 *  6. CAVEAT (240f / 8.0s) — the one honest limit, flat: $AEON gates nothing in
 *     the paid flow, on purpose; governance isn't shipped yet. (BLACK)
 *  7. CTA (210f / 7.0s) — aeon.fun/blog/skill-packs-cult-os-and-aeon. (BLACK)
 *
 * Backgrounds alternate CREAM/BLACK; the two logo scenes (Title, Cta) sit on
 * BLACK. Caveat->Cta is the one same-colour cut, carried by a slide transition.
 *
 * Duration: 120+120+330+600+360+240+210 = 1980 frames of scene,
 * minus 6 x 15-frame transitions (90) = 1890 frames = 63.0s @ 30fps.
 */

const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const PAGE_PAD = 140; // >= 120px margin from every edge

// ---------------------------------------------------------------------------
// 1. COLD OPEN (CREAM)
// ---------------------------------------------------------------------------
export const PacksColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const count = Math.round(
    interpolate(frame, [0.3 * fps, 1.5 * fps], [0, 85], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    }),
  );

  return (
    <AbsoluteFill
      name="PacksColdOpen"
      style={{
        backgroundColor: CREAM,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 24,
      }}
    >
      <Interactive.Div
        name="BigEightyFive"
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
        skills that move between agents as free packs
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 2. TITLE CARD (BLACK)
// ---------------------------------------------------------------------------
export const PacksTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="PacksTitle"
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
          style={{ width: 560, height: "auto" }}
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
          lineHeight: 1.05,
          maxWidth: 1540,
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
        Skill Packs, Cult OS &{" "}
        <span style={{ color: REMOTION_BLUE }}>$AEON</span>
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
        free to share · paid per call
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 3. PACKS — six first-party packs (BLACK? no, CREAM) (CREAM)
// ---------------------------------------------------------------------------
const PACKS = [
  "Core",
  "Evolution",
  "Basics",
  "Dev & Code",
  "Crypto & Markets",
  "Productivity",
];

export const PacksGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const count = Math.round(
    interpolate(frame, [0.3 * fps, 1.2 * fps], [0, 6], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    }),
  );

  return (
    <AbsoluteFill
      name="PacksGrid"
      style={{
        backgroundColor: CREAM,
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
          name="PackCount"
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
          name="PackLabel"
          style={{
            fontFamily: HEADLINE_FONT,
            fontWeight: 500,
            fontSize: 58,
            color: BLACK,
            opacity: interpolate(frame, [1.0 * fps, 1.5 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            }),
          }}
        >
          first-party packs
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
        {PACKS.map((p, i) => {
          const enter = 1.3 * fps + i * 6; // staggered chips
          return (
            <Interactive.Div
              key={p}
              name={`Pack${i + 1}`}
              style={{
                fontFamily: MONO_FONT,
                fontWeight: 600,
                fontSize: 38,
                letterSpacing: "0.04em",
                color: CREAM,
                backgroundColor: BLACK,
                borderRadius: 999,
                padding: "16px 38px",
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
              {p}
            </Interactive.Div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 4. INSTALL — the install-skill-pack sequence (exact article order) (BLACK)
// ---------------------------------------------------------------------------
const INSTALL_STEPS = [
  "Download the tarball",
  "Run the security scanner",
  "Prompt on HIGH findings — fails closed",
  "Copy into skills/",
  "Record in skills.lock",
  "Schedule in aeon.yml, disabled by default",
];

export const PacksInstall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="PacksInstall"
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 48,
      }}
    >
      <Interactive.Div
        name="InstallEyebrow"
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
        INSTALL-SKILL-PACK
      </Interactive.Div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 26,
          width: 1480,
        }}
      >
        {INSTALL_STEPS.map((label, i) => {
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
              name={`Install${i + 1}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 34,
                opacity,
                translate,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 74,
                  height: 74,
                  borderRadius: 999,
                  backgroundColor: REMOTION_BLUE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: HEADLINE_FONT,
                  fontWeight: 700,
                  fontSize: 40,
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
                  fontSize: 46,
                  color: CREAM,
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
// 5. PRICING — Cult OS hires work per call (CREAM)
// ---------------------------------------------------------------------------
const AUDITS = ["PR audit", "PR triage", "vulnerability audit", "site SEO audit"];

export const PacksPricing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="PacksPricing"
      style={{
        backgroundColor: CREAM,
        justifyContent: "center",
        alignItems: "center",
        padding: PAGE_PAD,
        gap: 40,
      }}
    >
      <Interactive.Div
        name="PricingAxis"
        style={{
          fontFamily: HEADLINE_FONT,
          fontWeight: 700,
          fontSize: 62,
          color: BLACK,
          textAlign: "center",
          opacity: interpolate(frame, [0.1 * fps, 0.7 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        Cult OS hires work per call
      </Interactive.Div>
      <Interactive.Div
        name="PriceBig"
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 20,
          opacity: interpolate(frame, [0.6 * fps, 1.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
          scale: interpolate(frame, [0.6 * fps, 1.4 * fps], [0.75, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 14 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <span
          style={{
            fontFamily: HEADLINE_FONT,
            fontWeight: 700,
            fontSize: 190,
            lineHeight: 1,
            color: REMOTION_BLUE,
          }}
        >
          0.20
        </span>
        <span
          style={{
            fontFamily: MONO_FONT,
            fontWeight: 600,
            fontSize: 52,
            color: BLACK,
          }}
        >
          USDC each
        </span>
      </Interactive.Div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 18,
          maxWidth: 1400,
        }}
      >
        {AUDITS.map((a, i) => {
          const enter = 1.4 * fps + i * 5;
          return (
            <Interactive.Div
              key={a}
              name={`Audit${i + 1}`}
              style={{
                fontFamily: MONO_FONT,
                fontWeight: 600,
                fontSize: 34,
                letterSpacing: "0.03em",
                color: CREAM,
                backgroundColor: BLACK,
                borderRadius: 999,
                padding: "12px 30px",
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
                  ["0px 20px", "0px 0px"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: EASE,
                  },
                ),
              }}
            >
              {a}
            </Interactive.Div>
          );
        })}
      </div>
      <Interactive.Div
        name="PricingFooter"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 400,
          fontSize: 38,
          color: BLACK,
          opacity: interpolate(frame, [2.0 * fps, 2.7 * fps], [0, 0.85], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
          marginTop: 10,
        }}
      >
        signal feeds 0.003 · settles in USDC on Base or Arc
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 6. CAVEAT — the one honest limit, flat (BLACK)
// ---------------------------------------------------------------------------
export const PacksCaveat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="PacksCaveat"
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
        $AEON gates nothing in the paid flow.
      </Interactive.Div>
      <Interactive.Div
        name="CaveatSub"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 400,
          fontSize: 48,
          color: REMOTION_BLUE,
          maxWidth: 1540,
          opacity: interpolate(frame, [1.2 * fps, 1.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        On purpose. Governance isn't shipped yet.
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 7. CTA (BLACK)
// ---------------------------------------------------------------------------
export const PacksCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="PacksCta"
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
        aeon.fun/blog/skill-packs-cult-os-and-aeon
      </Interactive.Div>
      <Interactive.Div
        name="CtaSub"
        style={{
          fontFamily: MONO_FONT,
          fontWeight: 400,
          fontSize: 38,
          color: CREAM,
          opacity: interpolate(frame, [1.3 * fps, 1.9 * fps], [0, 0.8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        }}
      >
        $AEON is live on Base, via Bankr
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// ASSEMBLY — 1980 scene frames - 90 transition frames = 1890 frames (63.0s)
// ---------------------------------------------------------------------------
export const SkillPacks: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={120} name="ColdOpen">
        <PacksColdOpen />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={120} name="Title">
        <PacksTitle />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={330} name="Packs">
        <PacksGrid />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={600} name="Install">
        <PacksInstall />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={360} name="Pricing">
        <PacksPricing />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={240} name="Caveat">
        <PacksCaveat />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={210} name="Cta">
        <PacksCta />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
