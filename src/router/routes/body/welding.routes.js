const JournalEnterView = () =>
  import("@/views/bd/journal/JournalEnterView.vue");
const JournalResultView = () =>
  import("@/views/bd/journal/JournalResultView.vue");
const JournalListView = () => import("@/views/bd/journal/JournalListView.vue");
const JournalListDetailView = () =>
  import("@/views/bd/journal/JournalListDetailView.vue");

export default [
  // 반파괴
  {
    path: "destructive/enter",
    name: "DestructiveEnter",
    component: JournalEnterView,
    props: ({ query }) => ({
      pathName: "DestructiveEnter",
      favoriteId: query.favoriteId,
      inquiryJournal: query.journal,
      inquiryDate: query.date,
      inquiryShift: query.shift,
      inquiryRound: query.round,
    }),
  },
  {
    path: "destructive/view",
    name: "BdDestructiveView",
    component: JournalResultView,
    props: ({ query }) => ({
      favoriteId: query.favoriteId,
      pathName: "DestructiveEnter",
    }),
  },
  {
    path: "destructive/list",
    name: "BdDestructiveList",
    component: JournalListView,
    props: ({ query }) => ({
      favoriteId: query.favoriteId,
      pathName: "BdDestructiveListView",
    }),
  },
  {
    path: "destructive/list/detail",
    name: "BdDestructiveListView",
    component: JournalListDetailView,
    props: ({ query }) => ({
      parentPath: "/body/welding/destructive/list",
      jnlId: query.jnlId,
      startDt: query.startDt,
      endDt: query.endDt,
      version: query.version,
      shiftCd: query.shiftCd,
    }),
  },
  //CO2
  {
    path: "co2/enter",
    name: "BdCo2Enter",
    component: JournalEnterView,
    props: ({ query }) => ({
      pathName: "BdCo2Enter",
      favoriteId: query.favoriteId,
      inquiryJournal: query.journal,
      inquiryDate: query.date,
      inquiryShift: query.shift,
      inquiryRound: query.round,
    }),
  },
  {
    path: "co2/view",
    name: "BdCo2View",
    component: JournalResultView,
    props: ({ query }) => ({
      favoriteId: query.favoriteId,
      pathName: "BdCo2Enter",
    }),
  },
  {
    path: "co2/list",
    name: "BdCo2List",
    component: JournalListView,
    props: ({ query }) => ({
      favoriteId: query.favoriteId,
      pathName: "BdCo2ListView",
    }),
  },
  {
    path: "co2/list/detail",
    name: "BdCo2ListView",
    component: JournalListDetailView,
    props: ({ query }) => ({
      parentPath: "/body/welding/co2/list",
      jnlId: query.jnlId,
      startDt: query.startDt,
      endDt: query.endDt,
      version: query.version,
      shiftCd: query.shiftCd,
    }),
  },
  //비파괴
  {
    path: "non-destructive/enter",
    name: "BdNonDestructiveEnter",
    component: JournalEnterView,
    props: ({ query }) => ({
      pathName: "BdNonDestructiveEnter",
      favoriteId: query.favoriteId,
      inquiryJournal: query.journal,
      inquiryDate: query.date,
      inquiryShift: query.shift,
      inquiryRound: query.round,
    }),
  },
  {
    path: "non-destructive/view",
    name: "BdNonDestructiveView",
    component: JournalResultView,
    props: ({ query }) => ({
      favoriteId: query.favoriteId,
      pathName: "BdNonDestructiveEnter",
    }),
  },
  {
    path: "non-destructive/list",
    name: "BdNonDestructiveList",
    component: JournalListView,
    props: ({ query }) => ({
      favoriteId: query.favoriteId,
      pathName: "BdNonDestructiveListView",
    }),
  },
  {
    path: "non-destructive/list/detail",
    name: "BdNonDestructiveListView",
    component: JournalListDetailView,
    props: ({ query }) => ({
      parentPath: "/body/welding/non-destructive/list",
      jnlId: query.jnlId,
      startDt: query.startDt,
      endDt: query.endDt,
      version: query.version,
      shiftCd: query.shiftCd,
    }),
  },
  //특화
  {
    path: "special/enter",
    name: "BdSpecialEnter",
    component: JournalEnterView,
    props: ({ query }) => ({
      pathName: "BdSpecialEnter",
      favoriteId: query.favoriteId,
      inquiryJournal: query.journal,
      inquiryDate: query.date,
      inquiryShift: query.shift,
      inquiryRound: query.round,
    }),
  },
  {
    path: "special/view",
    name: "BdSpecialView",
    component: JournalResultView,
    props: ({ query }) => ({
      favoriteId: query.favoriteId,
      pathName: "BdSpecialEnter",
    }),
  },
  {
    path: "special/list",
    name: "BdSpecialList",
    component: JournalListView,
    props: ({ query }) => ({
      favoriteId: query.favoriteId,
      pathName: "BdSpecialListView",
    }),
  },
  {
    path: "special/list/detail",
    name: "BdSpecialListView",
    component: JournalListDetailView,
    props: ({ query }) => ({
      parentPath: "/body/welding/special/list",
      jnlId: query.jnlId,
      startDt: query.startDt,
      endDt: query.endDt,
      version: query.version,
      shiftCd: query.shiftCd,
    }),
  },
  //팁교환
  {
    path: "tip-change/enter",
    name: "BddTipChangeEnter",
    component: JournalEnterView,
    props: ({ query }) => ({
      pathName: "BddTipChangeEnter",
      favoriteId: query.favoriteId,
      inquiryJournal: query.journal,
      inquiryDate: query.date,
      inquiryShift: query.shift,
      inquiryRound: query.round,
      journalType: "tip",
    }),
  },
  {
    path: "tip-change/view",
    name: "BddTipChangeView",
    component: JournalResultView,
    props: ({ query }) => ({
      favoriteId: query.favoriteId,
      pathName: "BddTipChangeEnter",
      pathSegment: "tip",
    }),
  },
  {
    path: "tip-change/list",
    name: "BddTipChangeList",
    component: JournalListView,
    props: ({ query }) => ({
      favoriteId: query.favoriteId,
      pathName: "BddTipChangeListView",
      pathSegment: "tip",
    }),
  },
  {
    path: "tip-change/list/detail",
    name: "BddTipChangeListView",
    component: JournalListDetailView,
    props: ({ query }) => ({
      parentPath: "/body/welding/tip-change/list",
      pathSegment: "tip",
      hasVehl: false,
      jnlId: query.jnlId,
      startDt: query.startDt,
      endDt: query.endDt,
      version: query.version,
      shiftCd: query.shiftCd,
    }),
  },
];
