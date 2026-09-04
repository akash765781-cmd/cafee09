import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Runtime error:", error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const v = "v=20260904";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "UK 09 — Restaurant in Bathinda, Punjab" },
      {
        name: "description",
        content:
          "UK 09 is a dine-in restaurant on Green City Road, Bathinda. Open daily 10 AM–11 PM.",
      },
      { name: "theme-color", content: "#231f1c" },
      { property: "og:site_name", content: "UK 09" },
      { property: "og:title", content: "UK 09 — Restaurant in Bathinda, Punjab" },
      {
        property: "og:description",
        content: "UK 09 is a dine-in restaurant on Green City Road, Bathinda. Open daily 10 AM–11 PM.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://cafee09.vercel.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "UK 09 — Restaurant in Bathinda, Punjab" },
    ],
    links: [
      { rel: "canonical", href: "https://cafee09.vercel.app/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "shortcut icon", href: `/favicon.ico?${v}` },
      { rel: "icon", href: `/favicon.svg?${v}`, type: "image/svg+xml" },
      { rel: "icon", href: `/favicon.ico?${v}`, sizes: "any" },
      { rel: "icon", href: `/favicon-32x32.png?${v}`, type: "image/png", sizes: "32x32" },
      { rel: "icon", href: `/favicon-16x16.png?${v}`, type: "image/png", sizes: "16x16" },
      { rel: "apple-touch-icon", href: `/apple-touch-icon.png?${v}`, sizes: "180x180" },
      { rel: "manifest", href: `/site.webmanifest?${v}` },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
      <Toaster position="bottom-right" theme="dark" />
    </QueryClientProvider>
  );
}
