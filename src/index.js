
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Test the database connection.
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
      } catch (error) {
        return Response.json(
          {
            status: "error",
            message: "Database connection failed."
          },
          { status: 500 }
        );
      }
    }

    // Serve the existing forum website.
    return env.ASSETS.fetch(request);
  }
};