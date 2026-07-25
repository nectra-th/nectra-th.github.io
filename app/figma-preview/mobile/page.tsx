import layout from "@/app/generated/mobile.layout.json";
import FigmaPage from "@/app/components/figma/FigmaPage";
export default function Page() {
  return <FigmaPage layout={layout as never} />;
}
