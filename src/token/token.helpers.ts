import * as jwt from "jsonwebtoken";

export function createNewPairToken(userId: string) {
  let accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "1d"
    }
  );

  let refreshCount = 0;

  let refreshToken = jwt.sign(
    { userId, refreshCount },
    process.env.JWT_REFRESH_TOKEN_SECRET as string,
    { expiresIn: "14d" }
  );

  return { accessToken, refreshToken };
}

export function createRefreshPairToken(token: string) {
  let { userId, refreshCount } = jwt.verify(
    token,
    process.env.JWT_REFRESH_TOKEN_SECRET as string
  ) as any;

  let accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "1d"
    }
  );

  let refreshToken = jwt.sign(
    { userId, refreshCount },
    process.env.JWT_REFRESH_TOKEN_SECRET as string,
    { expiresIn: "14d" }
  );

  return { accessToken, refreshToken };
}
