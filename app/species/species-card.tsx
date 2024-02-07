"use client";
/*
Note: "use client" is a Next.js App Router directive that tells React to render the component as
a client component rather than a server component. This establishes the server-client boundary,
providing access to client-side functionality such as hooks and event handlers to this component and
any of its imported children. Although the SpeciesCard component itself does not use any client-side
functionality, it is beneficial to move it to the client because it is rendered in a list with a unique
key prop in species/page.tsx. When multiple component instances are rendered from a list, React uses the unique key prop
on the client-side to correctly match component state and props should the order of the list ever change.
React server components don't track state between rerenders, so leaving the uniquely identified components (e.g. SpeciesCard)
can cause errors with matching props and state in child components if the list order changes.
*/
import type { Database } from "@/lib/schema";
import Image from "next/image";
import SpeciesDetailsDialog from "./species-details-dialog";
type Species = Database["public"]["Tables"]["species"]["Row"];

// First, ensure you import useState for handling state
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { useState } from "react";
import React, { useEffect } from 'react';

export default function SpeciesCard({ species, currentUser }: { species: Species; currentUser: string }) {
  // Add state for hover effect
  const [isHovered, setIsHovered] = useState(false);
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    // Function to fetch the author's display name
    const fetchAuthorDisplayName = async () => {
      const supabaseClient = createBrowserSupabaseClient();
      const { data, error } = await supabaseClient
        .from("profiles")
        .select("display_name")
        .eq("id", species.author)
        .single();

      if (error) {
        console.error("Error fetching author details:", error);
      } else if (data) {
        setAuthorName(data.display_name);
      }
    };

    if (species.author) {
      void fetchAuthorDisplayName();
    }
  }, [species.author]);

  // Function to delete a species
  const deleteSpecies = async () => {
    const supabaseClient = createBrowserSupabaseClient();
    const { error } = await supabaseClient.from("species").delete().match({ id: species.id });

    if (error) {
      alert(`Error deleting species: ${error.message}`);
    } else {
      // Reload the page to reflect the deletion
      window.location.reload();
    }
  };

  return (
    <div
      className="relative m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && species.author === currentUser && (
        <button
          onClick={() => {
            // Display confirmation dialog
            const isConfirmed = window.confirm("Are you sure you want to delete this species?");
            if (isConfirmed) {
              void deleteSpecies();
            }
            // If the user cancels, do nothing
          }}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            background: "red",
            color: "white",
            borderRadius: "4px",
            width: "25px",
            height: "25px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "none",
            boxShadow: "0 2.5px 5px rgba(0,0,0,0.4)",
            zIndex: 10,
          }}
          aria-label="Delete Species"
        >
          ✕
        </button>
      )}
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} layout="fill" style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.scientific_name}</h3>
      <h4 className="text-lg font-light italic">{species.common_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      <SpeciesDetailsDialog species={species} currentUser={currentUser} />
      {authorName && ( 
        <p className="mt-4 text-sm text-left text-gray-400">Author: {authorName}</p>
      )}
    </div>
  );
}
