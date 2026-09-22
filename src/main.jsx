import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import store from "./store/store.js";

import { AuthLayout,Login } from "./components/index.js";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import Post from "./pages/Post";
import AllPost from "./pages/AllPost.jsx"
import FullProfile from "./pages/FullProfile";
import Follow from "./pages/Follow.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <AuthLayout authentication={true}>
            <AllPost />
          </AuthLayout>
        ),
      },
      {
        path: "/add-post",
        element: (
          <AuthLayout authentication={true}>
            <AddPost />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authentication={true}>
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path: "/profile/:userId",
        element: (
          <FullProfile/>
        ),
      },
      {
        path: "/post/:slug",
        element: <Post />,
      },
      {
        path: "/profile/:userId/:type",
        element: <Follow/>
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);