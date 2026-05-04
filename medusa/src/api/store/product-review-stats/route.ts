import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { product_id, offset = 0, limit = 10 } = req.query;

  if (!product_id) {
    return res.status(400).json({
      message: "product_id is required",
    });
  }

  try {
    const { PRODUCT_REVIEW_MODULE } = await import("../../../modules/product-review");
    const productReviewService = req.scope.resolve(PRODUCT_REVIEW_MODULE);

    // Get approved reviews for the product
    const [reviews, count] = await productReviewService.listAndCountReviews({
      product_id,
      status: "approved",
    }, {
      skip: Number(offset),
      take: Number(limit),
      order: { created_at: "DESC" },
    });

    // Calculate statistics
    let totalRating = 0;
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((review: any) => {
      totalRating += review.rating;
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });

    const averageRating = count > 0 ? totalRating / count : 0;

    // Format response to match @lambdacurry/medusa-plugins-sdk expected structure
    res.json({
      product_review_stats: [
        {
          product_id,
          total_reviews: count,
          average_rating: Number(averageRating.toFixed(2)),
          rating_distribution: ratingDistribution,
        }
      ],
      offset: Number(offset),
      limit: Number(limit),
      count: 1,
    });
  } catch (error) {
    // If module not loaded yet, return empty stats
    console.error("Product review module error:", error);
    res.json({
      product_review_stats: [
        {
          product_id,
          total_reviews: 0,
          average_rating: 0,
          rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        }
      ],
      offset: Number(offset),
      limit: Number(limit),
      count: 1,
    });
  }
}
