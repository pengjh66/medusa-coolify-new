import { model } from "@medusajs/framework/utils";

const Review = model.define("review", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  customer_id: model.text().nullable(),
  customer_name: model.text().nullable(),
  customer_email: model.text().nullable(),
  rating: model.number(),
  title: model.text().nullable(),
  content: model.text(),
  verified_purchase: model.boolean().default(false),
  status: model.enum(["pending", "approved", "rejected"]).default("pending"),
  created_at: model.dateTime().default("now"),
  updated_at: model.dateTime().default("now"),
});

export default Review;
