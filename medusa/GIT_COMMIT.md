# Git Commit Checklist

## Files to Commit

Run these commands to commit all the product review module files:

```bash
# Check what files were added/modified
git status

# Add all product review module files
git add src/modules/product-review/
git add src/api/store/product-reviews/
git add src/api/store/product-review-stats/
git add src/api/admin/reviews/
git add medusa-config.ts
git add DEPLOYMENT.md
git add STOREFRONT_INTEGRATION.md
git add test-reviews.sh

# Commit with descriptive message
git commit -m "Add product review module with store and admin APIs

- Created product-review module with Review model
- Added store API endpoints for reviews and stats
- Added admin API endpoints for review moderation
- Updated medusa-config.ts to register module
- Compatible with @lambdacurry/medusa-plugins-sdk
- Fixes 404 errors on /store/product-review-stats and /store/product-reviews"

# Push to trigger Coolify rebuild
git push origin main
```

## After Push

1. **Go to Coolify Dashboard**
2. **Find your Medusa application**
3. **Click "Redeploy" or wait for auto-deploy**
4. **Monitor the build logs** for any errors
5. **Wait for deployment to complete** (usually 2-5 minutes)

## Verify Deployment

Once deployed, test the endpoints:

```bash
# Replace with your actual domain
DOMAIN="your-medusa-domain.com"

# Test review stats (should return 200 with empty stats)
curl "https://${DOMAIN}/store/product-review-stats?product_id=prod_01KQPE1JNJ2DWDYKAMT9M05XZ1&offset=0&limit=1"

# Test reviews list (should return 200 with empty array)
curl "https://${DOMAIN}/store/product-reviews?product_id=prod_01KQPE1JNJ2DWDYKAMT9M05XZ1&status[0]=approved&offset=0&limit=5"
```

## Expected Results

Both endpoints should return **200 OK** (not 404) with JSON responses:

**Review Stats Response:**
```json
{
  "product_review_stats": [{
    "product_id": "prod_01KQPE1JNJ2DWDYKAMT9M05XZ1",
    "total_reviews": 0,
    "average_rating": 0,
    "rating_distribution": {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}
  }],
  "offset": 0,
  "limit": 1,
  "count": 1
}
```

**Reviews List Response:**
```json
{
  "product_reviews": [],
  "count": 0,
  "offset": 0,
  "limit": 5
}
```

## Storefront Should Now Work

After successful deployment:
- ✅ Product detail pages will load without 404 errors
- ✅ Review section will display (empty initially)
- ✅ Customers can submit reviews
- ✅ Admins can moderate reviews

## If Still Getting 404

1. Check Coolify build logs for errors
2. Verify the deployment completed successfully
3. Check if migrations ran (look for "review" table in database)
4. SSH into container and verify files exist:
   ```bash
   ls -la /app/medusa/.medusa/server/src/api/store/
   ```
