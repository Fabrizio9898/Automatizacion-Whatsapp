// apps/web/app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Exportamos los handlers para GET y POST
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // config: { ... } // Opcional: para debuggear puedes poner loging: "debug"
});
