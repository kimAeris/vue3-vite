const JournalBdmListView = () =>
  import("@/views/bd/bdm/journalForm/JournalBdmListView");
const JournalBdmEnterView = () =>
  import("@/views/bd/bdm/journalForm/JournalBdmEnterView.vue");
const NonVehlJournalBdmEnterView = () =>
  import(
    "@/views/bd/bdm/journalForm/NonVehlJournal/NonVehlJournalBdmEnterView.vue"
  );

export default [
  {
    path: "destructive",
    name: "BdDestructiveManagement",
    component: JournalBdmListView,
    props: {
      pathName: "BdDestructiveManagementForm",
    },
  },
  {
    path: "destructive/bdm/enter",
    name: "BdDestructiveManagementForm",
    component: JournalBdmEnterView,
    props: ({ query }) => ({
      journalId: query.journalId,
      version: query.version,
      pathName: "BdDestructiveManagement",
    }),
  },
  {
    path: "non-destructive",
    name: "BdNonDestructiveManagement",
    component: JournalBdmListView,
    props: {
      pathName: "BdNonDestructiveManagementForm",
    },
  },
  {
    path: "non-destructive/bdm/enter",
    name: "BdNonDestructiveManagementForm",
    component: JournalBdmEnterView,
    props: ({ query }) => ({
      journalId: query.journalId,
      version: query.version,
      pathName: "BdNonDestructiveManagement",
    }),
  },
  {
    path: "special",
    name: "BdSpecialManagement",
    component: JournalBdmListView,
    props: {
      pathName: "BdSpecialManagementForm",
    },
  },
  {
    path: "special/bdm/enter",
    name: "BdSpecialManagementForm",
    component: JournalBdmEnterView,
    props: ({ query }) => ({
      journalId: query.journalId,
      version: query.version,
      pathName: "BdSpecialManagement",
    }),
  },
  {
    path: "co2",
    name: "BdCo2Management",
    component: JournalBdmListView,
    props: {
      pathName: "BdCo2ManagementForm",
    },
  },
  {
    path: "co2/bdm/enter",
    name: "BdCo2ManagementForm",
    component: JournalBdmEnterView,
    props: ({ query }) => ({
      journalId: query.journalId,
      version: query.version,
      pathName: "BdCo2Management",
    }),
  },
  {
    path: "tip-change",
    name: "BdTipChangeManagement",
    component: JournalBdmListView,
    props: {
      pathName: "BdTipChangeManagementForm",
      pathSegment: "tip",
    },
  },
  {
    path: "tip-change/bdm/enter",
    name: "BdTipChangeManagementForm",
    component: NonVehlJournalBdmEnterView,
    props: ({ query }) => ({
      journalId: query.journalId,
      version: query.version,
      pathName: "BdTipChangeManagement",
      pathSegment: "tip",
    }),
  },
];
