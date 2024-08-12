const SsoView = () => import("@/views/user/SsoView");
const AuthRequestView = () => import("@/views/user/AuthRequestView");
const NoAuthView = () => import("@/views/user/NoAuthView");

export default [
  {
    path: "sso/login",
    name: "Sso",
    component: SsoView,
  },
  {
    path: "auth-request",
    name: "AuthRequest",
    component: AuthRequestView,
  },
  {
    path: "no-auth",
    name: "NoAuth",
    component: NoAuthView,
  },
];
