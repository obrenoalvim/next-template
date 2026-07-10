import swaggerJSDoc from "swagger-jsdoc";

export function getOpenApiSpec() {
  return swaggerJSDoc({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "next-template API",
        version: "1.0.0",
        description:
          "Custom app routes. Auth routes (better-auth) are documented separately at /api/auth/reference.",
      },
      components: {
        securitySchemes: {
          sessionCookie: {
            type: "apiKey",
            in: "cookie",
            name: "better-auth.session_token",
          },
        },
      },
    },
    apis: ["src/app/api/**/route.ts"],
  });
}
