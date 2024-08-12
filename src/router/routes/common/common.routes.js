// import { useMenu } from "@/store";
// import { useUser } from "@/store";
import LoginView from "@/views/user/LoginView.vue";
const ErrorView = () => import("@/views/etc/ErrorView.vue");
const FavoritesView = () => import("@/views/system/etc/FavoritesView.vue");

export default [
  {
    path: "/favorites",
    name: "FavoritesList",
    component: FavoritesView,
  },
  {
    path: "/",
    alias: "/user/login",
    name: "Home",
    meta: {
      freeAuth: true,
    },
    component: LoginView,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Error",
    meta: {
      freeAuth: true,
    },
    component: ErrorView,
  },
];

// redirect: async (_) => {
//   const menuStore = useMenu();

//   const targetMenu = menuStore.flatMenus.find(
//     (menu) => !!menu.pgm_path_adr
//   );
//   const userStore = useUser();

//   if (userStore.accessToken && targetMenu) {
//     return { path: targetMenu.pgm_path_adr };
//   } else {
//     return { name: "Home" };
//   }
// },
// },
