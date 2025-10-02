import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      home: 'Home',
      catalog: 'Catalog',
      cart: 'Cart',
      login: 'Login',
      logout: 'Logout',
      search: 'Search watches...',
      filter: 'Filter',
      sort: 'Sort',
      addToCart: 'Add to Cart',
      checkout: 'Checkout',
      placeOrder: 'Place Order',
    },
  },
  vi: {
    translation: {
      home: 'Trang chủ',
      catalog: 'Danh mục',
      cart: 'Giỏ hàng',
      login: 'Đăng nhập',
      logout: 'Đăng xuất',
      search: 'Tìm kiếm đồng hồ...',
      filter: 'Lọc',
      sort: 'Sắp xếp',
      addToCart: 'Thêm vào giỏ',
      checkout: 'Thanh toán',
      placeOrder: 'Đặt hàng',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
