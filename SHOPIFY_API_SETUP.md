# Shopify API Setup Guide - Quick Start

Since you already have a Shopify store, follow these steps to get your API credentials and start testing implementation.

---

## Step 1: Get Your Shopify API Credentials

### A. Access Shopify Admin
1. Log into your Shopify store admin panel
2. Click **Settings** in the bottom left corner

### B. Create Custom App for API Access
1. In Settings, click **Apps and sales channels** (left sidebar)
2. Click **Develop apps** button (top right)
3. If this is your first time, you may see a prompt to **Allow custom app development** - click it and confirm
4. Click **Create an app** button

### C. Name Your App
1. App name: `Hydrogen Storefront`
2. App developer: Select yourself or your team
3. Click **Create app**

### D. Configure Storefront API Scopes
1. You'll see two tabs: "Admin API" and "Storefront API"
2. Click **Configure Storefront API scopes**
3. Scroll through the permissions list and check these boxes:

   ✅ **Required scopes:**
   - `unauthenticated_read_product_listings` - Read product data
   - `unauthenticated_read_product_inventory` - Read inventory levels
   - `unauthenticated_write_checkouts` - Create checkouts
   - `unauthenticated_read_checkouts` - Read checkout data
   - `unauthenticated_read_customer_tags` - Read customer tags
   - `unauthenticated_read_content` - Read metafields

4. Click **Save** button at the top

### E. Install the App
1. Click **Install app** button (top right)
2. A confirmation popup will appear - click **Install**

### F. Get Your API Token
1. After installation, you'll be on the **API credentials** tab
2. Under **Storefront API access token** section, you'll see:
   - A masked token
   - A button that says **Reveal token once**
3. **IMPORTANT:** Click **Reveal token once**
4. **COPY THE TOKEN IMMEDIATELY** - you can only see it once!
   - It will look like: `shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Save it somewhere safe (we'll use it in a moment)

### G. Find Your Store Domain
Your store domain is in the format: `your-store-name.myshopify.com`

**How to find it:**
- Look at your browser URL when logged into Shopify admin
- If your admin URL is: `admin.shopify.com/store/my-yeezy-shop`
- Your store domain is: `my-yeezy-shop.myshopify.com`

---

## Step 2: Save Your Credentials

Create a text file on your desktop to temporarily save these values:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHOPIFY API CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Store Domain: [your-store].myshopify.com

Storefront API Token: shpat_[your-token-here]

API Version: 2024-10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Fill in:**
- `[your-store]` with your actual store name
- `[your-token-here]` with the token you copied

---

## Step 3: Verify API Access (Optional Test)

You can test your API credentials immediately using this curl command:

```bash
curl -X POST \
  https://[your-store].myshopify.com/api/2024-10/graphql.json \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: shpat_[your-token]" \
  -d '{
    "query": "{
      shop {
        name
        description
      }
    }"
  }'
```

**Replace:**
- `[your-store]` with your store name
- `[your-token]` with your API token

**Expected response:**
```json
{
  "data": {
    "shop": {
      "name": "Your Store Name",
      "description": "Your store description"
    }
  }
}
```

If you see this, your API is working! ✅

---

## Step 4: Prepare Your Store for Development

### A. Create Test Collections (Categories)

You'll need 5 collections for your product categories:

1. **Go to Products → Collections**
2. Click **Create collection** (top right)

**Create these 5 collections:**

| Collection Name | Handle | Type |
|----------------|---------|------|
| New | `new` | Manual or Automated |
| Mens | `mens` | Manual |
| Womens | `womens` | Manual |
| Slides | `slides` | Manual |
| Accessories | `accessories` | Manual |

**For each collection:**
1. Enter the collection name
2. The "Handle" will auto-generate (make sure it matches the table)
3. Choose "Manual" for collection type (easier for now)
4. Click **Save**

### B. Create Custom Metafield for Product Codes

This allows you to display product codes like "JC-07" on your storefront:

1. **Go to Settings → Custom data**
2. Click **Products**
3. Click **Add definition** button
4. Fill in:
   - **Name:** `Product Code`
   - **Namespace and key:** `custom.product_code`
   - **Description:** "Display SKU/product code on storefront"
   - **Type:** Select "Single line text"
   - **Storefront access:** ✅ Check this box (IMPORTANT!)
5. Click **Save**

---

## Step 5: Add a Test Product

Before bulk importing all products, let's add one manually to test:

### Create Test Product: "Black Puffer Jacket"

1. **Go to Products → Add product**

2. **Product Details:**
   - **Title:** `Black Puffer Jacket`
   - **Description:** `Premium black puffer jacket with quilted design and thermal insulation.`

3. **Media:**
   - Click **Add media**
   - Upload images from your `/public/products/` folder:
     - `black-puffer-jacket-1.jpg`
     - `black-puffer-jacket-2.jpg`

4. **Pricing:**
   - **Price:** `200`
   - Leave "Compare at price" empty

5. **Inventory:**
   - Check ✅ **Track quantity**
   - Keep quantity empty for now (we'll set per variant)

6. **Shipping:**
   - Check ✅ **This is a physical product**
   - Weight: `1` kg (or estimate)

7. **Variants:**
   - Click **Add options like size or color**
   - **Option name:** `Size`
   - **Option values:** Type each size and press Enter:
     ```
     XS
     S
     M
     L
     XL
     XXL
     ```
   - Click **Done**

8. **Edit Each Variant:**
   - Click on a variant to expand it
   - Set for each:
     - **SKU:** `JC-07-XS`, `JC-07-S`, `JC-07-M`, etc.
     - **Price:** `200` (same for all)
     - **Available quantity:** `10` (or `0` for out of stock sizes)
   - Repeat for all 6 variants

9. **Product Organization:**
   - **Product type:** `Apparel`
   - **Vendor:** Your brand name (optional)
   - **Collections:** Click and select `Mens`
   - **Tags:** `featured` (if it's a featured product)

10. **Search Engine Listing:**
    - **URL handle:** Should auto-fill as `black-puffer-jacket` (matches your slug!)
    - Leave as is

11. **Custom Fields (Metafield):**
    - Scroll down to **Metafields** section
    - Find **Product Code** field
    - Enter: `JC-07`

12. **Click Save** (top right)

### Verify Your Test Product

1. Click **View** next to the product title
2. You should see the product on your online store
3. Verify all sizes show up
4. Note the URL - should be: `your-store.myshopify.com/products/black-puffer-jacket`

---

## Step 6: Test API with Real Data

Now test fetching your product via the API:

```bash
curl -X POST \
  https://[your-store].myshopify.com/api/2024-10/graphql.json \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: shpat_[your-token]" \
  -d '{
    "query": "{ product(handle: \"black-puffer-jacket\") { id title handle priceRange { minVariantPrice { amount currencyCode } } variants(first: 10) { nodes { id title sku availableForSale selectedOptions { name value } } } metafield(namespace: \"custom\", key: \"product_code\") { value } } }"
  }'
```

**Expected response:**
```json
{
  "data": {
    "product": {
      "id": "gid://shopify/Product/1234567890",
      "title": "Black Puffer Jacket",
      "handle": "black-puffer-jacket",
      "priceRange": {
        "minVariantPrice": {
          "amount": "200.0",
          "currencyCode": "USD"
        }
      },
      "variants": {
        "nodes": [
          {
            "id": "gid://shopify/ProductVariant/...",
            "title": "XS",
            "sku": "JC-07-XS",
            "availableForSale": true,
            "selectedOptions": [
              {"name": "Size", "value": "XS"}
            ]
          },
          ...
        ]
      },
      "metafield": {
        "value": "JC-07"
      }
    }
  }
}
```

If you see this, everything is working! ✅

---

## Step 7: Ready for Implementation

You now have:
- ✅ Storefront API access token
- ✅ Store domain
- ✅ 5 collections created
- ✅ Custom metafield configured
- ✅ Test product with variants
- ✅ Verified API access

### Your credentials summary:

```env
PUBLIC_STORE_DOMAIN=[your-store].myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=shpat_[your-token]
PUBLIC_STOREFRONT_API_VERSION=2024-10
```

---

## Next Steps - Start Implementation

You can now proceed to:

1. **Phase 2** in the main migration guide: Initialize Hydrogen project
2. Create `.env` file with your credentials
3. Test connecting to Shopify from your Hydrogen app

### Create Your First Test

In your NEW Hydrogen project (after you create it):

1. Create `.env` file:
```env
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=shpat_your_token_here
PUBLIC_STOREFRONT_API_VERSION=2024-10
SESSION_SECRET=your-random-secret-here
```

2. Follow **Phase 3** in `SHOPIFY_MIGRATION_GUIDE.md` to create GraphQL queries

3. Create the test route from Step 3.5 to verify connection

---

## Troubleshooting

### Can't find "Develop apps"
- Make sure you're a store owner or have "Develop apps" permission
- If using a Partner development store, this should be available

### "Access token is invalid" error
- Make sure you copied the full token including `shpat_` prefix
- Token must match exactly (case-sensitive)
- Verify app is installed (should show as installed in Apps section)

### Products not showing in API
- Verify product is Published (not Draft)
- Check product is available to "Online Store" sales channel
- Ensure collections have products assigned

### Metafield not showing
- Verify "Storefront access" is enabled for the metafield definition
- Metafield must have a value saved for the product
- Namespace must be exactly `custom` and key `product_code`

---

## Important Notes

**Security:**
- ✅ Never commit your API token to git
- ✅ Add `.env` to `.gitignore`
- ✅ Use different tokens for dev and production
- ✅ Regenerate tokens if exposed

**API Rate Limits:**
- Storefront API: 100 requests per second
- If you hit limits, implement caching/throttling

**API Version:**
- Using `2024-10` (October 2024)
- Shopify releases new versions quarterly
- Versions are supported for 12 months

---

## You're Ready to Build! 🚀

You now have everything you need to start implementing your Shopify Hydrogen store. Proceed to the main `SHOPIFY_MIGRATION_GUIDE.md` and start with **Phase 2: Initialize Hydrogen Project**.

If you encounter any issues with these setup steps, refer to the Troubleshooting section or Shopify's official documentation:
- [Storefront API Setup](https://shopify.dev/docs/api/storefront)
- [Creating Custom Apps](https://help.shopify.com/en/manual/apps/app-types/custom-apps)
