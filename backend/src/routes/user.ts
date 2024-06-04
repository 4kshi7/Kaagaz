import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono, Next } from "hono";
import { sign, verify } from "hono/jwt";
import { signinInput, signupInput } from "@akshit2k/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

export async function makeUserAdmin(userId: number, databaseUrl: string) {
  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  }).$extends(withAccelerate());

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: true },
    });
    console.log("User updated:", updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "inputs are not valid",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });
    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );
    return c.text(jwt);
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.text("Invalid");
  }
});

userRouter.post("/signin", async (c) => {
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Invalid credentials",
    });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({ error: "user not found" });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.text(jwt);
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.text("Invalid");
  }
});

userRouter.get(
  "/me",
  async (c, next: Next) => {
    const authHeader = c.req.header("authorization") || "";
    try {
      const user = await verify(authHeader, c.env.JWT_SECRET);
      if (user) {
        c.set("userId", user.id);
        await next();
      } else {
        c.status(403);
        return c.json({
          message: "You are not authorized",
        });
      }
    } catch (e) {
      c.status(403);
      return c.json({
        message: "You are not logged in",
      });
    }
  },
  async (c) => {
    const userId = c.get("userId");

    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
      const userWithPosts = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
        include: {
          posts: true,
        },
      });

      if (!userWithPosts) {
        c.status(404);
        return c.json({ message: "User not found" });
      }

      return c.json(userWithPosts);
    } catch (e) {
      console.log(e);
      c.status(500);
      return c.json({ message: "Internal server error" });
    }
  }
);