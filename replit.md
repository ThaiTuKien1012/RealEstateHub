# Timeless Watch Shop

## Overview

Timeless Watch Shop is a cross-platform luxury watch e-commerce application built with React Native (Expo) and TypeScript. The application runs on iOS, Android, and web platforms, providing a seamless shopping experience for luxury watch enthusiasts. It features a complete product catalog with advanced filtering, shopping cart functionality, and a mock checkout flow.

The application emphasizes performance, accessibility, and user experience with progressive image loading, offline support through caching, and internationalization capabilities. It uses a modern tech stack with React Query for server state management and Zustand for client-side state, ensuring efficient data handling and optimal performance across all platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Platform**: Built on Expo SDK 52 with React Native, enabling true cross-platform development for iOS, Android, and web from a single codebase. The web build uses Metro bundler and is configured as a Progressive Web App (PWA) with manifest and service worker support.

**Component Architecture**: Follows a component-based architecture with reusable UI components (`Header`, `Footer`, `ProductCard`, `ProductGallery`, `FilterPanel`) that are platform-agnostic. Components are organized by feature and responsibility, with a clear separation between presentational and container components.

**Navigation**: Uses React Navigation v7 with native stack navigator for optimal performance. Navigation structure is flat with screen-based routing (Home, Catalog, ProductDetail, Cart, Checkout, Auth, Profile) without nested navigators, simplifying state management and transitions. Profile screen provides user account information and logout functionality.

**Styling**: Implements utility-first styling with `twrnc` (Tailwind for React Native), providing consistent design tokens across platforms while maintaining native performance. The styling approach is mobile-first with responsive breakpoints defined in constants.

**Type Safety**: Fully typed with TypeScript in strict mode, with comprehensive type definitions for products, cart items, API responses, filters, and component props. Uses path aliases (`@components`, `@screens`, etc.) via Babel module resolver for cleaner imports.

### State Management

**Server State**: React Query (TanStack Query) manages all server state with intelligent caching, automatic background refetching, and optimistic updates. Custom hooks (`useProducts`, `useProduct`, `useFeaturedProducts`, `useBestSellers`, `useProductSearch`) encapsulate query logic with appropriate stale times (2-10 minutes) to balance freshness and performance.

**Client State**: Zustand stores handle cart (`useCart`) and authentication (`useAuth`) state with persistent actions. Cart store manages items, quantities, variant selection, and calculations. Auth store handles user sessions and authentication flow. Both use simple, predictable state updates without boilerplate.

**Data Flow**: Unidirectional data flow from API → React Query cache → components for server data, and user actions → Zustand stores → components for client state. Debouncing is implemented for search inputs to reduce unnecessary API calls.

### API & Data Layer

**Mock API Implementation**: Uses Axios with simulated backend responses via artificial delays, mimicking real-world API behavior. All API functions return Promise-based responses wrapped in standardized `ApiResponse` types for consistent error handling.

**Data Structure**: Mock product data includes 18 luxury watch products with complete specifications (images, variants, reviews, pricing, materials). Products support variants (color, size, strap) with individual stock and price modifiers.

**Caching Strategy**: React Query provides multi-level caching with configurable stale times. Products remain fresh for 5 minutes, featured products for 10 minutes, and search results for 2 minutes. Placeholder data prevents UI flashing during refetches.

**Image Optimization**: Uses `expo-image` for progressive loading with automatic WebP conversion, built-in caching, and placeholder support. Images are lazy-loaded and optimized for different screen densities.

### Performance Optimizations

**Code Splitting**: Path-based code splitting through React Navigation with lazy-loaded screens. Only active screen components are rendered in memory.

**Memoization**: Strategic use of `React.useMemo` for expensive computations like product sorting and filtering. React Query handles result memoization automatically.

**Debouncing**: Search queries and filter changes are debounced (500ms default) using custom `useDebounce` hook to minimize re-renders and API calls.

**List Virtualization**: FlatList components with `keyExtractor` and optimized `renderItem` for efficient rendering of large product catalogs.

### Accessibility Features

**ARIA Support**: All interactive elements include `accessibilityLabel`, `accessibilityRole`, and `accessibilityHint` attributes for screen reader compatibility.

**Keyboard Navigation**: Touch targets are appropriately sized (minimum 44x44 points), with focus management for web platform keyboard navigation.

**Semantic HTML**: Web builds use semantic HTML elements through React Native Web's mapping for better SEO and accessibility.

### Internationalization

**i18next Integration**: Configured with React i18next for multi-language support. Currently supports English and Vietnamese with extensible resource structure for additional languages.

**Currency Formatting**: Uses `Intl.NumberFormat` for locale-aware currency display, supporting USD with extensibility for VNĐ, EUR, and other currencies.

## External Dependencies

### Core Framework
- **Expo SDK 52**: Complete development platform providing native modules, build tools, and cross-platform APIs without ejecting from managed workflow
- **React Native 0.76.5**: Core framework for building native apps with React
- **React 18.3.1**: UI library with concurrent features and automatic batching
- **React DOM 18.3.1**: Web rendering for Expo web builds
- **React Native Web 0.19.13**: React Native primitives mapped to web standards

### Navigation & Routing
- **React Navigation 7**: Native stack, bottom tabs, and nested navigation with TypeScript support
- **react-native-safe-area-context**: Handles notches, home indicators, and device-specific safe areas
- **react-native-screens**: Native screen optimization for better performance

### State Management & Data Fetching
- **@tanstack/react-query 5.90.2**: Asynchronous state management with powerful caching, background updates, and request deduplication
- **Zustand 5.0.8**: Lightweight state management without boilerplate for cart and auth
- **Axios 1.12.2**: Promise-based HTTP client with request/response interceptors

### Styling & UI
- **twrnc 4.10.1**: Tailwind CSS utilities for React Native with JIT compilation
- **expo-image 2.0.2**: Performant image component with caching, progressive loading, and format optimization

### Internationalization
- **i18next 24.2.3**: Internationalization framework with interpolation and pluralization
- **react-i18next 15.7.4**: React bindings for i18next with hooks-based API

### Development Tools
- **TypeScript 5.3.3**: Static type checking with strict mode enabled
- **babel-plugin-module-resolver**: Path aliasing for cleaner imports (`@components`, `@screens`, etc.)
- **@expo/metro-runtime**: Metro bundler runtime for Expo apps

### Type Definitions
- **@types/react 18.3.12**: TypeScript definitions for React

### Testing (Configured but not implemented)
- Jest and React Native Testing Library mentioned in README for unit testing components

### Build & Deployment
- Metro bundler for JavaScript bundling
- Expo build service for native app compilation
- PWA manifest and service worker configuration for web builds

### Mock Data Sources
- Unsplash API (images.unsplash.com) for high-quality product photography in mock data

### Notes
- Application currently uses mock API implementation with in-memory data
- No backend database configured - ready for integration with REST API or GraphQL
- Authentication is mock-based, ready for real auth provider integration (Firebase, Auth0, etc.)
- Payment processing is simulated, ready for Stripe/PayPal integration
- Analytics hooks are placeholders for GA4/Amplitude integration