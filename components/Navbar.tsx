/* eslint-disable @next/next/no-img-element */
"use client";

import { FaUser } from "react-icons/fa";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

const Navbars = () => {
  const { data: session }: any = useSession();
  return (
    <div className="">
      <div className="navbar bg-base-100">
        <div className="flex-1 text-primary">
          <a href="/" className="btn btn-ghost text-xl">
            Statify
          </a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
            />
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              {session ? (
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={session?.user?.image}
                  />
                </div>
              ) : (
                <div className="w-10 rounded-full">
                  <FaUser size={40} />
                </div>
              )}
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href={"/profile"}>
                  <button>Profile</button>
                </Link>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                {session ? (
                  <button
                    onClick={() => {
                      signOut();
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <Link href={"/login"}>
                    <button>Login</button>
                  </Link>
                )}
              </li>
            </ul>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbars;