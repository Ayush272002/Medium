import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@ayush272002/medium-common-v3";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const header = c.req.header("Authorization");
  if (!header) {
    return c.json({ error: "unauthorized" }, 403);
  }

  const token = header.split(" ")[1];
  if (!token || header.split(" ")[0] !== "Bearer") {
    return c.json({ error: "unauthorized" }, 403);
  }

  try {
    const res = (await verify(token, c.env.JWT_SECRET)) as { id: string };
    if (!res || !res.id) {
      return c.json({ error: "unauthorized" }, 403);
    }

    c.set("userId", res.id);
    await next();
  } catch (err) {
    return c.json({ error: "unauthorized" }, 403);
  }
});

blogRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);

    if (!success) {
      return c.json({ error: "Invalid input" }, 411);
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(c.get("userId")),
      },
    });

    return c.json({
      id: blog.id,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

blogRouter.put("/", async (c) => {
  try {
    const body = await c.req.json();
    const { success, error } = updateBlogInput.safeParse(body);

    if (!success) {
      console.error("Validation Error:", error);
      return c.json({ error: "Invalid input" }, 411);
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({
      id: blog.id,
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Todo: Add pagination
blogRouter.get("/bulk", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogs = await prisma.post.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return c.json({ blogs });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

blogRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    return c.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});
