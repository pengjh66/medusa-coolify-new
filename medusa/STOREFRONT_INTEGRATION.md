# Product Review Module - Storefront Integration

## Overview

This implementation creates a custom product review module compatible with the lambda-curry/medusa2-starter storefront, which uses `@lambdacurry/medusa-plugins-sdk`.

## API Endpoints

### Store API (Public)

#### 1. Get Product Review Stats
```
GET /store/product-review-stats?product_id={id}&offset=0&limit=1
```

**Response Format:**
```json
{
  "product_review_stats": [
    {
      "product_id": "prod_xxx",
      "total_reviews": 10,
      "average_rating": 4.5,
      "rating_distribution": {
        "5": 5,
        "4": 3,
        "3": 1,
        "2": 1,
        "1": 0
      }
    }
  ],
  "offset": 0,
  "limit": 1,
  "count": 1
}
```

**Storefront Usage:**
```typescript
const productReviewStats = await fetchProductReviewStats({
  product_id: product.id,
  offset: 0,
  limit: 1,
});
// Access: productReviewStats.product_review_stats[0]
```

#### 2. List Product Reviews
```
GET /store/product-reviews?product_id={id}&status=approved&offset=0&limit=5
```

**Response Format:**
```json
{
  "product_reviews": [
    {
      "id": "review_xxx",
      "product_id": "prod_xxx",
      "rating": 5,
      "title": "Great product!",
      "content": "I love this product...",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "status": "approved",
      "created_at": "2026-05-04T...",
      "updated_at": "2026-05-04T..."
    }
  ],
  "count": 10,
  "offset": 0,
  "limit": 5
}
```

**Storefront Usage:**
```typescript
const productReviews = await fetchProductReviews({
  product_id: product.id,
  fields: 'id,rating,content,name,images.url,created_at,updated_at',
  order: 'created_at',
  status: ['approved'],
  offset: 0,
  limit: 5,
});
// Access: productReviews.product_reviews
```

#### 3. Create Review
```
POST /store/product-reviews
Body: {
  "product_id": "prod_xxx",
  "rating": 5,
  "title": "Great product!",
  "content": "I love this product...",
  "customer_name": "John Doe",
  "customer_email": "john@example.com"
}
```

**Response:**
```json
{
  "review": {
    "id": "review_xxx",
    "product_id": "prod_xxx",
    "rating": 5,
    "status": "pending",
    ...
  }
}
```

### Admin API

#### 1. List All Reviews
```
GET /admin/reviews?product_id={id}&status={status}&offset=0&limit=20
```

#### 2. Get Review by ID
```
GET /admin/reviews/{id}
```

#### 3. Update Review Status
```
POST /admin/reviews/{id}
Body: { "status": "approved" | "rejected" | "pending" }
```

#### 4. Delete Review
```
DELETE /admin/reviews/{id}
```

## Database Schema

The module creates a `review` table with:
- `id` - Primary key
- `product_id` - Product identifier
- `customer_id` - Customer identifier (nullable)
- `customer_name` - Customer name (nullable)
- `customer_email` - Customer email (nullable)
- `rating` - Rating (1-5)
- `title` - Review title (nullable)
- `content` - Review content
- `verified_purchase` - Boolean flag
- `status` - Review status (pending, approved, rejected)
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

## Storefront Integration

The storefront (lambda-curry/medusa2-starter) expects:

1. **Product Detail Page** (`products.$productHandle.tsx`):
   - Fetches review stats via `fetchProductReviewStats()`
   - Fetches approved reviews via `fetchProductReviews()`
   - Displays reviews in `<ProductReviewSection />`

2. **SDK Methods Used**:
   - `sdk.store.productReviews.list()` → `/store/product-reviews`
   - `sdk.store.productReviews.listStats()` → `/store/product-review-stats`
   - `sdk.store.productReviews.upsert()` → `/store/product-reviews` (POST)

## Setup Instructions

1. **Run database migrations**:
   ```bash
   npm run predeploy
   ```

2. **Restart Medusa server**:
   ```bash
   npm run dev
   ```

3. **Verify endpoints**:
   ```bash
   curl "http://localhost:9000/store/product-review-stats?product_id=prod_xxx"
   ```

## Response Format Compatibility

The implementation matches the expected response structure from `@lambdacurry/medusa-plugins-sdk`:

- ✅ `product_review_stats` array wrapper
- ✅ `product_reviews` array wrapper
- ✅ Pagination fields (offset, limit, count)
- ✅ Review status filtering
- ✅ Approved reviews by default

## Next Steps

1. Test the endpoints with actual product IDs from your database
2. Create some test reviews via the POST endpoint
3. Approve reviews via the admin API
4. Verify the storefront displays reviews correctly
