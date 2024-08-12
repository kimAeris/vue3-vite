import cleaningRoutes from "./cleaning.routes";
import dpuRoutes from "./dpu.routes";
import generalRoutes from "./general.routes";
import qualityRoutes from "./quality.routes";
import reference from "./reference";
import routineRoutes from "./routine.routes";
import subsidiaryRoutes from "./subsidiary.routes";

export default [
  {
    // 종합
    path: "general",
    children: generalRoutes,
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
    // 청소
    path: "cleaning",
    children: cleaningRoutes,
  },
  {
    // DPU
    path: "dpu",
    children: dpuRoutes,
  },
  {
    // 품질
    path: "quality",
    children: qualityRoutes,
  },
  {
    // 기준정보
    path: "reference",
    children: reference,
  },
];
