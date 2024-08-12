import commonRoutes from "./common.routes";
import masterRoutes from "./master.routes";
import qualityRoutes from "./quality.routes";
import routineRoutes from "./routine.routes";
import subsidiaryRoutes from "./subsidiary.routes";

export default [
  {
    // 마스터
    path: "master",
    children: masterRoutes,
  },
  {
    // 일상
    path: "routine",
    children: routineRoutes,
  },
  {
    // 부자재
    path: "subsidiary",
    children: subsidiaryRoutes,
  },
  {
    // 품질
    path: "quality",
    children: qualityRoutes,
  },

  // 기타
  ...commonRoutes,
];
