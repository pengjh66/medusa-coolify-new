import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PRODUCT_REVIEW_MODULE } from "../../../modules/product-review";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { product_id, offset = 0, limit = 10, fields, order } = req.query;

  // Handle status as array (status[0]=approved) or single value
  let statusFilter = req.query.status;
  if (Array.isArray(statusFilter)) {
    statusFilter = statusFilter[0];
  } else if (!statusFilter) {
    statusFilter = "approved";
  }

  if (!product_id) {
    return res.status(400).json({
      message: "product_id is required",
    });
  }

  const productReviewService = req.scope.resolve(PRODUCT_REVIEW_MODULE);

  // Build order clause
  const orderClause: any = {};
  if (order === "created_at") {
    orderClause.created_at = "ASC";
  } else {
    orderClause.created_at = "DESC";
  }

  const [reviews, count] = await productReviewService.listAndCountReviews({
    product_id,
    status: statusFilter,
  }, {
    skip: Number(offset),
    take: Number(limit),
    order: orderClause,
  });

  // Format response to match @lambdacurry/medusa-plugins-sdk expected structure
  res.json({
    product_reviews: reviews,
    count,
    offset: Number(offset),
    limit: Number(limit),
  });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { product_id, rating, title, content, customer_name, customer_email } = req.body;

  if (!product_id || !rating || !content) {
    return res.status(400).json({
      message: "product_id, rating, and content are required",
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "rating must be between 1 and 5",
    });
  }

  const productReviewService = req.scope.resolve(PRODUCT_REVIEW_MODULE);

  const review = await productReviewService.createReviews({
    product_id,
    rating: Number(rating),
    title,
    content,
    customer_name,
    customer_email,
    customer_id: req.auth?.actor_id || null,
    verified_purchase: false,
    status: "pending",
  });

  res.status(201).json({ review });
}
