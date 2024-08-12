const DpuInspectView = () => import("@/views/pa/bdm/dpu/DpuInspectView");
const MenuManagementView = () =>
  import("@/views/pa/bdm/menu/MenuManagementView");
const UserTaskManagementView = () =>
  import("@/views/pa/bdm/user-task/UserTaskManagementView");
const VehicleManagementView = () =>
  import("@/views/pa/bdm/vehicle/VehicleManagementView");
const WorkDayView = () => import("@/views/pa/bdm/workday/WorkDayView");

export default [
  {
    path: "dpu/items",
    name: "DpuInspect",
    component: DpuInspectView,
  },
  {
    path: "menu/management",
    name: "BdmMenuManagement",
    component: MenuManagementView,
  },
  {
    path: "user-work/management",
    name: "UserTaskManagement",
    component: UserTaskManagementView,
  },
  {
    path: "vehicle/management",
    name: "VehicleManagement",
    component: VehicleManagementView,
  },
  {
    path: "workday/management",
    name: "Workday",
    component: WorkDayView,
  },
];
