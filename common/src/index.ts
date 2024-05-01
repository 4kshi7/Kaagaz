import z from "zod";

export const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export type SignupInput = z.infer<typeof signupInput>;

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SigninInput = z.infer<typeof signinInput>;

export const createPostInput = z.object({
  title: z.string(),
  content: z.string(),
});

export type CreatePostInput = z.infer<typeof createPostInput>;

export const updatePostInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export type UpdatePostInput = z.infer<typeof updatePostInput>;

export const createCommentInput = z.object({
  content: z.string().min(1).max(255),
});
export type CreateCommentInputType = z.infer<typeof createCommentInput>;

export const updateCommentInput = z.object({
  content: z.string().min(1).max(255),
});

export type UpdateCommentInputType = z.infer<typeof updateCommentInput>;


