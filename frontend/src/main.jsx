import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "./Layout.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import MyProfile from "./MyProfile.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import PostForm from "./Post.jsx";
import AllPosts from "./AllPosts.jsx";
import Project from "./Project.jsx";
import App from "./App.jsx";
import UserProfile from "./UserProfile.jsx";
import { ToastContainer } from "react-toastify";
import { ToastProvider } from "./Contexts/toastContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Chat from "./Chat.jsx";
import ChatInterface from "./ChatInterface.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "post",
        element: (
          <ProtectedRoute>
            <PostForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "allposts",
        element: <AllPosts />,
      },
      {
        path: "/posts/:projectId",
        element: <Project />,
      },
       {
        path: "/chat",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
       {
        path: "/chat/:senderId/:receiverId",
        element: (
          <ProtectedRoute>
            <ChatInterface />
          </ProtectedRoute>
        ),
      },
     
      {
        path: "/profile/:userId",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "myprofile",
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </ToastProvider>
  </StrictMode>
);