# Shopify Hydrogen Migration - Complete Implementation Guide

This guide provides detailed, step-by-step instructions for each phase of migrating your standalone Next.js e-commerce app to Shopify Hydrogen.

---

## Table of Contents
1. [Phase 1: Shopify Store Setup](#phase-1-shopify-store-setup)
2. [Phase 2: Initialize Hydrogen Project](#phase-2-initialize-hydrogen-project)
3. [Phase 3: Data Layer - Shopify Storefront API](#phase-3-data-layer---shopify-storefront-api)
4. [Phase 4: Routing Migration](#phase-4-routing-migration)
5. [Phase 5: Cart Integration](#phase-5-cart-integration)
6. [Phase 6: Component Migration](#phase-6-component-migration)
7. [Phase 7: Filtering & Search](#phase-7-filtering--search)
8. [Phase 8: Checkout Integration](#phase-8-checkout-integration)
9. [Phase 9: Testing & Validation](#phase-9-testing--validation)
10. [Phase 10: Deployment](#phase-10-deployment)

---

## Phase 1: Shopify Store Setup

### Step 1.1: Get Shopify Store API Access

Since you already have a Shopify store, follow these steps to get your API credentials:

#### A. Access Your Shopify Admin
1. Log into your Shopify store admin panel
2. Navigate to **Settings** (bottom left of admin panel)

#### B. Create a Custom App for Storefront API
1. In Settings, click **Apps and sales channels**
2. Click **Develop apps** (top right)
3. If prompted, click **Allow custom app development**
4. Click **Create an app**
5. Name it: `Hydrogen Storefront`
6. Click **Create app**

#### C. Configure API Scopes
1. Click **Configure Storefront API scopes**
2. Enable these scopes:
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_product_inventory`
   - ✅ `unauthenticated_write_checkouts`
   - ✅ `unauthenticated_read_checkouts`
   - ✅ `unauthenticated_read_customer_tags`
   - ✅ `unauthenticated_read_content`
3. Click **Save**

#### D. Install the App & Get API Token
1. Click **Install app** (top right)
2. Confirm installation
3. Click **API credentials** tab
4. Under **Storefront API access token**, click **Reveal token once**
5. **COPY THIS TOKEN IMMEDIATELY** (you can only see it once)

#### E. Get Your Store Domain
Your store domain is: `your-store-name.myshopify.com`
- Find it in your Shopify admin URL
- Example: If your admin is at `admin.shopify.com/store/my-yeezy-store`, your domain is `my-yeezy-store.myshopify.com`

#### F. Save These Credentials
Create a temporary file to save:
```
Store Domain: your-store.myshopify.com
Storefront API Token: shpat_xxxxxxxxxxxxxxxxxxxxx
API Version: 2024-10
```

---

### Step 1.2: Create Collections (Categories)

#### Create 5 Collections for Your Product Categories:

1. **Go to Products → Collections** in Shopify Admin
2. Click **Create collection**

**Collection 1: New**
- Title: `New`
- Handle: `new` (auto-generated)
- Collection type: Choose **Manual** or **Automated**
  - If Automated: Add condition "Product tag equals `new`"
- Click **Save**

**Collection 2: Mens**
- Title: `Mens`
- Handle: `mens`
- Collection type: **Manual**
- Click **Save**

**Collection 3: Womens**
- Title: `Womens`
- Handle: `womens`
- Collection type: **Manual**
- Click **Save**

**Collection 4: Slides**
- Title: `Slides`
- Handle: `slides`
- Collection type: **Manual**
- Click **Save**

**Collection 5: Accessories**
- Title: `Accessories`
- Handle: `accessories`
- Collection type: **Manual**
- Click **Save**

---

### Step 1.3: Create Custom Metafield for Product Code

To display product codes (like "JC-07") on your storefront:

1. Go to **Settings → Custom data**
2. Click **Products**
3. Click **Add definition**
4. Configure:
   - **Name**: `Product Code`
   - **Namespace and key**: `custom.product_code`
   - **Type**: Single line text
   - **Storefront access**: ✅ Enable
5. Click **Save**

---

### Step 1.4: Add Your First Test Product

Before bulk importing, let's add one product manually to understand the structure:

#### Example: Black Puffer Jacket

1. **Go to Products → Add product**

2. **Basic Information:**
   - Title: `Black Puffer Jacket`
   - Description: `Premium black puffer jacket with quilted design`

3. **Media:**
   - Upload images from `/public/products/black-puffer-jacket-1.jpg` and `...-2.jpg`

4. **Pricing:**
   - Price: `200`
   - Compare at price: (leave blank)
   - Cost per item: (optional)

5. **Inventory:**
   - SKU: Leave blank for now (will be set per variant)
   - Track quantity: ✅ Check this

6. **Variants:**
   - Click **Add variant**
   - Option name: `Size`
   - Option values: Add each size on a new line:
     ```
     XS
     S
     M
     L
     XL
     XXL
     ```
   - Click **Done**

7. **Set Variant Details:**
   - For each variant, click to edit:
     - SKU: `JC-07-XS`, `JC-07-S`, etc.
     - Price: `200` (same for all)
     - Available: Set quantity (e.g., 10 for available, 0 for out of stock)
   - Click **Save**

8. **Product Organization:**
   - Product type: `Apparel`
   - Collections: Select `Mens`
   - Tags: `featured` (if it's featured)

9. **Search Engine Listing:**
   - URL handle: `black-puffer-jacket` (auto-generated, matches your slug)

10. **Custom Fields (Metafield):**
    - Scroll down to **Metafields**
    - Find **Product Code**
    - Enter: `JC-07`

11. **Click Save**

---

### Step 1.5: Prepare Bulk Product Import

#### Option A: CSV Import (Recommended for 38 products)

1. **Download sample CSV:**
   - Go to Products → Import
   - Download Shopify's sample CSV to see format

2. **Create your CSV file** with this structure:

```csv
Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Included / United States,Price / United States,Compare At Price / United States,Included / International,Price / International,Compare At Price / International,Status,Metafield: custom.product_code [single_line_text_field]
black-puffer-jacket,Black Puffer Jacket,Premium black puffer jacket with quilted design,,Apparel,Apparel,featured,true,Size,XS,,,,,JC-07-XS,0,shopify,deny,manual,200,,true,true,,https://cdn.shopify.com/...,1,Black Puffer Jacket,false,,,,,,,,,,,,,,,,,,,,,,,active,JC-07
black-puffer-jacket,Black Puffer Jacket,,,Apparel,Apparel,featured,true,Size,S,,,,,JC-07-S,0,shopify,deny,manual,200,,true,true,,,2,,false,,,,,,,,,,,,,,,,,,,,,,,active,JC-07
```

**Key fields:**
- **Handle**: Your product slug (e.g., `black-puffer-jacket`)
- **Title**: Product name
- **Body (HTML)**: Description
- **Type**: Product type (Apparel, Slides, Accessories)
- **Tags**: Comma-separated (e.g., `featured`)
- **Option1 Name**: `Size`
- **Option1 Value**: Size value (XS, S, M, L, etc.)
- **Variant SKU**: Full SKU with size (e.g., `JC-07-XS`)
- **Variant Price**: Price for this variant
- **Image Src**: Full URL to image (upload images first)
- **Metafield: custom.product_code**: Your product code (e.g., `JC-07`)

3. **Upload Images First:**
   - Go to **Settings → Files**
   - Upload all images from `/public/products/`
   - Copy the CDN URLs for each image

4. **Import CSV:**
   - Go to **Products → Import**
   - Upload your CSV file
   - Review and confirm import

#### Option B: Manual Entry
- Continue adding products one-by-one like the test product
- Time-consuming but gives you full control

---

### Step 1.6: Assign Products to Collections

After importing products:

1. Go to **Products → Collections**
2. Click on a collection (e.g., `Mens`)
3. Click **Browse** under Products
4. Search and add relevant products
5. Click **Save**

Repeat for all 5 collections.

---

### Step 1.7: Verify Your Setup

**Checklist:**
- [ ] Custom app created with Storefront API access
- [ ] API token saved securely
- [ ] 5 collections created (new, mens, womens, slides, accessories)
- [ ] Custom metafield `custom.product_code` created
- [ ] At least 1 test product created with variants
- [ ] Product has images uploaded
- [ ] Product assigned to appropriate collection
- [ ] Product code metafield populated

---

## Phase 2: Initialize Hydrogen Project

### Step 2.1: Create New Hydrogen Project

Open your terminal and navigate to where you want to create the new project (NOT inside the current project):

```bash
# Navigate to your Desktop or projects folder
cd ~/Desktop

# Create new Hydrogen project
npm create @shopify/hydrogen@latest

# You'll be prompted with:
# ✔ Project name: yeezy-hydrogen-store
# ✔ Choose a template: Hello World
# ✔ Language: TypeScript

# Navigate into the new project
cd yeezy-hydrogen-store
```

---

### Step 2.2: Install Dependencies

Install additional packages needed from your current project:

```bash
npm install framer-motion lucide-react sonner clsx tailwind-merge class-variance-authority
```

**Optional Radix UI components** (if you want to keep them):
```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
```

---

### Step 2.3: Configure Environment Variables

Create a `.env` file in your new Hydrogen project root:

```bash
# In the yeezy-hydrogen-store directory
touch .env
```

Add your Shopify credentials (use the ones you saved from Step 1.1):

```env
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx
PUBLIC_STOREFRONT_API_VERSION=2024-10
SESSION_SECRET=your-random-secret-key-here
```

**Generate a SESSION_SECRET:**
```bash
# Run this to generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `SESSION_SECRET`.

---

### Step 2.4: Configure Tailwind CSS

#### A. Copy Tailwind Config
Copy your existing Tailwind configuration:

```bash
# From your old project root, copy to new project
cp ~/Desktop/yeezy-ecommerce-standalone/tailwind.config.ts ~/Desktop/yeezy-hydrogen-store/
```

#### B. Copy Global Styles
```bash
# Create styles directory if it doesn't exist
mkdir -p ~/Desktop/yeezy-hydrogen-store/app/styles

# Copy global styles
cp ~/Desktop/yeezy-ecommerce-standalone/src/app/globals.css ~/Desktop/yeezy-hydrogen-store/app/styles/app.css
```

#### C. Update Root Layout
Edit `app/root.tsx` to import your styles:

```typescript
import stylesheet from '~/styles/app.css?url';

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: stylesheet},
];
```

---

### Step 2.5: Copy Utility Functions

```bash
# Create lib directory
mkdir -p ~/Desktop/yeezy-hydrogen-store/app/lib

# Copy utils
cp ~/Desktop/yeezy-ecommerce-standalone/src/lib/utils.ts ~/Desktop/yeezy-hydrogen-store/app/lib/
```

---

### Step 2.6: Test Your Setup

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 - you should see the Hydrogen "Hello World" page.

**Checklist:**
- [ ] Hydrogen project created
- [ ] Dependencies installed
- [ ] `.env` file configured with Shopify credentials
- [ ] Tailwind CSS configured
- [ ] Global styles copied
- [ ] Development server runs without errors

---

## Phase 3: Data Layer - Shopify Storefront API

### Step 3.1: Create Shopify Client

Create `app/lib/shopify.server.ts`:

```typescript
import {createStorefrontClient} from '@shopify/hydrogen';

export function createShopifyClient() {
  const client = createStorefrontClient({
    storeDomain: `https://${process.env.PUBLIC_STORE_DOMAIN}`,
    storefrontApiVersion: process.env.PUBLIC_STOREFRONT_API_VERSION || '2024-10',
    privateStorefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN,
  });

  return client;
}
```

---

### Step 3.2: Create GraphQL Queries

Create directory structure:
```bash
mkdir -p app/graphql/queries
mkdir -p app/graphql/mutations
```

#### File: `app/graphql/queries/products.ts`

```typescript
// Get all products for a collection
export const PRODUCTS_BY_COLLECTION_QUERY = `#graphql
  query ProductsByCollection(
    $handle: String!
    $first: Int = 100
    $sortKey: ProductCollectionSortKeys = COLLECTION_DEFAULT
    $reverse: Boolean = false
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first
        sortKey: $sortKey
        reverse: $reverse
      ) {
        nodes {
          id
          handle
          title
          description
          productType
          featuredImage {
            url
            altText
            width
            height
          }
          images(first: 10) {
            nodes {
              url
              altText
              width
              height
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 50) {
            nodes {
              id
              title
              sku
              availableForSale
              quantityAvailable
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
          metafield(namespace: "custom", key: "product_code") {
            value
          }
          availableForSale
          tags
          createdAt
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

// Get single product by handle (slug)
export const PRODUCT_BY_HANDLE_QUERY = `#graphql
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      productType
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 10) {
        nodes {
          url
          altText
          width
          height
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 50) {
        nodes {
          id
          title
          sku
          availableForSale
          quantityAvailable
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
      metafield(namespace: "custom", key: "product_code") {
        value
      }
      availableForSale
      tags
      createdAt
    }
  }
`;

// Search products
export const SEARCH_PRODUCTS_QUERY = `#graphql
  query SearchProducts($query: String!, $first: Int = 20) {
    search(query: $query, first: $first, types: PRODUCT) {
      nodes {
        ... on Product {
          id
          handle
          title
          description
          productType
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 10) {
            nodes {
              id
              selectedOptions {
                name
                value
              }
              availableForSale
            }
          }
          metafield(namespace: "custom", key: "product_code") {
            value
          }
          availableForSale
          tags
        }
      }
    }
  }
`;
```

---

### Step 3.3: Create Cart Mutations

#### File: `app/graphql/mutations/cart.ts`

```typescript
// Create a new cart
export const CART_CREATE_MUTATION = `#graphql
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  handle
                  title
                  featuredImage {
                    url
                  }
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Add items to cart
export const CART_ADD_LINE_MUTATION = `#graphql
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  handle
                  title
                  featuredImage {
                    url
                  }
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Update cart line quantity
export const CART_UPDATE_LINE_MUTATION = `#graphql
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
        lines(first: 100) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Remove items from cart
export const CART_REMOVE_LINE_MUTATION = `#graphql
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        totalQuantity
        lines(first: 100) {
          nodes {
            id
            quantity
          }
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Get cart by ID
export const CART_QUERY = `#graphql
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      lines(first: 100) {
        nodes {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              sku
              price {
                amount
                currencyCode
              }
              product {
                handle
                title
                featuredImage {
                  url
                  altText
                }
                metafield(namespace: "custom", key: "product_code") {
                  value
                }
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;
```

---

### Step 3.4: Create Type Transformations

Create `app/types/shopify.ts`:

```typescript
// Copy the Product, Size, Category types from your old project
export type Category = "new" | "mens" | "womens" | "slides" | "accessories";

export interface Size {
  value: string;
  label: string;
  available: boolean;
  variantId: string; // NEW: Required for Shopify
  quantityAvailable?: number;
}

export interface Product {
  id: string;
  code: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  sizes: Size[];
  category: Category;
  description?: string;
  inStock: boolean;
  featured: boolean;
  dateAdded: string;
}

export interface CartItem {
  productId: string;
  variantId: string; // NEW: Required for Shopify
  code: string;
  slug: string;
  price: number;
  size: string;
  qty: number;
  image: string;
}

// Shopify GraphQL types
export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description?: string;
  productType: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  images: {
    nodes: Array<{
      url: string;
      altText?: string;
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      sku?: string;
      availableForSale: boolean;
      quantityAvailable?: number;
      price: {
        amount: string;
        currencyCode: string;
      };
      selectedOptions: Array<{
        name: string;
        value: string;
      }>;
    }>;
  };
  metafield?: {
    value: string;
  };
  availableForSale: boolean;
  tags: string[];
  createdAt: string;
}

// Helper to map collection handle to category
function mapCollectionToCategory(collectionHandle: string): Category {
  const mapping: Record<string, Category> = {
    'new': 'new',
    'mens': 'mens',
    'womens': 'womens',
    'slides': 'slides',
    'accessories': 'accessories',
  };
  return mapping[collectionHandle.toLowerCase()] || 'new';
}

// Transform Shopify product to app Product type
export function transformShopifyProduct(
  shopifyProduct: ShopifyProduct,
  collectionHandle?: string
): Product {
  const variants = shopifyProduct.variants.nodes;

  return {
    id: shopifyProduct.id,
    code: shopifyProduct.metafield?.value ||
          shopifyProduct.variants.nodes[0]?.sku?.split('-')[0] ||
          '',
    slug: shopifyProduct.handle,
    name: shopifyProduct.title,
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    images: shopifyProduct.images.nodes.map(img => img.url),
    sizes: variants.map(variant => {
      const sizeOption = variant.selectedOptions.find(opt => opt.name === 'Size');
      return {
        value: sizeOption?.value || 'ONE SIZE',
        label: sizeOption?.value || 'ONE SIZE',
        available: variant.availableForSale,
        variantId: variant.id,
        quantityAvailable: variant.quantityAvailable,
      };
    }),
    category: collectionHandle
      ? mapCollectionToCategory(collectionHandle)
      : mapCollectionToCategory(shopifyProduct.productType),
    description: shopifyProduct.description,
    inStock: shopifyProduct.availableForSale,
    featured: shopifyProduct.tags.includes('featured'),
    dateAdded: shopifyProduct.createdAt,
  };
}
```

---

### Step 3.5: Test Data Fetching

Create a test route to verify your Shopify connection.

Create `app/routes/test-shopify.tsx`:

```typescript
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {PRODUCTS_BY_COLLECTION_QUERY} from '~/graphql/queries/products';

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  try {
    const {collection} = await storefront.query(PRODUCTS_BY_COLLECTION_QUERY, {
      variables: {
        handle: 'mens', // Test with your 'mens' collection
        first: 10,
      },
    });

    return json({
      success: true,
      collection,
      products: collection?.products.nodes || [],
    });
  } catch (error) {
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default function TestShopify() {
  const data = useLoaderData<typeof loader>();

  if (!data.success) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>{data.error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Shopify Connection Test</h1>
      <p className="text-green-600 mb-4">✅ Successfully connected to Shopify!</p>

      <h2 className="text-xl font-semibold mb-2">Products Found: {data.products.length}</h2>

      <div className="space-y-4">
        {data.products.map((product: any) => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="font-bold">{product.title}</h3>
            <p>Handle: {product.handle}</p>
            <p>Price: ${product.priceRange.minVariantPrice.amount}</p>
            <p>Variants: {product.variants.nodes.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Test it:**
```bash
npm run dev
```

Visit http://localhost:3000/test-shopify

You should see your products from Shopify!

**Checklist:**
- [ ] Shopify client created
- [ ] GraphQL queries created
- [ ] Cart mutations created
- [ ] Type transformations created
- [ ] Test route shows products from Shopify

---

## Phase 4: Routing Migration

### Step 4.1: Create Main Shop Page

Create `app/routes/_index.tsx`:

```typescript
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {PRODUCTS_BY_COLLECTION_QUERY} from '~/graphql/queries/products';
import {transformShopifyProduct, type Product} from '~/types/shopify';

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || 'new';

  const {collection} = await storefront.query(PRODUCTS_BY_COLLECTION_QUERY, {
    variables: {
      handle: category,
      first: 100,
      sortKey: category === 'new' ? 'CREATED' : 'COLLECTION_DEFAULT',
      reverse: category === 'new',
    },
  });

  const products: Product[] = collection?.products.nodes.map((p: any) =>
    transformShopifyProduct(p, category)
  ) || [];

  return json({
    products,
    category,
  });
}

export default function Index() {
  const {products, category} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">
          {category.toUpperCase()}
        </h1>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="group">
              <a href={`/products/${product.slug}`}>
                <div className="aspect-square overflow-hidden bg-gray-100">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.code}
                      className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm">{product.code}</p>
                <p className="text-sm font-semibold">${product.price}</p>
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
```

**Test it:**
Visit http://localhost:3000 - you should see products!

Try different categories:
- http://localhost:3000?category=mens
- http://localhost:3000?category=womens

---

### Step 4.2: Create Product Detail Page

Create `app/routes/products.$handle.tsx`:

```typescript
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {PRODUCT_BY_HANDLE_QUERY} from '~/graphql/queries/products';
import {transformShopifyProduct} from '~/types/shopify';

export async function loader({context, params}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {handle} = params;

  if (!handle) {
    throw new Response('Not Found', {status: 404});
  }

  const {product: shopifyProduct} = await storefront.query(PRODUCT_BY_HANDLE_QUERY, {
    variables: {handle},
  });

  if (!shopifyProduct) {
    throw new Response('Not Found', {status: 404});
  }

  const product = transformShopifyProduct(shopifyProduct);

  return json({product});
}

export default function ProductDetail() {
  const {product} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden bg-gray-100">
            {product.images[0] && (
              <img
                src={product.images[0]}
                alt={product.code}
                className="h-full w-full object-contain"
              />
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm uppercase text-gray-500">{product.code}</p>
            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
            <p className="mt-4 text-2xl font-semibold">${product.price}</p>

            {/* Size Selector */}
            <div className="mt-8">
              <p className="mb-4 text-sm font-semibold uppercase">Select Size</p>
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.value}
                    disabled={!size.available}
                    className={`border p-3 text-sm transition-colors ${
                      size.available
                        ? 'hover:bg-black hover:text-white'
                        : 'cursor-not-allowed opacity-30'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-8">
                <h2 className="mb-2 text-sm font-semibold uppercase">Description</h2>
                <p className="text-sm text-gray-700">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
```

**Test it:**
Visit http://localhost:3000/products/black-puffer-jacket

---

### Step 4.3: Update Root Layout

Edit `app/root.tsx` to add basic navigation:

```typescript
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import type {LinksFunction} from '@shopify/remix-oxygen';
import stylesheet from '~/styles/app.css?url';

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: stylesheet},
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* Simple header */}
        <header className="border-b">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <nav className="flex items-center justify-between">
              <a href="/" className="text-xl font-bold">
                YEEZY
              </a>
              <div className="flex gap-6 text-sm uppercase">
                <a href="/?category=new">New</a>
                <a href="/?category=mens">Mens</a>
                <a href="/?category=womens">Womens</a>
                <a href="/?category=slides">Slides</a>
                <a href="/?category=accessories">Accessories</a>
              </div>
              <a href="/cart" className="text-sm uppercase">
                Cart
              </a>
            </nav>
          </div>
        </header>

        <Outlet />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

**Checklist:**
- [ ] Main shop page displays products
- [ ] Category navigation works
- [ ] Product detail page shows correct product
- [ ] Navigation header visible on all pages

---

## Phase 5: Cart Integration

### Step 5.1: Create Cart Server Utilities

Create `app/lib/cart.server.ts`:

```typescript
import {createCookieSessionStorage} from '@shopify/remix-oxygen';
import {CART_QUERY} from '~/graphql/mutations/cart';

const SESSION_SECRET = process.env.SESSION_SECRET!;

export const cartSessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'cart',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
});

export async function getCartId(request: Request) {
  const session = await cartSessionStorage.getSession(request.headers.get('Cookie'));
  return session.get('cartId');
}

export async function setCartId(request: Request, cartId: string) {
  const session = await cartSessionStorage.getSession(request.headers.get('Cookie'));
  session.set('cartId', cartId);
  return cartSessionStorage.commitSession(session);
}

export async function getCart(cartId: string, storefront: any) {
  if (!cartId) return null;

  const {cart} = await storefront.query(CART_QUERY, {
    variables: {cartId},
  });

  return cart;
}
```

---

### Step 5.2: Create Cart Route with Actions

Create `app/routes/cart.tsx`:

```typescript
import {json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Form, useFetcher} from '@remix-run/react';
import {getCartId, getCart, setCartId} from '~/lib/cart.server';
import {
  CART_CREATE_MUTATION,
  CART_ADD_LINE_MUTATION,
  CART_UPDATE_LINE_MUTATION,
  CART_REMOVE_LINE_MUTATION,
} from '~/graphql/mutations/cart';

// Action handler for cart operations
export async function action({request, context}: ActionFunctionArgs) {
  const {storefront} = context;
  const formData = await request.formData();
  const action = formData.get('action');
  const cartId = await getCartId(request);

  switch (action) {
    case 'addToCart': {
      const variantId = formData.get('variantId') as string;
      const quantity = parseInt(formData.get('quantity') as string) || 1;

      if (!cartId) {
        // Create new cart
        const {cartCreate} = await storefront.mutate(CART_CREATE_MUTATION, {
          variables: {
            input: {
              lines: [{merchandiseId: variantId, quantity}],
            },
          },
        });

        const newCartId = cartCreate?.cart?.id;
        const setCookie = await setCartId(request, newCartId);

        return json(
          {cart: cartCreate?.cart},
          {headers: {'Set-Cookie': setCookie}}
        );
      } else {
        // Add to existing cart
        const {cartLinesAdd} = await storefront.mutate(CART_ADD_LINE_MUTATION, {
          variables: {
            cartId,
            lines: [{merchandiseId: variantId, quantity}],
          },
        });

        return json({cart: cartLinesAdd?.cart});
      }
    }

    case 'updateQuantity': {
      const lineId = formData.get('lineId') as string;
      const quantity = parseInt(formData.get('quantity') as string);

      const {cartLinesUpdate} = await storefront.mutate(CART_UPDATE_LINE_MUTATION, {
        variables: {
          cartId,
          lines: [{id: lineId, quantity}],
        },
      });

      return json({cart: cartLinesUpdate?.cart});
    }

    case 'removeItem': {
      const lineId = formData.get('lineId') as string;

      const {cartLinesRemove} = await storefront.mutate(CART_REMOVE_LINE_MUTATION, {
        variables: {
          cartId,
          lineIds: [lineId],
        },
      });

      return json({cart: cartLinesRemove?.cart});
    }

    default:
      return json({error: 'Invalid action'}, {status: 400});
  }
}

// Load cart data
export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const cartId = await getCartId(request);

  if (!cartId) {
    return json({cart: null});
  }

  const cart = await getCart(cartId, storefront);

  return json({cart});
}

export default function Cart() {
  const {cart} = useLoaderData<typeof loader>();

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <a href="/" className="mt-4 inline-block text-sm underline">
            Continue shopping
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

        <div className="space-y-4">
          {cart.lines.nodes.map((line: any) => (
            <CartLineItem key={line.id} line={line} />
          ))}
        </div>

        <div className="mt-8 border-t pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span>Subtotal</span>
            <span>${cart.cost.subtotalAmount.amount}</span>
          </div>

          <a
            href={cart.checkoutUrl}
            className="mt-4 block w-full bg-black py-4 text-center text-sm uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
          >
            Checkout
          </a>
        </div>
      </main>
    </div>
  );
}

function CartLineItem({line}: {line: any}) {
  const fetcher = useFetcher();
  const {merchandise, quantity} = line;
  const {product} = merchandise;

  return (
    <div className="flex gap-4 border-b pb-4">
      <img
        src={product.featuredImage?.url}
        alt={product.title}
        className="h-24 w-24 object-contain"
      />

      <div className="flex-1">
        <h3 className="font-semibold">{product.title}</h3>
        <p className="text-sm text-gray-600">
          Size: {merchandise.selectedOptions.find((o: any) => o.name === 'Size')?.value}
        </p>
        <p className="mt-1 font-semibold">${merchandise.price.amount}</p>

        <div className="mt-2 flex items-center gap-2">
          <label className="text-sm">Qty:</label>
          <fetcher.Form method="post">
            <input type="hidden" name="action" value="updateQuantity" />
            <input type="hidden" name="lineId" value={line.id} />
            <select
              name="quantity"
              defaultValue={quantity}
              onChange={(e) => fetcher.submit(e.currentTarget.form)}
              className="border px-2 py-1"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </fetcher.Form>

          <fetcher.Form method="post">
            <input type="hidden" name="action" value="removeItem" />
            <input type="hidden" name="lineId" value={line.id} />
            <button type="submit" className="text-sm underline">
              Remove
            </button>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}
```

---

### Step 5.3: Update Product Page to Add to Cart

Edit `app/routes/products.$handle.tsx` to add cart functionality:

```typescript
// Add this import
import {useFetcher} from '@remix-run/react';
import {useState} from 'react';

// In the component, add:
export default function ProductDetail() {
  const {product} = useLoaderData<typeof loader>();
  const addToCart = useFetcher();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const size = product.sizes.find(s => s.value === selectedSize);
    if (!size) return;

    addToCart.submit(
      {
        action: 'addToCart',
        variantId: size.variantId,
        quantity: '1',
      },
      {method: 'POST', action: '/cart'}
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Image - same as before */}
          <div className="aspect-square overflow-hidden bg-gray-100">
            {product.images[0] && (
              <img
                src={product.images[0]}
                alt={product.code}
                className="h-full w-full object-contain"
              />
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm uppercase text-gray-500">{product.code}</p>
            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
            <p className="mt-4 text-2xl font-semibold">${product.price}</p>

            {/* Size Selector */}
            <div className="mt-8">
              <p className="mb-4 text-sm font-semibold uppercase">Select Size</p>
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.value}
                    disabled={!size.available}
                    onClick={() => setSelectedSize(size.value)}
                    className={`border p-3 text-sm transition-colors ${
                      selectedSize === size.value
                        ? 'bg-black text-white'
                        : size.available
                        ? 'hover:bg-black hover:text-white'
                        : 'cursor-not-allowed opacity-30'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || addToCart.state === 'submitting'}
              className="mt-8 w-full bg-black py-4 text-sm uppercase tracking-wider text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addToCart.state === 'submitting' ? 'Adding...' : 'Add to Cart'}
            </button>

            {addToCart.data && (
              <p className="mt-2 text-sm text-green-600">✓ Added to cart!</p>
            )}

            {/* Description */}
            {product.description && (
              <div className="mt-8">
                <h2 className="mb-2 text-sm font-semibold uppercase">Description</h2>
                <p className="text-sm text-gray-700">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

### Step 5.4: Add Cart Count to Header

Edit `app/root.tsx` to show cart count:

```typescript
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getCartId, getCart} from '~/lib/cart.server';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const cartId = await getCartId(request);
  const cart = cartId ? await getCart(cartId, storefront) : null;

  return json({
    cart,
  });
}

export default function App() {
  const {cart} = useLoaderData<typeof loader>();
  const cartCount = cart?.totalQuantity || 0;

  return (
    <html lang="en">
      {/* ... head stays the same ... */}
      <body>
        <header className="border-b">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <nav className="flex items-center justify-between">
              <a href="/" className="text-xl font-bold">
                YEEZY
              </a>
              <div className="flex gap-6 text-sm uppercase">
                <a href="/?category=new">New</a>
                <a href="/?category=mens">Mens</a>
                <a href="/?category=womens">Womens</a>
                <a href="/?category=slides">Slides</a>
                <a href="/?category=accessories">Accessories</a>
              </div>
              <a href="/cart" className="text-sm uppercase">
                Cart ({cartCount})
              </a>
            </nav>
          </div>
        </header>

        <Outlet />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

**Test the cart flow:**
1. Go to a product page
2. Select a size
3. Click "Add to Cart"
4. See cart count update in header
5. Go to cart page
6. Update quantity or remove items
7. Click "Checkout" → should redirect to Shopify checkout

**Checklist:**
- [ ] Can add items to cart from product page
- [ ] Cart count shows in header
- [ ] Cart page displays items
- [ ] Can update quantities in cart
- [ ] Can remove items from cart
- [ ] Checkout button redirects to Shopify
- [ ] Cart persists on page refresh

---

## Phase 6: Component Migration

### Step 6.1: Copy UI Components

Copy all your UI components unchanged:

```bash
# Create components directory
mkdir -p ~/Desktop/yeezy-hydrogen-store/app/components/ui

# Copy all UI components
cp -r ~/Desktop/yeezy-ecommerce-standalone/src/components/ui/* ~/Desktop/yeezy-hydrogen-store/app/components/ui/
```

---

### Step 6.2: Migrate and Adapt Components

For each component from your old `src/app/_components/`, you'll need to:

1. Copy the file
2. Update imports:
   - `next/link` → `@remix-run/react` (use `Link`)
   - `next/image` → remove (use standard `<img>`)
3. Update any client-side hooks if needed

**Example migration:**

```bash
# Copy component files
mkdir -p ~/Desktop/yeezy-hydrogen-store/app/components

# You'll manually adapt each one following the patterns from Phase 4 & 5
```

I'll create a detailed migration checklist for you in the next sections...

---

## Phase 7: Filtering & Search

### Step 7.1: Implement URL-Based Filtering

Update `app/routes/_index.tsx` to support filters:

```typescript
export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);

  const category = url.searchParams.get('category') || 'new';
  const sizeFilter = url.searchParams.getAll('size');
  const priceMin = url.searchParams.get('priceMin');
  const priceMax = url.searchParams.get('priceMax');
  const inStockOnly = url.searchParams.get('inStock') === 'true';

  // Build filter array for Shopify
  const filters: any[] = [];

  if (inStockOnly) {
    filters.push({available: true});
  }

  if (priceMin || priceMax) {
    filters.push({
      price: {
        min: priceMin ? parseFloat(priceMin) : undefined,
        max: priceMax ? parseFloat(priceMax) : undefined,
      },
    });
  }

  const {collection} = await storefront.query(PRODUCTS_BY_COLLECTION_QUERY, {
    variables: {
      handle: category,
      first: 100,
      sortKey: category === 'new' ? 'CREATED' : 'COLLECTION_DEFAULT',
      reverse: category === 'new',
      // Note: Shopify filters might need adjustment based on your store setup
    },
  });

  let products: Product[] = collection?.products.nodes.map((p: any) =>
    transformShopifyProduct(p, category)
  ) || [];

  // Client-side size filtering (if needed)
  if (sizeFilter.length > 0) {
    products = products.filter(product =>
      product.sizes.some(size =>
        sizeFilter.includes(size.value) && size.available
      )
    );
  }

  return json({products, category});
}
```

---

### Step 7.2: Create Search Route

Create `app/routes/search.tsx`:

```typescript
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Form} from '@remix-run/react';
import {SEARCH_PRODUCTS_QUERY} from '~/graphql/queries/products';
import {transformShopifyProduct, type Product} from '~/types/shopify';

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';

  if (!query) {
    return json({results: [], query: ''});
  }

  const {search} = await storefront.query(SEARCH_PRODUCTS_QUERY, {
    variables: {query, first: 20},
  });

  const results: Product[] = search?.nodes.map((p: any) =>
    transformShopifyProduct(p)
  ) || [];

  return json({results, query});
}

export default function Search() {
  const {results, query} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Form method="get" className="mb-8">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search products..."
            className="w-full border px-4 py-2"
          />
        </Form>

        {query && (
          <p className="mb-4 text-sm text-gray-600">
            {results.length} results for "{query}"
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {results.map((product) => (
            <div key={product.id} className="group">
              <a href={`/products/${product.slug}`}>
                <div className="aspect-square overflow-hidden bg-gray-100">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.code}
                      className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm">{product.code}</p>
                <p className="text-sm font-semibold">${product.price}</p>
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
```

Add search to your header in `app/root.tsx`:

```typescript
<div className="flex items-center gap-4">
  <a href="/search" className="text-sm uppercase">Search</a>
  <a href="/cart" className="text-sm uppercase">
    Cart ({cartCount})
  </a>
</div>
```

**Checklist:**
- [ ] Filtering by URL parameters works
- [ ] Search route created and functional
- [ ] Search integrated into header

---

## Phase 8: Checkout Integration

### Step 8.1: Verify Checkout Redirect

You've already implemented this in Phase 5! The cart page has:

```typescript
<a href={cart.checkoutUrl} className="...">
  Checkout
</a>
```

### Step 8.2: Configure Shopify Checkout Branding

1. Go to **Settings → Checkout** in Shopify Admin
2. Click **Customize**
3. Update branding:
   - Add logo
   - Set colors to match your site (black/white theme)
   - Set fonts to Helvetica/similar
4. Click **Save**

### Step 8.3: Test Checkout Flow

1. Add items to cart
2. Click checkout
3. Complete test order using Shopify's test payment info
4. Verify order appears in Orders section

**Checklist:**
- [ ] Checkout redirect works
- [ ] Shopify checkout matches brand styling
- [ ] Test order completes successfully
- [ ] Order confirmation email received

---

## Phase 9: Testing & Validation

### Step 9.1: Functional Testing Checklist

Test each feature systematically:

**Products:**
- [ ] All products display on shop page
- [ ] Product images load correctly
- [ ] Product prices display correctly
- [ ] Product codes (SKU) display correctly

**Navigation:**
- [ ] Each category shows correct products
- [ ] Product detail pages load
- [ ] Back navigation works

**Variants:**
- [ ] Size selector shows all sizes
- [ ] Out of stock sizes are disabled
- [ ] Selecting size enables add to cart

**Cart:**
- [ ] Adding to cart works
- [ ] Cart count updates in header
- [ ] Cart page shows correct items
- [ ] Quantity update works
- [ ] Remove item works
- [ ] Subtotal calculates correctly
- [ ] Cart persists on refresh

**Checkout:**
- [ ] Checkout redirect works
- [ ] Can complete test order
- [ ] Order appears in Shopify admin

**Search & Filters:**
- [ ] Search returns relevant results
- [ ] Filters work correctly
- [ ] URL updates with filter/search params

---

### Step 9.2: Visual Testing

Compare side-by-side with original site:

- [ ] Fonts match (Helvetica bold)
- [ ] Colors match (black/white/gray)
- [ ] Spacing matches
- [ ] Grid layouts match (2/3/4 columns)
- [ ] Product cards look identical
- [ ] Hover effects work
- [ ] Mobile responsive

---

### Step 9.3: Performance Testing

Run Lighthouse audit:

```bash
npm run build
npm run preview
```

Then run Lighthouse in Chrome DevTools.

**Target scores:**
- [ ] Performance: ≥ 90
- [ ] Accessibility: ≥ 90
- [ ] Best Practices: ≥ 90
- [ ] SEO: ≥ 90

---

## Phase 10: Deployment

### Step 10.1: Deploy to Shopify Oxygen

Oxygen is Shopify's hosting platform for Hydrogen apps.

```bash
# Install Shopify CLI if you haven't
npm install -g @shopify/cli

# Login to Shopify
shopify auth login

# Link your project to your Shopify store
shopify hydrogen link

# Deploy
shopify hydrogen deploy
```

Follow the prompts to select your store.

---

### Step 10.2: Configure Custom Domain

1. In Shopify Admin, go to **Online Store → Domains**
2. Click **Connect existing domain**
3. Enter your domain (e.g., `yeezy-store.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

---

### Step 10.3: Set Production Environment Variables

In your Hydrogen deployment settings:

1. Go to Shopify Partners → Your App → Settings
2. Add environment variables:
   - `PUBLIC_STORE_DOMAIN`: your-store.myshopify.com
   - `PUBLIC_STOREFRONT_API_TOKEN`: (your production token)
   - `SESSION_SECRET`: (new random secret for production)

---

### Step 10.4: Final Production Checklist

- [ ] All products imported to Shopify
- [ ] All collections configured
- [ ] Product images uploaded
- [ ] Metafields populated
- [ ] Hydrogen deployed successfully
- [ ] Custom domain connected (if applicable)
- [ ] SSL certificate active
- [ ] Test order in production
- [ ] Checkout branding configured
- [ ] Email notifications working
- [ ] Analytics setup (Google Analytics, etc.)

---

## Troubleshooting Common Issues

### Issue: "Storefront API access token is invalid"
**Solution:**
- Verify token in `.env` matches Shopify admin
- Ensure app is installed
- Check API scopes are enabled

### Issue: Products not showing
**Solution:**
- Verify products are published (not draft)
- Check collection handles match (case-sensitive)
- Verify products are assigned to collections

### Issue: Cart not persisting
**Solution:**
- Check `SESSION_SECRET` is set in `.env`
- Verify cookies are enabled in browser
- Check cart mutations are returning cart ID

### Issue: Variants not working
**Solution:**
- Ensure products have Size option configured
- Verify variant IDs are being passed to cart
- Check variant availability in Shopify admin

### Issue: Images not loading
**Solution:**
- Verify image URLs are HTTPS
- Check images are uploaded to Shopify
- Ensure images are assigned to products

---

## Next Steps After Migration

Once your Shopify Hydrogen store is live:

1. **Add analytics** (Google Analytics, Meta Pixel)
2. **Set up email marketing** (Klaviyo, Mailchimp integration)
3. **Configure shipping** zones and rates in Shopify
4. **Set up taxes** (automatic tax calculation)
5. **Add additional features**:
   - Customer accounts
   - Wishlists
   - Product reviews
   - Related products
6. **Optimize performance**:
   - Image optimization
   - Code splitting
   - CDN configuration

---

## Resources

- [Shopify Hydrogen Docs](https://shopify.dev/docs/custom-storefronts/hydrogen)
- [Storefront API Reference](https://shopify.dev/docs/api/storefront)
- [Remix Documentation](https://remix.run/docs)
- [Shopify Partners](https://partners.shopify.com/)
- [Shopify Community Forums](https://community.shopify.com/)

---

## Support

If you encounter issues:
1. Check Shopify status page
2. Review Hydrogen Discord community
3. Contact Shopify Partner support
4. Check deployment logs in Oxygen dashboard
