const CleaningProcessMasterView = () =>
  import("@/views/pa/cleaning/CleaningProcessMasterView");
const CleaningInspectView = () =>
  import("@/views/pa/cleaning/CleaningInspectView");
const CleaningInquiryView = () =>
  import("@/views/pa/cleaning/CleaningInquiryView");
const CleaningSpecialView = () =>
  import("@/views/pa/cleaning/CleaningProcessSpecialView");
const CleaningProcessView = () =>
  import("@/views/pa/cleaning/CleaningProcessView");
const CleaningSkipReasonView = () =>
  import("@/views/pa/cleaning/CleaningSkipReasonView");
const CleaningAnnualPlanView = () =>
  import("@/views/pa/cleaning/CleaningAnnualPlanView");

export default [
  {
    path: "cleaning",
    children: [
      {
        path: "view",
        name: "CleaningInquiry",
        component: CleaningInquiryView,
        props: ({ query }) => ({
          favoriteId: query.favoriteId,
          startDate: query.startDate,
          endDate: query.endDate,
          doneState: query.doneState,
          isFromOverview: Boolean(Number(query.isFromOverview)),
        }),
      },
      {
        path: "enter",
        name: "CleaningProcess",
        component: CleaningProcessView,
        props: ({ query }) => ({
          favoriteId: query.favoriteId,
        }),
      },
      {
        path: "extra",
        name: "CleaningSpecial",
        component: CleaningSpecialView,
        props: ({ query }) => ({
          favoriteId: query.favoriteId,
        }),
      },
      {
        path: "annual-plan",
        name: "CleaningAnnualPlan",
        component: CleaningAnnualPlanView,
      },
    ],
  },
  {
    path: "reference",
    children: [
      {
        path: "process-master",
        name: "CleaningProcessMaster",
        component: CleaningProcessMasterView,
        props: ({ query }) => ({
          favoriteId: query.favoriteId,
        }),
      },
      {
        path: "routine-management",
        name: "CleaningInspect",
        component: CleaningInspectView,
        props: ({ query }) => ({
          favoriteId: query.favoriteId,
        }),
      },
      {
        path: "skip-reason",
        name: "CleaningSkipReason",
        component: CleaningSkipReasonView,
        props: ({ query }) => ({
          favoriteId: query.favoriteId,
        }),
      },
    ],
  },
];
