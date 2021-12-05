import { Layout } from "components/layouts/Layout";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { routes, ROUTE_TYPES } from "routes";
import { CustomRoute } from "./CustomRoute";

export const Routes = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          {routes.map(({ path, component, exact, type }, idx) =>
            typeof type !== "undefined" && type !== ROUTE_TYPES.ALL ? (
              <CustomRoute
                key={idx}
                path={path}
                component={component}
                type={type}
                exact={exact}
              />
            ) : (
              <Route
                key={idx}
                path={path}
                component={component}
                exact={exact}
              />
            )
          )}
        </Switch>
      </Layout>
    </Router>
  );
};
