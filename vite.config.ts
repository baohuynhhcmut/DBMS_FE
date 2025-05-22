import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { ServerOptions } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/products": {
        target: "http://localhost:8081/ecommerce/api/v1",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api\/products/, "/products"),
        configure: (proxy, _options) => {
          // Add CORS headers to allow all methods
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            // Log the request for debugging
            console.log("Sending Request:", req.method, req.url);

            // Allow all HTTP methods
            proxyReq.setHeader("Access-Control-Allow-Origin", "*");
            proxyReq.setHeader(
              "Access-Control-Allow-Methods",
              "GET, PUT, POST, DELETE, PATCH, OPTIONS"
            );
            proxyReq.setHeader(
              "Access-Control-Allow-Headers",
              "Content-Type, Authorization"
            );
            proxyReq.setHeader("Access-Control-Max-Age", "86400");
          });

          // Handle OPTIONS preflight requests
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response:",
              proxyRes.statusCode,
              req.method,
              req.url
            );

            // Add CORS headers to response
            proxyRes.headers["Access-Control-Allow-Origin"] = "*";
            proxyRes.headers["Access-Control-Allow-Methods"] =
              "GET, PUT, POST, DELETE, PATCH, OPTIONS";
            proxyRes.headers["Access-Control-Allow-Headers"] =
              "Content-Type, Authorization";
            proxyRes.headers["Access-Control-Max-Age"] = "86400";

            // Handle preflight requests
            if (req.method === "OPTIONS") {
              proxyRes.statusCode = 200;
            }
          });

          // Log errors
          proxy.on("error", (err, _req, _res) => {
            console.error("Proxy Error:", err);
          });
        },
      },
      "/api/users": {
        target: "http://localhost:8081/ecommerce/api/v1",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api\/users/, "/users"),
        configure: (proxy, _options) => {
          // Add CORS headers to allow all methods
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            // Log the request for debugging
            console.log("Sending Request:", req.method, req.url);

            // Allow all HTTP methods
            proxyReq.setHeader("Access-Control-Allow-Origin", "*");
            proxyReq.setHeader(
              "Access-Control-Allow-Methods",
              "GET, PUT, POST, DELETE, PATCH, OPTIONS"
            );
            proxyReq.setHeader(
              "Access-Control-Allow-Headers",
              "Content-Type, Authorization"
            );
            proxyReq.setHeader("Access-Control-Max-Age", "86400");
          });

          // Handle OPTIONS preflight requests
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response:",
              proxyRes.statusCode,
              req.method,
              req.url
            );

            // Add CORS headers to response
            proxyRes.headers["Access-Control-Allow-Origin"] = "*";
            proxyRes.headers["Access-Control-Allow-Methods"] =
              "GET, PUT, POST, DELETE, PATCH, OPTIONS";
            proxyRes.headers["Access-Control-Allow-Headers"] =
              "Content-Type, Authorization";
            proxyRes.headers["Access-Control-Max-Age"] = "86400";

            // Handle preflight requests
            if (req.method === "OPTIONS") {
              proxyRes.statusCode = 200;
            }
          });

          // Log errors
          proxy.on("error", (err, _req, _res) => {
            console.error("Proxy Error:", err);
          });
        },
      },
      "/api/orders": {
        target: "http://localhost:8081/ecommerce/api/v1",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api\/orders/, "/orders"),
        configure: (proxy, _options) => {
          // Add CORS headers to allow all methods
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            // Log the request for debugging
            console.log("Sending Request:", req.method, req.url);

            // Allow all HTTP methods
            proxyReq.setHeader("Access-Control-Allow-Origin", "*");
            proxyReq.setHeader(
              "Access-Control-Allow-Methods",
              "GET, PUT, POST, DELETE, PATCH, OPTIONS"
            );
            proxyReq.setHeader(
              "Access-Control-Allow-Headers",
              "Content-Type, Authorization"
            );
            proxyReq.setHeader("Access-Control-Max-Age", "86400");
          });

          // Handle OPTIONS preflight requests
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response:",
              proxyRes.statusCode,
              req.method,
              req.url
            );

            // Add CORS headers to response
            proxyRes.headers["Access-Control-Allow-Origin"] = "*";
            proxyRes.headers["Access-Control-Allow-Methods"] =
              "GET, PUT, POST, DELETE, PATCH, OPTIONS";
            proxyRes.headers["Access-Control-Allow-Headers"] =
              "Content-Type, Authorization";
            proxyRes.headers["Access-Control-Max-Age"] = "86400";

            // Handle preflight requests
            if (req.method === "OPTIONS") {
              proxyRes.statusCode = 200;
            }
          });

          // Log errors
          proxy.on("error", (err, _req, _res) => {
            console.error("Proxy Error:", err);
          });
        },
      },
      "/api/categories": {
        target: "http://localhost:8081/ecommerce/api/v1",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api\/categories/, "/categories"),
        configure: (proxy, _options) => {
          // Add CORS headers to allow all methods
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            // Log the request for debugging
            console.log("Sending Request:", req.method, req.url);

            // Allow all HTTP methods
            proxyReq.setHeader("Access-Control-Allow-Origin", "*");
            proxyReq.setHeader(
              "Access-Control-Allow-Methods",
              "GET, PUT, POST, DELETE, PATCH, OPTIONS"
            );
            proxyReq.setHeader(
              "Access-Control-Allow-Headers",
              "Content-Type, Authorization"
            );
            proxyReq.setHeader("Access-Control-Max-Age", "86400");
          });

          // Handle OPTIONS preflight requests
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response:",
              proxyRes.statusCode,
              req.method,
              req.url
            );

            // Add CORS headers to response
            proxyRes.headers["Access-Control-Allow-Origin"] = "*";
            proxyRes.headers["Access-Control-Allow-Methods"] =
              "GET, PUT, POST, DELETE, PATCH, OPTIONS";
            proxyRes.headers["Access-Control-Allow-Headers"] =
              "Content-Type, Authorization";
            proxyRes.headers["Access-Control-Max-Age"] = "86400";

            // Handle preflight requests
            if (req.method === "OPTIONS") {
              proxyRes.statusCode = 200;
            }
          });

          // Log errors
          proxy.on("error", (err, _req, _res) => {
            console.error("Proxy Error:", err);
          });
        },
      },
    },
    cors: true,
  },
});
