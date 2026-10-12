import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AeonHook } from "./scenes/AeonHook";
import { Listing } from "./scenes/Listing";
import { Cta } from "./scenes/Cta";

// Total duration: 105 + 150 + 120 - 15 - 15 = 345 frames (11.5s at 30fps)
export const AeonRemotionListing: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={105} name="AeonHook">
        <AeonHook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={150} name="Listing">
        <Listing />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={120} name="Cta">
        <Cta />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
