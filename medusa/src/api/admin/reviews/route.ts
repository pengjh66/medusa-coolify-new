import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PRODUCT_REVIEW_MODULE } from "../../../modules/product-review";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { product_id, status, offset = 0, limit = 20 } = req.query;

  const productReviewService = req.scope.resolve(PRODUCT_REVIEW_MODULE);

  const filters: any = {};
  if (product_id) filters.product_id = product_id;
  if (status) filters.status = status;

  const [reviews, count] = await productReviewService.listAndCountReviews(filters, {
    skip: Number(offset),
    take: Number(limit),
    order: { created_at: "DESC" },
  });

  res.json({
    reviews,
    count,
    offset: Number(offset),
    limit: Number(limit),
  });
}
