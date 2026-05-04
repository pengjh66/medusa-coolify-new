import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PRODUCT_REVIEW_MODULE } from "../../../../modules/product-review";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params;

  const productReviewService = req.scope.resolve(PRODUCT_REVIEW_MODULE);

  const review = await productReviewService.retrieveReview(id);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  res.json({ review });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({
      message: "status must be one of: pending, approved, rejected",
    });
  }

  const productReviewService = req.scope.resolve(PRODUCT_REVIEW_MODULE);

  const review = await productReviewService.updateReviews(id, {
    status,
    updated_at: new Date(),
  });

  res.json({ review });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params;

  const productReviewService = req.scope.resolve(PRODUCT_REVIEW_MODULE);

  await productReviewService.deleteReviews(id);

  res.status(200).json({ id, deleted: true });
}
