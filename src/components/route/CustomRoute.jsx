import { GlobalContext } from "context/GlobalContext";
import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { ROUTE_TYPES } from "routes";

export const CustomRoute = ({
  component: Component,
  type,
  location,
  ...rest
}) => {
  const { isAuthenticated } = useContext(GlobalContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        type === ROUTE_TYPES.PRIVATE ? (
          isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { prePath: location.pathname },
              }}
            />
          )
        ) : type === ROUTE_TYPES.PUBLIC ? (
          !isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          )
        ) : (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        )
      }
    />
  );
};
