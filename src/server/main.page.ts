export const page = (): string => `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Inlify</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charset="UTF-8" />
        <title>Inklify</title>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <script type="module" src="/bundle.js"></script>
        <link rel="stylesheet" type="text/css" href="/app.css">
        <meta name="description" content="Inklify - AI powered book and audio book creation">
        <link rel="icon" href="/logo/favicon.ico">
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#1e90ff">
        <!-- Add to homescreen for Chrome on Android. Fallback for manifest.json -->
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="application-name" content="Inklify">

        <!-- Add to homescreen for Safari on iOS -->
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="Inklify">

        <!-- Homescreen icons -->
        <link rel="apple-touch-icon" href="/logo/logo-256x256.png">
        <link rel="apple-touch-icon" sizes="512x512" href="/logo/logo-512x512.png">

        <!-- Tile icon for Windows 8 (144x144 + tile color) -->
        <meta name="msapplication-TileImage" content="/logo/logo-512x512.png">
        <meta name="msapplication-TileColor" content="#1e90ff">
        <meta name="msapplication-tap-highlight" content="no">

        <!-- Default twitter cards -->
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@username">
        <meta property="og:type" content="website">
        <meta property="og:title" content="Inklify">
        <meta property="og:site_name" content="Inklify">
        <meta property="og:description" content="Inklify - AI powered book and audio book creation">
        <meta property="og:image" content="/logo/logo-512x512.png" />
    </head>
    <body>
        <torlify-app></torlify-app>
    </body>
    </html>
`;
