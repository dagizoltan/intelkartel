import { html } from "hono/html";
import { jsx } from "hono/jsx";
import { Layout } from "../components/Layout.jsx";

export const rendererMiddleware = async (c, next) => {
  c.render = (Component, props) => {
    const currentPath = c.req.path;

    return c.html(
      html`<!DOCTYPE html>${jsx(Layout, {
        ...props,
        currentPath: currentPath,
        children: jsx(Component, props)
      })}`
    );
  };
  await next();
};
