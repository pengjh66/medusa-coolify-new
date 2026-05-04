# Product Review Module

A custom product review module for Medusa 2.0.

## Features

- ✅ Customer product reviews with ratings (1-5 stars)
- ✅ Review moderation (pending, approved, rejected)
- ✅ Review statistics (average rating, rating distribution)
- ✅ Store API for customers to submit and view reviews
- ✅ Admin API for managing reviews

## Database Schema

The module creates a `review` table with the following fields:

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

## API Endpoints

### Store API (Public)

#### Get Product Review Stats
```
GET /store/product-review-stats?product_id={id}&offset=0&limit=10
```
Returns review statistics and approved reviews for a product.

#### List Reviews
```
GET /store/reviews?product_id={id}&status=approved&offset=0&limit=10
```
List reviews for a product.

#### Create Review
```
POST /store/reviews
Body: {
  "product_id": "prod_xxx",
  "rating": 5,
  "title": "Great product!",
  "content": "I love this product...",
  "customer_name": "John Doe",
  "customer_email": "john@example.com"
}
```
Submit a new review (status: pending by default).

### Admin API

#### List All Reviews
```
GET /admin/reviews?product_id={id}&status={status}&offset=0&limit=20
```
List all reviews with optional filters.

#### Get Review by ID
```
GET /admin/reviews/{id}
```
Get a specific review.

#### Update Review Status
```
POST /admin/reviews/{id}
Body: {
  "status": "approved" | "rejected" | "pending"
}
```
Approve, reject, or reset review status.

#### Delete Review
```
DELETE /admin/reviews/{id}
```
Delete a review.

## Setup

The module is already configured in `medusa-config.ts`. To apply the database schema:

1. Run migrations:
   ```bash
   npm run predeploy
   ```

2. Restart the Medusa server:
   ```bash
   npm run dev
   ```

## Usage Example

### Submitting a Review (Frontend)
```javascript
const response = await fetch('http://localhost:9000/store/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    product_id: 'prod_01KQPE1JNJ2DWDYKAMT9M05XZ1',
    rating: 5,
    title: 'Excellent!',
    content: 'This product exceeded my expectations.',
    customer_name: 'Jane Smith',
    customer_email: 'jane@example.com'
  })
});
```

### Getting Review Stats (Frontend)
```javascript
const response = await fetch(
  'http://localhost:9000/store/product-review-stats?product_id=prod_01KQPE1JNJ2DWDYKAMT9M05XZ1'
);
const stats = await response.json();
// stats.average_rating, stats.total_reviews, stats.rating_distribution
```

## Next Steps

- Add email notifications for new reviews
- Add review helpful/unhelpful voting
- Add review replies from store admins
- Add image upload support for reviews
- Add verified purchase validation
