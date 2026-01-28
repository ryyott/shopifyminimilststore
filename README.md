# YZY E-Commerce Demo

A minimalist, Yeezy-inspired e-commerce demo application built with Next.js 16, featuring a modern shopping experience with cart management, product filtering, a complete checkout flow, and an admin dashboard.

## Features

### Customer-Facing

- **Product Catalog**: Browse 38 premium products across 5 categories (NEW, MENS, WOMENS, SLIDES, ACCESSORIES)
- **Advanced Filtering**: Filter by category, size, price range, and availability
- **Real-time Search**: Instant product search across names, codes, and descriptions
- **Shopping Cart**: Persistent cart with localStorage, quantity management, and subtotal calculation
- **Smooth Animations**: Framer Motion powered transitions and hover effects
- **Responsive Design**: Mobile-first design that scales beautifully across all devices
- **Checkout Flow**: Complete checkout process with contact, shipping, and payment forms

### Admin Dashboard

- **Order Management**: Track and manage all orders with real-time status updates
- **Analytics Dashboard**: View order metrics, revenue tracking, and order statistics
- **Product Management**: Add, edit, and manage product inventory
- **Customer Database**: Manage customer information and order history
- **Settings Panel**: Configure store settings and preferences

## Tech Stack

- **Framework**: Next.js 16.0.5 with App Router
- **React**: 19.2.0
- **TypeScript**: 5.9.3
- **State Management**: Zustand 5.0.8 with localStorage persistence
- **Styling**: Tailwind CSS v4.1.5
- **Animations**: Framer Motion 12.23.25
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner toast library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with cart icon and email banner
│   ├── page.tsx                # Home page with product grid
│   ├── product/[slug]/         # Dynamic product detail pages
│   ├── cart/                   # Shopping cart page
│   ├── checkout/               # Checkout page with forms
│   └── _components/            # Shared components (12 files)
├── components/ui/              # Base UI components (Button, Input)
├── stores/                     # Zustand cart store
├── data/shop/                  # Product data (38 products)
├── types/                      # TypeScript type definitions
└── lib/                        # Utility functions
```

## Product Data

The app includes 38 hardcoded products with:
- Multiple images per product
- Size variations (XS-XXL, ONE SIZE, shoe sizes)
- Price ranges ($45-$200)
- Category assignments
- Availability status

To add/edit products, modify `src/data/shop/products.ts`

## Cart Functionality

- Cart state persists across page refreshes using localStorage
- Supports multiple quantities of same product in different sizes
- Real-time subtotal calculation
- Toast notifications on add to cart

## Future: Shopify Integration

This demo is designed to be easily converted to a Shopify theme using Shopify Hydrogen:

1. Replace static product data with Shopify Storefront API
2. Integrate Shopify Cart API
3. Connect checkout to Shopify managed checkout
4. Upload product images to Shopify CDN

See the implementation plan for detailed conversion steps.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

This is a standard Next.js 16 app and can be deployed to:
- Netlify
- AWS Amplify
- Docker
- Any Node.js hosting

## Performance

- Optimized images with Next.js Image component
- Lazy loading for products
- Bundle size < 500kb
- 60fps animations
- Lighthouse score: 90+

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - see [LICENSE](LICENSE) file for details

## Credits

Built as a demo ecommerce site inspired by Yeezy's minimalist aesthetic.
