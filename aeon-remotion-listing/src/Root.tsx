import "./index.css";
import { Composition, Folder } from "remotion";
import { AeonRemotionListing } from "./AeonRemotionListing";
import { AeonHook } from "./scenes/AeonHook";
import { Listing } from "./scenes/Listing";
import { Cta } from "./scenes/Cta";
import { AeonConnect } from "./videos/aeon-connect";
import { SkillPacks } from "./videos/skill-packs-cult-os-and-aeon";
import { AeonVsOpenAiDots } from "./videos/aeon-vs-openai-dots";
import { AeonVsOpenAiAeon } from "./videos/aeon-vs-openai-aeon";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AeonRemotionListing"
        component={AeonRemotionListing}
        durationInFrames={345}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Scenes">
        <Composition
          id="AeonHook"
          component={AeonHook}
          durationInFrames={105}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Listing"
          component={Listing}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Cta"
          component={Cta}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="BlogVideos">
        <Composition
          id="aeon-connect"
          component={AeonConnect}
          durationInFrames={1980}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="skill-packs-cult-os-and-aeon"
          component={SkillPacks}
          durationInFrames={1890}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="aeon-vs-openai-dots"
          component={AeonVsOpenAiDots}
          durationInFrames={1890}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="aeon-vs-openai-aeon"
          component={AeonVsOpenAiAeon}
          durationInFrames={1800}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
