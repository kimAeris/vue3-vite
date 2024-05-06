import { createRouter, createWebHashHistory } from "vue-router";
import user from "./user";

const routes = [
    // 공통
    ...user,
];

const router = createRouter({
    history: createWebHashHistory("/"),
    routes,
});

// router.beforeEach(async (to, from) => {
//     return "/user/login";
// });

export default router;
