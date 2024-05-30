import assembly from "./assembly";
import bdm from "./bdm";
import sealer from "./sealer";
import surfaceQuality from "./surface-quality";
import synthesis from "./synthesis";
import welding from "./welding";

export default [
    ...synthesis, // 종합
    ...welding, // 용접
    ...sealer, // 실러
    ...assembly, // 장착
    ...surfaceQuality, // 면품질
    ...bdm, // 기준정보
];
