import { useRoutes } from "react-router-dom";
import { routeConfig } from './routeConfig';
// import { Landing } from "@/features/misc";
import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";

export const MyRoutes = () => {
  // const commonRoutes = [{ path: "/", element: <Landing /> }];
  // const routes = auth.user ? protectedRoutes : publicRoutes;
  // const element = useRoutes([...routes, ...commonRoutes]);

  // RouteConfig routing list, two types of routes: pre-login and post-login
  const element = useRoutes([...routeConfig, ...protectedRoutes, ...publicRoutes]);

  return <>{element}</>;
};