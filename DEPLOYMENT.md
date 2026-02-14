# Deployment Guide

This project is built with **React**, **TypeScript**, and **Vite**. It is designed to be deployed to static hosting platforms like Vercel or Netlify.

## Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

## Local Development

To run the project locally:

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## Backend Local Development

To run the backend locally:

1.  Navigate to the `server` directory.
2.  Install dependencies (if not already installed).
3.  Start the server:
    ```bash
    python manage.py runserver
    ```


## Building for Production

To create a production build:

```bash
npm run build
```

This will generate a `dist` folder containing the compiled static assets.

## Previewing Production Build

To preview the build locally:

```bash
npm run preview
```

## Deployment Options

### Vercel (Recommended)

This project includes a `vercel.json` configuration file.

1.  Install Vercel CLI: `npm i -g vercel`
2.  Run `vercel` to deploy.
3.  Or connect your GitHub repository to Vercel for automatic deployments.

### Netlify

This project includes a `netlify.toml` configuration file.

1.  Connect your repository to Netlify.
2.  Build command: `npm run build`
3.  Publish directory: `dist`

## Environment Variables

Make sure to set the following environment variables in your deployment dashboard:

- `VITE_API_URL`: The URL of your backend API (e.g., `https://your-api.onrender.com`).
