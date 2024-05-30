import DevelopingView from "@/views/etc/DevelopingView";
import VehicleManagementView from "@/views/bd/bdm/VehicleManagementView";
import CommonCodeManagementView from "@/views/bd/bdm/CommonCodeManagementView";
import MenuManagementView from "@/views/bd/bdm/MenuManagementView";
import UserTaskManagementView from "@/views/bd/bdm/UserTaskManagementView";
import SkipReasonManagementView from "@/views/bd/bdm/SkipReasonManagementView";
import ErrorReasonManagementView from "@/views/bd/bdm/ErrorReasonManagementView";
import TimeSettingManagementView from "@/views/bd/bdm/TimeSettingManagementView";
import WorkDayView from "@/views/bd/bdm/WorkDayView";
import InspectionExceptionManagementView from "@/views/bd/bdm/InspectionExceptionManagementView";
import AuthManagementView from "@/views/bd/bdm/AuthManagementView.vue";
import NoticeManagementView from "@/views/bd/bdm/NoticeManagementView.vue";
import NoticeManagementAddView from "@/views/bd/bdm/NoticeManagementAddView.vue";

import JournalBdmListView from "@/views/bd/bdm/journal/JournalBdmListView";
import JournalBdmFormEnterView from "@/views/bd/bdm/journal/JournalBdmFormEnterView.vue";

////////////////////////////////////////////////////////////////////////////////////////
import JournalBdmEnterView from "@/views/bd/bdm/journalForm/JournalBdmEnterView.vue";

export default [
    {
        path: "/body/reference/vehicle/management",
        name: "BdVehicleManagement",
        component: VehicleManagementView,
    },
    {
        path: "/body/reference/code/management",
        name: "BdCommonCodeManagement",
        component: CommonCodeManagementView,
    },
    {
        path: "/body/reference/menu/management",
        name: "BdMenuManagement",
        component: MenuManagementView,
    },
    {
        path: "/body/reference/user-work/management",
        name: "BdUserTaskManagement",
        component: UserTaskManagementView,
    },
    {
        path: "/body/reference/skip-reason/management",
        name: "BdSkipReasonManagement",
        component: SkipReasonManagementView,
    },
    {
        path: "/body/reference/error-reason/management",
        name: "BdErrorReasonManagement",
        component: ErrorReasonManagementView,
    },
    {
        path: "/body/reference/time-setting/management",
        name: "BdTimeSettingManagement",
        component: TimeSettingManagementView,
    },
    {
        path: "/body/reference/workday/management",
        name: "BdWorkDayManagement",
        component: WorkDayView,
    },
    {
        path: "/body/reference/inspection-exception/management",
        name: "BdInspectionExceptionManagement",
        component: InspectionExceptionManagementView,
    },
    {
        path: "/body/reference/auth/management",
        name: "BdAuthManagement",
        component: AuthManagementView,
    },
    {
        path: "/body/reference/notice/management",
        name: "BdNoticeManagement",
        component: NoticeManagementView,
    },
    {
        path: "/body/reference/notice/view",
        name: "BdNoticeManagementAdd",
        component: NoticeManagementAddView,
        props: (route) => ({
            notiId: route.query.notiId,
        }),
    },
    // 일지
    {
        path: "/body/reference/welding/destructive",
        name: "BdDestructiveManagement",
        component: JournalBdmListView,
        props: {
            pathName: "BdDestructiveManagementForm",
        },
    },
    {
        path: "/body/reference/welding/destructive/bdm/enter",
        name: "BdDestructiveManagementForm",
        component: JournalBdmEnterView, //JournalBdmFormEnterView,
        props: {
            pageName: "destructive",
            pathName: "BdDestructiveManagement",
        },
    },
    {
        path: "/body/reference/welding/co2",
        name: "BdCo2Management",
        component: JournalBdmListView,
        props: {
            pathName: "BdCo2ManagementForm",
        },
    },
    {
        path: "/body/reference/welding/co2/bdm/enter",
        name: "BdCo2ManagementForm",
        component: JournalBdmFormEnterView,
        props: {
            pageName: "co2",
            pathName: "BdCo2Management",
        },
    },
    {
        path: "/body/reference/sealer/coating-quality",
        name: "BdCoatingQualityManagement",
        component: JournalBdmListView,
        props: {
            pathName: "BdCoatingQualityManagementForm",
        },
    },
    {
        path: "/body/reference/sealer/coating-quality/bdm/enter",
        name: "BdCoatingQualityManagementForm",
        component: JournalBdmFormEnterView,
        props: {
            pageName: "quality",
            pathName: "BdCoatingQualityManagement",
        },
    },
    {
        path: "/body/reference/assembly/torque",
        name: "BdTorqueManagement",
        component: JournalBdmListView,
        props: {
            pathName: "BdTorqueManagementForm",
        },
    },
    {
        path: "/body/reference/assembly/torque/bdm/enter",
        name: "BdTorqueManagementForm",
        component: JournalBdmFormEnterView,
        props: {
            pageName: "torque",
            pathName: "BdTorqueManagement",
        },
    },
    // {
    //     path: "/body/reference/welding/non-destructive",
    //     name: "BdNonDestructiveManagement",
    //     component: JournalBdmFormEnterView,
    //     component: DevelopingView,
    // },
    // {
    //     path: "/body/reference/welding/tip-change",
    //     component: JournalBdmFormEnterView,
    //     name: "BdTipChangeManagement",
    //     component: DevelopingView,
    // },
];
