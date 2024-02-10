import type { NextApiRequest, NextApiResponse } from "next"
import { getRandomColors } from "functions/get-random-colors"

type ResponseData = {
  colors: { hex: string; name: string }[]
}

const handler = (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  const count = parseInt((req.query.count as string | undefined) ?? "10")
  const category = req.query.category as string
  const colors = getRandomColors({ category, count })

  res.status(200).json({ colors })
}

export default handler
