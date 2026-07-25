import desktop from "@/app/generated/desktop.layout.json";
import tablet from "@/app/generated/tablet.layout.json";
import mobile from "@/app/generated/mobile.layout.json";
import FigmaPage from "@/app/components/figma/FigmaPage";
import ResponsiveHome from "@/app/components/figma/ResponsiveHome";

export default function Page() {
  return (
    <ResponsiveHome
      desktop={{ node: <FigmaPage layout={desktop as never} />, width: desktop.width, height: desktop.height }}
      tablet={{ node: <FigmaPage layout={tablet as never} />, width: tablet.width, height: tablet.height }}
      mobile={{ node: <FigmaPage layout={mobile as never} />, width: mobile.width, height: mobile.height }}
    />
  );
}
