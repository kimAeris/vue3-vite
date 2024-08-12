import all from "./all";
import body from "./body";
import commonRoutes from "./common/common.routes";
import noticeRoutes from "./common/notice.routes";
import userRoutes from "./common/user.routes";
import paint from "./paint";

export default [
  {
    // 공통
    path: "/all",
    children: all,
  },
  {
    // 도장
    path: "/paint",
    children: paint,
  },
  {
    // 차체
    path: "/body",
    children: body,
  },
  {
    // 유저
    path: "/user",
    meta: {
      freeAuth: true,
    },
    children: userRoutes,
  },
  {
    // 공지
    // TODO: all로 이동 필요
    path: "/reference",
    children: [
      {
        path: "notice",
        children: noticeRoutes,
      },
    ],
  },

  ...commonRoutes, // 그 외
];
