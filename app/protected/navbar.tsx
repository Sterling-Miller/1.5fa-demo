import React from "react";
import { signOut } from "../auth";

type NavbarProps = {
  currentUser: string;
  onSignOut: <R extends boolean = true>( options?: | { redirectTo?: string | undefined; redirect?: R | undefined } | undefined ) => Promise<R extends false ? any : never>;
};

export default function Navbar({ currentUser }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-4 py-2 shadow">
      <h1 className="text-lg font-semibold px-10">
        You are logged in as: {currentUser}
      </h1>
      <div className="flex items-center p-5">
        <SignOut />
      </div>
    </nav>
  );
}

function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        type="submit"
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Sign out
        </span>
      </button>
    </form>
  );
}
