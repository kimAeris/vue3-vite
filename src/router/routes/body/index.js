import assemblyRoutes from "./assembly.routes";
import reference from "./reference";
import sealerRoutes from "./sealer.routes";
import surfaceQualityRoutes from "./surface-quality.routes";
import synthesisRoutes from "./synthesis.routes";
import weldingRoutes from "./welding.routes";

export default [
  {
    // 종합
    path: "synthesis",
    children: synthesisRoutes,
  },
  {
    // 용접
    path: "welding",
    children: weldingRoutes,
  },
  {
    // 실러
    path: "sealer",
    children: sealerRoutes,
  },
  {
    // 장착
    path: "assembly",
    children: assemblyRoutes,
  },
  {
    // 면품질
    path: "surface-quality",
    children: surfaceQualityRoutes,
  },
  {
    // 기준정보
    path: "reference",
    children: reference,
  },
];
