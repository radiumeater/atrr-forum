
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Database health check
    if (url.pathname === "/api/health") {
      try {
        const result = await env.DB.prepare(
          "SELECT COUNT(*) AS total FROM categories"
        ).first();

        return Response.json({
          status: "ok",
          database: "connected",
          categories: result.total
        });
      } catch {
        return Response.json(
          { status: "error", message: "Database connection failed." },
          { status: 500 }
        );
      }
    }

    // Retrieve forum categories
    if (url.pathname === "/api/categories") {
      try {
        const { results } = await env.DB.prepare(
          `SELECT id, name, slug, description, icon
           FROM categories
           ORDER BY sort_order ASC`
        ).all();

        return Response.json(
          { categories: results },
          {
            headers: {
              "Cache-Control": "no-store"
            }
          }
        );
      } catch {
        return Response.json(
          { error: "Could not load categories." },
          { status: 500 }
        );
      }
    }

    // Serve the existing forum website
    return env.ASSETS.fetch(request);
  }
};
