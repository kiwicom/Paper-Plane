import { NextApiRequest, NextApiResponse } from "next";

export default function initMiddleware(
  middleware: (
    req: NextApiRequest,
    res: NextApiResponse<unknown>,
    result: (result: unknown) => void
  ) => void
) {
  return (
    req: NextApiRequest,
    res: NextApiResponse<unknown>
  ): Promise<unknown> =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: unknown) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}
