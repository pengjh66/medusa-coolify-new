#!/bin/bash

# Test script for product review endpoints
# Usage: ./test-reviews.sh <product_id>

PRODUCT_ID=${1:-"prod_01KQPE1JNJ2DWDYKAMT9M05XZ1"}
BASE_URL="http://localhost:9000"

echo "Testing Product Review Endpoints"
echo "================================="
echo ""

echo "1. Testing GET /store/product-review-stats"
echo "-------------------------------------------"
curl -s "${BASE_URL}/store/product-review-stats?product_id=${PRODUCT_ID}&offset=0&limit=1" | jq .
echo ""

echo "2. Testing GET /store/product-reviews"
echo "--------------------------------------"
curl -s "${BASE_URL}/store/product-reviews?product_id=${PRODUCT_ID}&status=approved&offset=0&limit=5" | jq .
echo ""

echo "3. Testing POST /store/product-reviews (Create Review)"
echo "-------------------------------------------------------"
curl -s -X POST "${BASE_URL}/store/product-reviews" \
  -H "Content-Type: application/json" \
  -d "{
    \"product_id\": \"${PRODUCT_ID}\",
    \"rating\": 5,
    \"title\": \"Test Review\",
    \"content\": \"This is a test review from the API\",
    \"customer_name\": \"Test User\",
    \"customer_email\": \"test@example.com\"
  }" | jq .
echo ""

echo "4. Testing GET /admin/reviews (List All)"
echo "-----------------------------------------"
curl -s "${BASE_URL}/admin/reviews?offset=0&limit=10" | jq .
echo ""

echo "Tests completed!"
