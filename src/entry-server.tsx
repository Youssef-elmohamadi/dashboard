import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import { ThemeProvider } from './context/ThemeContext';
import DirectionAndLanguageProvider from './context/DirectionContext';
import { AppWrapper } from './components/common/SEO/PageMeta';

interface PageContext {
  urlOriginal: string;
  isClient: boolean;
  isHydration: boolean;
  initialStoreState?: any;
  [key: string]: any;
}

async function renderToHtml(pageContext: PageContext) {
  const queryClient = new QueryClient();
  const helmetContext = {};

  const appHtml = ReactDOMServer.renderToString(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppWrapper>
            <HelmetProvider context={helmetContext}>
              <StaticRouter location={pageContext.urlOriginal}>
                <DirectionAndLanguageProvider>
                  <App />
                </DirectionAndLanguageProvider>
              </StaticRouter>
            </HelmetProvider>
          </AppWrapper>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );

  const { helmet } = helmetContext;
  const dehydratedState = dehydrate(queryClient);

  return { appHtml, helmet, dehydratedState };
}

export async function render(pageContext: PageContext) {
  const { appHtml, helmet, dehydratedState } = await renderToHtml(pageContext);

  let html = `<!DOCTYPE html>
<html lang="${pageContext.lang || 'en'}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5" />
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="canonical" href="https://tashtiba.com${pageContext.urlOriginal}" />
    <meta name="theme-color" content="#ffffff" />
    <link rel="alternate" hreflang="en" href="https://tashtiba.vercel.app/en" />
    <link rel="alternate" hreflang="ar" href="https://tashtiba.vercel.app/ar" />
    <link rel="alternate" hreflang="x-default" href="https://tashtiba.vercel.app/en" />
  </head>
  <body class="dark:bg-gray-900">
    <div id="root">${appHtml}</div>
    <script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)}</script>
  </body>
</html>`;

  return {
    documentHtml: html,
    pageContext: {},
  };
}