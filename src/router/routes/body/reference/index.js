import assemblyRoutes from "./assembly.routes";
import commonRoutes from "./common.routes";
import sealerRoutes from "./sealer.routes";
import surfaceQualityRoutes from "./surface-quality.routes";
import weldingRoutes from "./welding.routes";

export default [
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

  ...commonRoutes,
];
