/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import TopArtistsAndTracks from "./TopArtistsAndTracks";

const UserInfo = ({ userId }: { userId: string }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [trackdata, setTrackData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [topdata, setTopData] = useState<any[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users?query=${userId}`);

        const data = await response.json();

        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchRecentlyPlayed = async () => {
      setError("");
      try {
        const response = await fetch(
          `/api/fetchusersrecentlyplayed?query=${user?.email}`
        );

        if (response.ok) {
          const trackdata = await response.json();
          setTrackData(trackdata);
        } else {
          throw new Error("Unable to fetch recently played tracks");
        }
      } catch (error) {
        setError("Error fetching recently played tracks");
        console.error(error);
      }
    };

    const fetchTop = async () => {
      try {
        const response = await fetch(`/api/gettop?query=${user?.email}`);

        if (response.ok) {
          const topdata = await response.json();
          setTopData(topdata);
        } else {
          throw new Error("Unable to fetch recently played tracks");
        }
      } catch (error) {}
    };

    const fetchIsFollowing = async () => {
      try {
        const response = await fetch(
          `/api/checkfollow?followerId=${user?.email}&followeeId=${session?.user?.email}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const { isFollowing } = await response.json();
        setIsFollowing(isFollowing);
      } catch (error) {
        console.error("Error fetching follow status:", error);
        setIsFollowing(false);
      }
    };

    const fetchFollowers = async () => {
      try {
        const response = await fetch(`/api/getfollowers?query=${user?.email}`);

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const followers = await response.json();
        if (followers) {
          console.log("followers", followers);
          setFollowers(followers.length);
        }
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    fetchFollowers();
    fetchIsFollowing();
    fetchUser();
    fetchRecentlyPlayed();
    fetchTop();

    const interval = setInterval(fetchRecentlyPlayed, 5000); // Refresh every 10 seconds

    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
  }, [userId, session, user?.email]);

  const isViewingOwnProfile = () => {
    return user?.email === session?.user?.email;
  };

  const getTimeAgo = (timestamp: string): string => {
    const currentTime = new Date();
    const playedTime = new Date(timestamp);
    const difference = Math.floor(
      (currentTime.getTime() - playedTime.getTime()) / 60000
    ); // Convert milliseconds to minutes

    if (difference < 1) {
      return "Just now";
    } else if (difference === 1) {
      return "1 minute ago";
    } else if (difference < 60) {
      return `${difference} minutes ago`;
    } else if (difference < 1440) {
      const hours = Math.floor(difference / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return "More than a day ago";
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  function handleFollow() {
    // Send a POST request to your API route
    const requestBody = JSON.stringify({
      followerId: user.email,
      followeeId: session?.user?.email,
    });

    fetch("/api/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    setIsFollowing(true);
  }

  function handleUnfollow() {
    // Send a POST request to your API route
    const requestBody = JSON.stringify({
      followerId: user.email,
      followeeId: session?.user?.email,
    });

    fetch("/api/unfollow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    setIsFollowing(false);
  }

  function saverecentlyplayed() {
    // Send a POST request to your API route
    const requestBody = JSON.stringify({
      accessToken: session?.accessToken,
      userEmail: session?.user?.email,
    });

    fetch("/api/saverecentlyplayed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
  }

  function savetop() {
    // Send a POST request to your API route
    const requestBody = JSON.stringify({
      accessToken: session?.accessToken,
      userEmail: session?.user?.email,
    });

    fetch("/api/savetop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
  }

  function saveplaylists() {
    // Send a POST request to your API route
    const requestBody = JSON.stringify({
      accessToken: session?.accessToken,
      userEmail: session?.user?.email,
    });

    fetch("/api/saveplaylists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
  }

  const handleSaveData = async () => {
    try {
      await saverecentlyplayed();
      await savetop();
      await saveplaylists();
      console.log("All data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="pt-20">
      <div className="flex gap-5 justify-between">
        <div className="flex gap-10">
          <div className="avatar">
            <div className="w-72 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={user.imageurl} alt="" />
            </div>
          </div>
          <div className="text-xl grid items-center gap-2">
            <p>{user.username}</p>
            <p>Followers: {followers}</p>
            {!isViewingOwnProfile() && (
              <div>
                {isFollowing ? (
                  <button className="btn btn-primary" onClick={handleUnfollow}>
                    Unfollow
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleFollow}>
                    Follow
                  </button>
                )}
              </div>
            )}
            {isViewingOwnProfile() && (
              <div className="grid gap-5">
                <button onClick={handleSaveData} className="btn btn-primary">
                  Update saved data
                </button>
              </div>
            )}
          </div>
        </div>
        <TopArtistsAndTracks data={topdata} />
      </div>
      <br />
      <p className="font-bold text-xl">Recently Played</p>
      <br />
      <div>
        <ul className="">
          <p>{error}</p>
          {trackdata.map((track: any, index: number) => (
            <li
              key={index}
              className="flex mb-3 bg-primary rounded-lg overflow-hidden"
            >
              <img
                className="p-2 rounded-xl"
                src={track.image_url}
                alt={track.track_name}
                style={{ width: "100px", height: "100px" }}
              />
              <div className="p-3 grid items-center justify-center">
                <div className="grid">
                  <h3 className="whitespace-nowrap overflow-hidden block text-ellipsis">
                    {track.track_name} by{" "}
                    <span className="font-bold">{track.artist_name}</span>
                  </h3>
                  <div>
                    <p>Played {getTimeAgo(track.played_at)}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserInfo;
