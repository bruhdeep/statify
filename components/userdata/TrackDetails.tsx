/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

const SpotifyTrackDetails = ({ trackId }: { trackId: string }) => {
  const { data: session } = useSession();
  const [trackDetails, setTrackDetails] = useState<any>(null);

  useEffect(() => {
    const fetchTrackDetails = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/tracks/${trackId}`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setTrackDetails(data);
      } catch (error) {
        console.error("Error fetching track details:", error);
      }
    };

    fetchTrackDetails();
  }, [session, trackId]);

  if (!trackDetails) {
    return <p>Loading track details...</p>;
  }

  return (
    <div>
      {trackDetails && (
        <div>
          <div>
            <h2>Track Details</h2>
            {trackDetails && (
              <>
                <p>Name: {trackDetails.name}</p>
                <p>Popularity: {trackDetails.popularity}</p>
                <p>
                  Artists:{" "}
                  {trackDetails.artists &&
                    trackDetails.artists
                      .map((artist: { name: any }) => artist.name)
                      .join(", ")}
                </p>
                <p>
                  Album:
                  {trackDetails.album && trackDetails.album.name}
                </p>
                <p>Duration: {msToMinSec(trackDetails.duration_ms)}</p>
                <p>Genre: {trackDetails.genre}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to convert milliseconds to minutes and seconds
const msToMinSec = (milliseconds: number) => {
  const totalSeconds = milliseconds / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default SpotifyTrackDetails;
