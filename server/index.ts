import "isomorphic-fetch";
import Koa from "koa";
import logger from "winston";
import session from "koa-session";
import next from "next";
import myconfig from "dotenv";
import shopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";

myconfig.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT as string, 10) || 3000;

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY as string;
const SHOPIFY_API_SECRET_KEY = process.env.SHOPIFY_API_SECRET_KEY as string;

const server = new Koa();
server.keys = [SHOPIFY_API_SECRET_KEY];
logger.info(SHOPIFY_API_KEY);
logger.info(SHOPIFY_API_SECRET_KEY);
logger.info("my secrets");
app.prepare().then(() => {
  const server = new Koa();
  server.keys = [SHOPIFY_API_SECRET_KEY];
  // sets up secure session data on each request
  server
    .use(session(server))

    // sets up shopify auth
    .use(
      shopifyAuth({
        apiKey: SHOPIFY_API_KEY,
        secret: SHOPIFY_API_SECRET_KEY,
        scopes: ["write_orders, write_products"],
        afterAuth(ctx: any) {
          if (!ctx.session) {
            logger.error("There needs to");
            throw new Error("No session exists after auth, ending request");
          }
          const { accessToken } = ctx.session;

          console.log("We did it!", accessToken);

          ctx.redirect("/");
        }
      })
    )
    // everything after this point will require authentication
    .use(verifyRequest())

    .use(async (ctx: any) => {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
      ctx.res.statusCode = 200;
      return;
    });
  server.listen(port, () => {
    logger.info(`Serving content on port ${port}`);
  });
});

export default app;
