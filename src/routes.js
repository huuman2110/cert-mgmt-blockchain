import Admin from "pages/admin";
import Censors from "pages/censors";
import Home from "pages/Home";
import NotFound from "pages/NotFound";
import Users from "pages/users";

export const ROUTE_TYPES = {
  ALL: 0,
  PRIVATE: 1,
  PUBLIC: 2,
};

export const routes = [
  {
    path: "/",
    component: Home,
    exact: true,
    type: ROUTE_TYPES.ALL,
  },
  {
    path: "/admin",
    component: Admin,
    exact: true,
    type: ROUTE_TYPES.PRIVATE,
  },
  {
    path: "/censors",
    component: Censors,
    exact: true,
    type: ROUTE_TYPES.PRIVATE,
  },
  {
    path: "/users/:address",
    component: Users,
    exact: true,
    type: ROUTE_TYPES.ALL,
  },
  {
    path: "*",
    component: NotFound,
    type: ROUTE_TYPES.ALL,
  },
];
