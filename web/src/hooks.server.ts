import type { Handle } from "@sveltejs/kit";
import { IS_PROD } from "./lib/constants";

const FAKE_HOMEPAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <link rel="icon" href="http://localhost:5173/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FTCScout</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&amp;display=swap" rel="stylesheet">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="http://localhost:5173/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="http://localhost:5173/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2c666e">
    <meta name="msapplication-TileColor" content="#2c666e">
    <meta name="theme-color" content="#ffffff">
    <meta property="og:site_name" content="FTCScout">
    <meta name="description" content="FTCScout is a new way to track and scout FIRST Tech Challenge providing advanced statistics and data on all aspects of FTC.">
    <meta property="og:title" content="FTCScout">
    <meta property="og:image" content="/banner.png">
    <meta property="og:description" content="FTCScout is a new way to track and scout FIRST Tech Challenge providing advanced statistics and data on all aspects of FTC.">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="theme-color" content="#2c666e">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="620">
    <meta property="og:image:type" content="image/png">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://ftcscout.org/">
</head>    
<body>
    <h1>FTCScout</h1>
    <p>A new way to track and scout FIRST Tech Challenge</p>
    
    <p>Active Teams</p>
    
    <p>Matches Played</p>
    
    <p>Today's Events</p>
    
    <p>Best Results</p>
    
    <nav>
        <a href="/events">Events</a>
        <a href="/teams">Teams</a>
        <a href="/records">Season Records</a>
        <a href="/about">About</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/api">API</a>
    </nav>
</body>
</html>`;

export const handle: Handle = async ({ event, resolve }) => {
    let response: Response;

    let isGoogleBot = event.request.headers.get("User-agent")?.includes("Google") ?? false;
    if (isGoogleBot && event.routeId == "") {
        console.log("Responding to Google.");
        response = new Response(FAKE_HOMEPAGE, { headers: { "Content-Type": "text/html" } });
    } else {
        response = await resolve(event);
    }

    if (IS_PROD) {
        response.headers.set("X-Frame-Options", "SAMEORIGIN");
        response.headers.set("X-XSS-Protection", "1; mode=block");
        response.headers.set("Referrer-Policy", "same-origin");
        response.headers.set("Permissions-Policy", "camera=(), microphone=()");
        let canonical = event.url
            .toString()
            .replace(/^http:/, "https:")
            .replace(/^https:\/\/www./, "https://");
        response.headers.set("Link", `<${canonical}>; rel="canonical"`);
    }

    return response;
};
