/**
 * GET  /api/entries?from=YYYY-MM-DD&to=YYYY-MM-DD
 * PUT  /api/entries  { activity, date, value }
 */

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  if (!from || !to) {
    return jsonResponse({ error: "from and to query params required" }, 400);
  }

  try {
    const { results } = await env.DB.prepare(
      "SELECT activity, date, value FROM entries WHERE date >= ?1 AND date <= ?2 ORDER BY date ASC"
    )
      .bind(from, to)
      .all();

    return jsonResponse(results);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

export async function onRequestPut({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const { activity, date, value } = body;

  if (!activity || !date) {
    return jsonResponse({ error: "activity and date required" }, 400);
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return jsonResponse({ error: "date must be YYYY-MM-DD" }, 400);
  }

  try {
    if (value === null || value === undefined || value === "") {
      // Delete the entry (clear the cell)
      await env.DB.prepare(
        "DELETE FROM entries WHERE activity = ?1 AND date = ?2"
      )
        .bind(activity, date)
        .run();
    } else {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return jsonResponse({ error: "value must be a number or empty" }, 400);
      }

      await env.DB.prepare(
        `INSERT INTO entries (activity, date, value, updated_at)
         VALUES (?1, ?2, ?3, datetime('now'))
         ON CONFLICT(activity, date) DO UPDATE SET value = ?3, updated_at = datetime('now')`
      )
        .bind(activity, date, numValue)
        .run();
    }

    return jsonResponse({ ok: true });
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
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
