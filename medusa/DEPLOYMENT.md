# Product Review Module - Deployment Guide

## Current Status

✅ All files created and in place:
- Module: `src/modules/product-review/`
- Store API: `src/api/store/product-reviews/route.ts`
- Store API: `src/api/store/product-review-stats/route.ts`
- Admin API: `src/api/admin/reviews/`
- Config: Module registered in `medusa-config.ts`

❌ Server needs rebuild/restart to load new routes

## Deployment Steps (Coolify/Docker)

### Option 1: Via Coolify Dashboard (Recommended)

1. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "Add product review module"
   git push
   ```

2. **Trigger rebuild in Coolify**:
   - Go to your Coolify dashboard
   - Find your Medusa application
   - Click "Redeploy" or "Rebuild"
   - Wait for the build to complete

3. **Run migrations** (if Coolify doesn't auto-run):
   - In Coolify, open the application terminal
   - Run: `npm run predeploy`

### Option 2: Manual Docker Rebuild

If you have direct Docker access:

```bash
# Rebuild the container
docker-compose build medusa

# Run migrations
docker-compose run medusa npm run predeploy

# Restart the service
docker-compose up -d medusa
```

### Option 3: Local Development (if applicable)

If you're testing locally first:

```bash
# Install dependencies (if needed)
npm install

# Run migrations
npm run predeploy

# Start dev server
npm run dev
```

## Verification

After deployment, test the endpoints:

```bash
# Test review stats endpoint
curl "https://your-domain.com/store/product-review-stats?product_id=prod_01KQPE1JNJ2DWDYKAMT9M05XZ1&offset=0&limit=1"

# Expected response:
{
  "product_review_stats": [
    {
      "product_id": "prod_01KQPE1JNJ2DWDYKAMT9M05XZ1",
      "total_reviews": 0,
      "average_rating": 0,
      "rating_distribution": { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 }
    }
  ],
  "offset": 0,
  "limit": 1,
  "count": 1
}
```

```bash
# Test reviews list endpoint
curl "https://your-domain.com/store/product-reviews?product_id=prod_01KQPE1JNJ2DWDYKAMT9M05XZ1&status[0]=approved&offset=0&limit=5"

# Expected response:
{
  "product_reviews": [],
  "count": 0,
  "offset": 0,
  "limit": 5
}
```

## Troubleshooting

### Still getting 404?

1. **Check if routes are loaded**:
   ```bash
   # In container/server
   ls -la src/api/store/product-reviews/
   ls -la src/api/store/product-review-stats/
   ```

2. **Check Medusa logs**:
   - Look for "Registering custom API routes" or similar
   - Check for any module loading errors

3. **Verify module is registered**:
   ```bash
   cat medusa-config.ts | grep product-review
   ```

### Database errors?

If you see database errors after deployment:

```bash
# Run migrations manually
npm run predeploy

# Or in Docker
docker-compose exec medusa npm run predeploy
```

### Module not found errors?

If you see "Cannot resolve PRODUCT_REVIEW_MODULE":

1. Check that `src/modules/product-review/index.ts` exists
2. Verify the module is listed in `medusa-config.ts`
3. Rebuild the application

## Next Steps After Successful Deployment

1. **Create test reviews** via API:
   ```bash
   curl -X POST https://your-domain.com/store/product-reviews \
     -H "Content-Type: application/json" \
     -d '{
       "product_id": "prod_01KQPE1JNJ2DWDYKAMT9M05XZ1",
       "rating": 5,
       "title": "Great product!",
       "content": "Love it!",
       "customer_name": "Test User",
       "customer_email": "test@example.com"
     }'
   ```

2. **Approve reviews** via Admin API:
   ```bash
   curl -X POST https://your-domain.com/admin/reviews/{review_id} \
     -H "Content-Type: application/json" \
     -d '{"status": "approved"}'
   ```

3. **Verify storefront** displays reviews correctly

## Files Changed

- `medusa-config.ts` - Added product-review module
- `src/modules/product-review/` - New module (4 files)
- `src/api/store/product-reviews/route.ts` - New endpoint
- `src/api/store/product-review-stats/route.ts` - New endpoint
- `src/api/admin/reviews/` - New admin endpoints (2 files)
