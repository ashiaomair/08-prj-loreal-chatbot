// Copy this code into your Cloudflare Worker script

export default {
  async fetch(request, env) {
    // CORS headers for cross-origin requests
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Check if the request method is POST
      if (request.method !== "POST") {
        return new Response(
          JSON.stringify({ error: "Method not allowed. Please use POST." }),
          { status: 405, headers: corsHeaders }
        );
      }

      // Get the OpenAI API key from environment variables
      const apiKey = env.OPENAI_API_KEY; // Make sure to set this in your Cloudflare Workers dashboard
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "OpenAI API key not configured" }),
          { status: 500, headers: corsHeaders }
        );
      }

      // Parse the request body
      const requestData = await request.json();

      // Extract model and messages from request body
      // Default to "gpt-4o" if model is not provided
      const model = requestData.model || "gpt-4o";
      const messages = requestData.messages;

      // Validate that messages array is provided
      if (!messages || !Array.isArray(messages)) {
        return new Response(
          JSON.stringify({ error: "Messages array is required" }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Prepare the request body for OpenAI API
      const requestBody = {
        model: model,
        messages: messages,
        max_tokens: 300,
      };

      // Make request to OpenAI API
      const apiUrl = "https://api.openai.com/v1/chat/completions";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Check if OpenAI API response is successful
      if (!response.ok) {
        const errorData = await response.json();
        return new Response(
          JSON.stringify({
            error: "OpenAI API error",
            details: errorData,
          }),
          { status: response.status, headers: corsHeaders }
        );
      }

      // Parse and return the successful response
      const data = await response.json();
      return new Response(JSON.stringify(data), { headers: corsHeaders });
    } catch (error) {
      // Handle any unexpected errors
      console.error("Cloudflare Worker error:", error);
      return new Response(
        JSON.stringify({
          error: "Internal server error",
          message: error.message,
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  },
};
