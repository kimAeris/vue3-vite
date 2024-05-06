import LoginView from "@/views/user/LoginView";

export default [
    {
        path: "/user/login",
        name: "Login",
        component: LoginView,
    },
    {
        path: "/",
        redirect: (_) => {
            return { name: "Login" };
        },
    },
];
