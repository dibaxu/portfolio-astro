import type { APIRoute } from "astro";


export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();  
  const email = data.get("email");
  const subject = data.get("subject");
  const message = data.get("message");
  // Validate the data - you'll probably want to do more than this
  if (!subject || !email || !message) {
    return new Response(
      JSON.stringify({
        message: "Missing required fields",
      }),
      { status: 400 }
    );
  }
  console.log(`Feedback from ${subject} <${email}>: ${message}`);
  // Do something with the data, then return a success response
  return new Response(
    JSON.stringify({
      message: "Success!"
    }),
    { status: 200 }
  );
};


