import { create } from "zustand";
import { BackendURL } from "../hooks/apiLinks";
import { addToast } from "@heroui/react";

type UserDetailsProps = {
  _id: string;
  email: string;
  username: string;
  role: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

type UserAuthProps = {
  isLogginActive: boolean | null;
  userDetails: UserDetailsProps | null;
  userToken: string | null;
  isCheckingLogin: boolean;
  CheckIsActive: () => void;
  Logout: () => void;
  Login: (email: string, password: string) => Promise<string | boolean | null>;
};

const userAuth = create<UserAuthProps>((set) => ({
  isLogginActive: null,
  isCheckingLogin: true,
  userDetails: null,
  userToken: null,
  CheckIsActive: async () => {
    try {
      const ApiLink = BackendURL();
      const request = await fetch(`${ApiLink}/api/checktoken`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await request.json();
      set({ isLogginActive: response.success as boolean });
      if (response.success) {
        set({ userDetails: response.data });
        set({ userToken: response.token });
      }
    } catch (error) {
      console.log(error);
      set({ isLogginActive: null });
    } finally {
      set({ isCheckingLogin: false });
    }
  },
  Logout: async () => {
    const Apilink = BackendURL();
    const request = await fetch(`${Apilink}/api/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    if (response.success) {
      set({ isCheckingLogin: false });
      set({ isLogginActive: false });
      set({ userDetails: null });
      set({ userToken: null });
      addToast({
        title: "Done",
        description: response.message,
        color: "success",
        timeout: 6000,
      });
    }
  },
  Login: async (email, password) => {
    if (!email) {
      return addToast({
        title: "Error",
        color: "danger",
        description: "Email is required",
        timeout: 6000,
      });
    }
    if (!password) {
      return addToast({
        title: "Error",
        color: "danger",
        description: "Password is required",
        timeout: 6000,
      });
    }
    const Apilink = BackendURL();

    const request = await fetch(`${Apilink}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const response = await request.json();
    if (response.success) {
      addToast({
        title: "Done",
        color: "success",
        description: response.message,
        timeout: 6000,
      });
      set({ isCheckingLogin: false });
      set({ isLogginActive: true });
      set({ userDetails: response.data });
      return true;
    } else {
      addToast({
        title: "Error",
        color: "danger",
        description: response.message,
        timeout: 6000,
      });
      return false;
    }
  },
}));

export default userAuth;
