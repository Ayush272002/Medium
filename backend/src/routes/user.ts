import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinInput, signupInput } from "@ayush272002/medium-common-v3";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const validatedData = signupInput.safeParse(body);
  if (!validatedData.success) {
    c.status(400);
    return c.json({ error: validatedData.error.errors.map((err) => err.message).join(", ") });
  }

  async function hashPassword(password: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Generate a hash using SHA-256
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convert the ArrayBuffer to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  }

  try {
    const hashedPassword = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
      },
    });

    const jwt = await sign(
      { id: user.id, exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 }, //30d
      c.env.JWT_SECRET
    );

    return c.json({
      jwt: jwt,
    });
  } catch (e) {
    c.status(403);
    return c.json({ error: "Error creating user" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ error: "Invalid input" });
  }
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    c.status(403);
    return c.json({ error: "User not found" });
  }

  // Function to hash the provided password and compare it to the stored hash
  async function verifyPassword(storedHash: string, password: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return hashHex === storedHash;
  }

  // Verify the password
  const passwordMatches = await verifyPassword(user.password, body.password);

  if (!passwordMatches) {
    c.status(403);
    return c.json({ error: "Unauthorized" });
  }

  const jwt = await sign(
    { id: user.id, exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 }, //30d
    c.env.JWT_SECRET
  );

  return c.json({ jwt });
});
