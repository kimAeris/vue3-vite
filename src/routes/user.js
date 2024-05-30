import LoginView from "@/views/user/LoginView";
import SsoView from "@/views/user/SsoView";
// import PreferencesView from "@/views/user/PreferencesView";
import AuthRequestView from "@/views/user/AuthRequestView";
import NoAuthView from "@/views/user/NoAuthView";
import { useUser } from "@/stores/userStore";
import { useMenu } from "@/stores/menuStore";

export default [
    {
        path: "/user/login",
        name: "Login",
        component: LoginView,
    },
    {
        path: "/user/login/sso",
        name: "Sso",
        component: SsoView,
    },
    // {
    //     path: "/user/preferences",
    //     name: "Preferences",
    //     component: PreferencesView,
    // },
    {
        path: "/user/auth-request",
        name: "AuthRequest",
        component: AuthRequestView,
    },
    {
        path: "/user/no-auth",
        name: "NoAuth",
        component: NoAuthView,
    },
    {
        path: "/",
        redirect: (_) => {
            const userStore = useUser();
            const menuStore = useMenu();
            const targetMenu = menuStore.flatMenus.find(
                (menu) => !!menu.pgm_path_adr
            );

            if (userStore.accessToken && targetMenu) {
                return { path: targetMenu.pgm_path_adr };
            } else {
                return { name: "Login" };
            }
        },
    },
];
