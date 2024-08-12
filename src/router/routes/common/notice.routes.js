const NoticeManagementView = () =>
  import("@/views/bd/bdm/NoticeManagementView.vue");
const NoticeManagementAddView = () =>
  import("@/views/bd/bdm/NoticeManagementAddView.vue");

export default [
  {
    path: "management",
    name: "BdNoticeManagement",
    component: NoticeManagementView,
    props: {
      pathName: "BdNoticeManagementAdd",
    },
  },
  {
    path: "view",
    name: "BdNoticeManagementAdd",
    component: NoticeManagementAddView,
    props: ({ query }) => ({
      notiId: query.notiId,
    }),
  },
];
