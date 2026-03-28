/**
 * GET /api/activities — returns the ordered list of activities
 * These are fixed in the app but this endpoint lets the frontend
 * stay in sync if activities are ever added to the DB.
 */

const DEFAULT_ACTIVITIES = [
  "Walking",
  "Triking",
  "Voice",
  "Torso",
  "RYTARY",
  "Weight",
  "DBS",
  "Water",
  "Erin",
  "Dishes",
  "Trash",
  "Mail",
  "Laundry",
  "Chores",
];

export async function onRequestGet({ env }) {
  try {
    // Return the canonical ordered list; DB lookup is for future extensibility
    return jsonResponse({ activities: DEFAULT_ACTIVITIES });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
