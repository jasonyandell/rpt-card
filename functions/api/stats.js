/**
 * GET /api/stats — all-time average of daily totals.
 * A "day" only counts if it has at least one entry; empty days are
 * excluded entirely (not counted as zero).
 */

export async function onRequestGet({ env }) {
  try {
    const row = await env.DB.prepare(
      `SELECT AVG(daily_total) AS avg, COUNT(*) AS days FROM (
         SELECT SUM(value) AS daily_total FROM entries GROUP BY date
       )`
    ).first();

    return jsonResponse({
      avg: row && row.avg !== null ? row.avg : null,
      days: row ? row.days : 0,
    });
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
