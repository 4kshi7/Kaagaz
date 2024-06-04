import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import {
  createPostInput,
  updatePostInput,
  createCommentInput,
  updateCommentInput,
} from "@akshit2k/medium-common";
import { generateArticle } from "../generateAI";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    GROQ_API_KEY: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
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
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = createPostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      imgUrl: body.imgUrl,
      authorId: Number(userId),
    },
  });

  return c.json({
    id: post.id,
  });
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const { success } = updatePostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await c.req.json();
  prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
      imgUrl: body.imgUrl,
    },
  });

  return c.json({
    post,
  });
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const post = await prisma.post.findMany({
    select: {
      content: true,
      title: true,
      id: true,
      publishedDate: true,
      imgUrl: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  return c.json({
    post,
  });
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        title: true,
        content: true,
        publishedDate: true,
        imgUrl: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return c.json({
      post,
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Error while fetching blog post",
    });
  }
});

blogRouter.post("/gen", async (c) => {
  try {
    if (!c.env.GROQ_API_KEY) {
      return c.json({
        title: "",
        article: "This feature is disabled.",
      });
    }
    const body = await c.req.json();
    const title = body.title;
    const response = await generateArticle(title, "groq", c.env.GROQ_API_KEY);
    return c.json({
      title: title,
      article: response,
    });
  } catch (err) {
    c.status(403);
    return c.json({ error: `Something went wrong : ${err}` });
  }
});

// Create a new comment for a post
blogRouter.post("/:postId/comments", async (c) => {
  const postId = c.req.param("postId");
  const body = await c.req.json();
  const result = createCommentInput.safeParse(body); // Assuming you have a safeParse function for input validation
  if (!result.success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }
  const { content } = result.data;
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const comment = await prisma.comment.create({
      data: {
        postId: Number(postId),
        userId: Number(userId),
        content: content,
      },
    });
    return c.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    c.status(500);
    return c.json({ error: "Error creating comment" });
  }
});

// Get all comments for a post
blogRouter.get("/:postId/comments", async (c) => {
  const postId = c.req.param("postId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: Number(postId),
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });
    return c.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    c.status(500);
    return c.json({ error: "Error fetching comments" });
  }
});

// Update a comment
blogRouter.put("/:postId/comments/:commentId", async (c) => {
  const postId = c.req.param("postId");
  const commentId = c.req.param("commentId");
  const body = await c.req.json();
  const result = updateCommentInput.safeParse(body);
  if (!result.success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: Number(commentId),
      },
      data: {
        content: result.data.content, // Access the content directly from result.data
      },
    });
    return c.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    c.status(500);
    return c.json({ error: "Error updating comment" });
  }
});

blogRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      select: { authorId: true },
    });

    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }
    const isAdmin = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { isAdmin: true },
    });

    const isAuthorized =
      post.authorId === Number(userId) || (isAdmin?.isAdmin || false);

    if (!isAuthorized) {
      return c.json({ error: "You are not authorized to delete this post" }, 403);
    }

    await prisma.comment.deleteMany({
      where: { postId: Number(id) },
    });

    await prisma.post.delete({
      where: { id: Number(id) },
    });

    return c.json({ message: "Blog post deleted successfully" });
  } catch (e) {
    console.error("Error deleting blog post:", e);
    c.status(500);
    return c.json({ error: "Error deleting blog post" });
  } finally {
    await prisma.$disconnect();
  }
});

// Like a post
blogRouter.post("/:postId/likes", async (c) => {
  const postId = c.req.param("postId");
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Check if the user already liked the post
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: Number(postId),
        userId: Number(userId),
      },
    });

    if (existingLike) {
      // User already liked the post, delete the like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return c.json({ message: "Post unliked successfully" });
    } else {
      // User hasn't liked the post yet, create a new like entry
      const like = await prisma.like.create({
        data: {
          postId: Number(postId),
          userId: Number(userId),
        },
      });
      return c.json(like);
    }
  } catch (error) {
    console.error("Error liking post:", error);
    c.status(500);
    return c.json({ error: "Error liking post" });
  }
});

// Get users who liked a post
blogRouter.get("/:postId/likes", async (c) => {
  const postId = c.req.param("postId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const likes = await prisma.like.findMany({
      where: {
        postId: Number(postId),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true, // Assuming you want to include user's name
          },
        },
      },
    });
    return c.json(likes);
  } catch (error) {
    console.error("Error fetching likes:", error);
    c.status(500);
    return c.json({ error: "Error fetching likes" });
  }
});


