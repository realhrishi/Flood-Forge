import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const zones = [
      {
        zone_id: "ZONE_001",
        name: "North Delhi",
        city: "Delhi",
        center_lat: 28.75,
        center_lng: 77.1,
        population: 450000,
        geometry: { type: "Polygon", coordinates: [[]] },
      },
      {
        zone_id: "ZONE_002",
        name: "South Delhi",
        city: "Delhi",
        center_lat: 28.52,
        center_lng: 77.18,
        population: 380000,
        geometry: { type: "Polygon", coordinates: [[]] },
      },
      {
        zone_id: "ZONE_003",
        name: "Mumbai Central",
        city: "Mumbai",
        center_lat: 19.08,
        center_lng: 72.88,
        population: 520000,
        geometry: { type: "Polygon", coordinates: [[]] },
      },
      {
        zone_id: "ZONE_004",
        name: "Bangalore South",
        city: "Bangalore",
        center_lat: 12.93,
        center_lng: 77.62,
        population: 320000,
        geometry: { type: "Polygon", coordinates: [[]] },
      },
      {
        zone_id: "ZONE_005",
        name: "Chennai Coastal",
        city: "Chennai",
        center_lat: 13.05,
        center_lng: 80.27,
        population: 290000,
        geometry: { type: "Polygon", coordinates: [[]] },
      },
      {
        zone_id: "ZONE_006",
        name: "Kolkata East",
        city: "Kolkata",
        center_lat: 22.57,
        center_lng: 88.37,
        population: 410000,
        geometry: { type: "Polygon", coordinates: [[]] },
      },
      {
        zone_id: "ZONE_007",
        name: "Hyderabad",
        city: "Hyderabad",
        center_lat: 17.37,
        center_lng: 78.47,
        population: 280000,
        geometry: { type: "Polygon", coordinates: [[]] },
      },
      {
        zone_id: "ZONE_008",
        name: "Pune",
        city: "Pune",
        center_lat: 18.52,
        center_lng: 73.85,
        population: 210000,
        geometry: { type: "Polygon", coordinates: [[]] },
      },
    ];

    const shelters = [
      {
        zone_id: "ZONE_001",
        name: "North Delhi Community Center",
        capacity: 500,
        current_occupancy: 120,
        address: "Sector 12, North Delhi",
        latitude: 28.75,
        longitude: 77.1,
        facilities: ["Medical", "Food", "Water", "Beds"],
        contact: "+91-98765-43210",
      },
      {
        zone_id: "ZONE_002",
        name: "South Delhi High School",
        capacity: 800,
        current_occupancy: 250,
        address: "Mehrauli, South Delhi",
        latitude: 28.52,
        longitude: 77.18,
        facilities: ["Medical", "Food", "Water", "Beds", "Toilets"],
        contact: "+91-98765-43211",
      },
      {
        zone_id: "ZONE_003",
        name: "Mumbai Exhibition Center",
        capacity: 2000,
        current_occupancy: 450,
        address: "NESCO, Mumbai",
        latitude: 19.08,
        longitude: 72.88,
        facilities: ["Medical", "Food", "Water", "Beds", "Toilets", "Power"],
        contact: "+91-98765-43212",
      },
      {
        zone_id: "ZONE_004",
        name: "Bangalore Sports Complex",
        capacity: 1200,
        current_occupancy: 300,
        address: "Koramangala, Bangalore",
        latitude: 12.93,
        longitude: 77.62,
        facilities: ["Medical", "Food", "Water", "Beds", "Toilets"],
        contact: "+91-98765-43213",
      },
      {
        zone_id: "ZONE_005",
        name: "Chennai Naval Base",
        capacity: 600,
        current_occupancy: 80,
        address: "Naval Base, Chennai",
        latitude: 13.05,
        longitude: 80.27,
        facilities: ["Medical", "Food", "Water", "Beds", "Boats"],
        contact: "+91-98765-43214",
      },
    ];

    const insertZonesResponse = await fetch(`${supabaseUrl}/rest/v1/zones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify(zones),
    });

    if (!insertZonesResponse.ok) {
      console.log("Zones might already exist or error occurred");
    }

    const insertSheltersResponse = await fetch(`${supabaseUrl}/rest/v1/shelters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify(shelters),
    });

    if (!insertSheltersResponse.ok) {
      console.log("Shelters might already exist or error occurred");
    }

    return new Response(
      JSON.stringify({
        message: "Data seeding completed",
        zones: zones.length,
        shelters: shelters.length,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
