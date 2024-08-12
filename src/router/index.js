import { createRouter, createWebHashHistory } from "vue-router";

import useGuard from "./hooks/useGuard";
import routes from "./routes";

const router = createRouter({
    history: createWebHashHistory("/"),
    routes,
    scrollBehavior: (to, from, savedPosition) => {
        if (to.path !== from.path) {
            if (savedPosition) {
                return savedPosition;
            } else {
                return { left: 0, top: 0 };
            }
        }

        return;
    },
});

// 가드
router.beforeEach(useGuard);

export default router;
