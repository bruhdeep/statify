import React from "react";
import RecentlyPlayed from "@/components/userdata/RecentlyPlayed";
import CurrentlyPlaying from "@/components/userdata/CurrentlyPlaying";
import UserPlaylists from "@/components/userdata/UserPlaylists";
import TermSelect from "@/components/TermSelect";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) redirect("/");

  return (
    <div className="min-h-screen lg:flex pt-5">
      {/* hidden in sm */}
      <div className="hidden lg:block w-[60%] h-full">
        <div className="px-5">
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold py-3">Recent</p>
          </div>
          <CurrentlyPlaying />
          <RecentlyPlayed />
        </div>
      </div>

      <div className="w-[100%] lg:w-[40%] h-full">
        {/* hidden in lg */}
        <div className="lg:hidden">
          <div className="">
            <br />
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">Recent</p>
            </div>
            <br />
            <CurrentlyPlaying />
            <RecentlyPlayed />
          </div>
        </div>
        <div className=" lg:block">
          <TermSelect />
        </div>
        <br />
        <p className="text-xl font-bold">Playlists</p>
        <br />
        <div>
          <UserPlaylists />
        </div>
      </div>
    </div>
  );
}
