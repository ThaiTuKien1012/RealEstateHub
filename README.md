# Timeless Watch Shop

A professional luxury watch e-commerce mobile and web application built with React Native (Expo) and TypeScript.

## Features

### Core Functionality
- **Home Screen**: Hero banner, featured collections, and best-sellers
- **Product Catalog**: Grid/list view with pagination and infinite scroll support
- **Advanced Filtering**: Filter by brand, price range, movement type, diameter, material, and color
- **Product Details**: Image carousel, variant selection, specifications, reviews, and stock management
- **Shopping Cart**: Full cart management with quantity updates and variant support
- **Checkout Flow**: Mock checkout process with order placement
- **Authentication**: Login/signup with mock implementation

### Technical Features
- **State Management**: React Query for data fetching/caching + Zustand for cart and auth
- **Responsive Design**: Mobile-first approach with Tailwind-like utilities (twrnc)
- **Progressive Image Loading**: Optimized images with lazy loading
- **Offline Support**: React Query caching for offline access
- **PWA Ready**: Web manifest and service worker configuration
- **Internationalization**: i18next setup for multi-language support
- **Accessibility**: Semantic labels, ARIA attributes, keyboard navigation
- **TypeScript**: Fully typed codebase with strict mode

## Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: 
  - React Query (TanStack Query) for server state
  - Zustand for client state (cart, auth)
- **Styling**: twrnc (Tailwind for React Native)
- **HTTP Client**: Axios
- **Image Optimization**: expo-image
- **Internationalization**: i18next, react-i18next
- **Testing**: Jest, React Native Testing Library

## Project Structure

```
watch-shop/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   └── FilterPanel.tsx
│   ├── screens/            # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── CatalogScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   └── AuthScreen.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useProducts.ts
│   │   ├── useCart.ts
│   │   ├── useAuth.ts
│   │   └── useDebounce.ts
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── lib/               # API and utilities
│   │   └── api.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── data/              # Mock data
│   │   └── mockProducts.ts
│   ├── constants/         # App constants
│   │   └── index.ts
│   └── i18n/             # Internationalization
│       └── index.ts
├── App.tsx               # Root component
├── app.json             # Expo configuration
└── package.json         # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (optional, will be installed automatically)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd watch-shop
```

2. Install dependencies
```bash
npm install
```

### Running the App

#### Web
```bash
npm run web
# or
npx expo start --web
```
The web app will open at `http://localhost:8081`

#### iOS (requires macOS)
```bash
npm run ios
# or
npx expo start --ios
```

#### Android
```bash
npm run android
# or
npx expo start --android
```

#### Development Mode
```bash
npm start
# Then press 'w' for web, 'i' for iOS, or 'a' for Android
```

## Testing

Run unit tests:
```bash
npm test
```

## Build for Production

### Web Build
```bash
npx expo export:web
```
The build output will be in the `web-build` directory.

### Mobile Build (EAS Build)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build for iOS/Android:
```bash
eas build --platform ios
eas build --platform android
```

## Deployment

### Web Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Web Deployment (Netlify)

1. Build the web app:
```bash
npx expo export:web
```

2. Deploy the `web-build` directory to Netlify

### Mobile Deployment

Use EAS Submit to deploy to App Store and Google Play:
```bash
eas submit --platform ios
eas submit --platform android
```

## Mock Data

The app includes 18 luxury watch products from brands like:
- Rolex
- Omega  
- Patek Philippe
- TAG Heuer
- Audemars Piguet
- Cartier
- IWC
- Tudor
- Panerai
- Grand Seiko
- Jaeger-LeCoultre
- Breitling

All product data is mock data stored in `src/data/mockProducts.ts`.

## Key Features Implementation

### Advanced Filtering
- Debounced search (500ms delay)
- Multi-select filters (brands, movements, materials)
- Price range filtering
- Diameter range filtering
- Real-time filter application

### Shopping Cart
- Persistent cart state with Zustand
- Variant support (size, strap, color)
- Quantity management
- Total calculation with variant pricing

### Progressive Image Loading
- Lazy loading with expo-image
- Placeholder support
- Optimized image rendering

### Accessibility
- Semantic HTML/components
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible

## Environment Variables

No environment variables are required for the mock implementation. For production:

- `API_BASE_URL`: Backend API endpoint
- Add payment gateway credentials
- Add analytics keys

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC

## Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ using React Native and Expo
