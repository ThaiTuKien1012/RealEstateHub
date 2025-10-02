# Postman API Testing Guide

## Backend URL
```
http://localhost:3000/api
```

## Authentication
Hầu hết endpoints cần JWT token trong header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 1. Authentication APIs

### 1.1 Register (Đăng ký)
- **Method**: POST
- **URL**: `http://localhost:3000/api/auth/register`
- **Body** (JSON):
```json
{
  "email": "test@example.com",
  "password": "Test123!@#",
  "firstName": "Nguyen",
  "lastName": "Van A"
}
```

### 1.2 Login (Đăng nhập)
- **Method**: POST
- **URL**: `http://localhost:3000/api/auth/login`
- **Body** (JSON):
```json
{
  "email": "admin@watchshop.com",
  "password": "Admin123!@#"
}
```
**Response** sẽ chứa `token` - copy token này để dùng cho các requests khác

### 1.3 Logout
- **Method**: POST
- **URL**: `http://localhost:3000/api/auth/logout`
- **Headers**: `Authorization: Bearer YOUR_TOKEN`

---

## 2. Watches/Products APIs

### 2.1 Get All Watches
- **Method**: GET
- **URL**: `http://localhost:3000/api/watches`
- **Query Params** (optional):
  - `page=1`
  - `limit=10`
  - `brand=Rolex`
  - `minPrice=5000`
  - `maxPrice=20000`

### 2.2 Get Single Watch
- **Method**: GET
- **URL**: `http://localhost:3000/api/watches/:id`
- **Example**: `http://localhost:3000/api/watches/1`

### 2.3 Search Watches
- **Method**: GET
- **URL**: `http://localhost:3000/api/watches/search`
- **Query Params**:
  - `q=submariner`
  - `brand=Rolex`

### 2.4 Get Featured Watches
- **Method**: GET
- **URL**: `http://localhost:3000/api/watches/featured`

### 2.5 Get Best Sellers
- **Method**: GET
- **URL**: `http://localhost:3000/api/watches/best-sellers`

---

## 3. Cart APIs
**⚠️ Cần login trước** - Add token vào header

### 3.1 Get Cart
- **Method**: GET
- **URL**: `http://localhost:3000/api/cart`
- **Headers**: `Authorization: Bearer YOUR_TOKEN`

### 3.2 Add to Cart
- **Method**: POST
- **URL**: `http://localhost:3000/api/cart`
- **Headers**: `Authorization: Bearer YOUR_TOKEN`
- **Body** (JSON):
```json
{
  "watchId": 1,
  "quantity": 1
}
```

### 3.3 Update Cart Item
- **Method**: PUT
- **URL**: `http://localhost:3000/api/cart/:itemId`
- **Example**: `http://localhost:3000/api/cart/1`
- **Headers**: `Authorization: Bearer YOUR_TOKEN`
- **Body** (JSON):
```json
{
  "quantity": 2
}
```

### 3.4 Remove from Cart
- **Method**: DELETE
- **URL**: `http://localhost:3000/api/cart/:itemId`
- **Example**: `http://localhost:3000/api/cart/1`
- **Headers**: `Authorization: Bearer YOUR_TOKEN`

### 3.5 Clear Cart
- **Method**: DELETE
- **URL**: `http://localhost:3000/api/cart`
- **Headers**: `Authorization: Bearer YOUR_TOKEN`

---

## 4. Wishlist APIs
**⚠️ Cần login trước**

### 4.1 Get Wishlist
- **Method**: GET
- **URL**: `http://localhost:3000/api/wishlist`
- **Headers**: `Authorization: Bearer YOUR_TOKEN`

### 4.2 Add to Wishlist
- **Method**: POST
- **URL**: `http://localhost:3000/api/wishlist`
- **Headers**: `Authorization: Bearer YOUR_TOKEN`
- **Body** (JSON):
```json
{
  "watchId": 1
}
```

### 4.3 Remove from Wishlist
- **Method**: DELETE
- **URL**: `http://localhost:3000/api/wishlist/:watchId`
- **Example**: `http://localhost:3000/api/wishlist/1`
- **Headers**: `Authorization: Bearer YOUR_TOKEN`

---

## 5. Orders APIs
**⚠️ Cần login trước**

### 5.1 Create Order
- **Method**: POST
- **URL**: `http://localhost:3000/api/orders`
- **Headers**: `Authorization: Bearer YOUR_TOKEN`
- **Body** (JSON):
```json
{
  "items": [
    {
      "watchId": 1,
      "quantity": 1,
      "price": 8500
    }
  ],
  "totalAmount": 8500,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Ho Chi Minh",
    "country": "Vietnam",
    "zipCode": "700000"
  },
  "paymentMethod": "credit_card"
}
```

### 5.2 Get Orders (My Orders)
- **Method**: GET
- **URL**: `http://localhost:3000/api/orders`
- **Headers**: `Authorization: Bearer YOUR_TOKEN`
- **Query Params**:
  - `page=1`
  - `pageSize=10`

### 5.3 Get Single Order
- **Method**: GET
- **URL**: `http://localhost:3000/api/orders/:id`
- **Example**: `http://localhost:3000/api/orders/1`
- **Headers**: `Authorization: Bearer YOUR_TOKEN`

### 5.4 Update Order Status (Admin only)
- **Method**: PUT
- **URL**: `http://localhost:3000/api/orders/:id/status`
- **Example**: `http://localhost:3000/api/orders/1/status`
- **Headers**: `Authorization: Bearer ADMIN_TOKEN`
- **Body** (JSON):
```json
{
  "status": "shipped"
}
```
**Status values**: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

---

## 6. Admin - Users Management
**⚠️ Chỉ Admin mới access được** - Login bằng `admin@watchshop.com`

### 6.1 Get All Users
- **Method**: GET
- **URL**: `http://localhost:3000/api/users`
- **Headers**: `Authorization: Bearer ADMIN_TOKEN`
- **Query Params**:
  - `page=1`
  - `pageSize=10`

### 6.2 Get Single User
- **Method**: GET
- **URL**: `http://localhost:3000/api/users/:id`
- **Example**: `http://localhost:3000/api/users/1`
- **Headers**: `Authorization: Bearer ADMIN_TOKEN`

### 6.3 Create User
- **Method**: POST
- **URL**: `http://localhost:3000/api/users`
- **Headers**: `Authorization: Bearer ADMIN_TOKEN`
- **Body** (JSON):
```json
{
  "email": "newuser@example.com",
  "password": "Pass123!@#",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer"
}
```

### 6.4 Update User
- **Method**: PUT
- **URL**: `http://localhost:3000/api/users/:id`
- **Example**: `http://localhost:3000/api/users/2`
- **Headers**: `Authorization: Bearer ADMIN_TOKEN`
- **Body** (JSON):
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "admin"
}
```

### 6.5 Delete User
- **Method**: DELETE
- **URL**: `http://localhost:3000/api/users/:id`
- **Example**: `http://localhost:3000/api/users/2`
- **Headers**: `Authorization: Bearer ADMIN_TOKEN`

---

## Quick Start Testing Flow

### Bước 1: Login để lấy token
```
POST http://localhost:3000/api/auth/login
Body:
{
  "email": "admin@watchshop.com",
  "password": "Admin123!@#"
}
```

### Bước 2: Copy token từ response
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {...}
  }
}
```

### Bước 3: Add token vào Headers
Trong Postman:
- Tab **Headers**
- Key: `Authorization`
- Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Bước 4: Test các endpoints khác

---

## Response Format
Tất cả responses đều có format:
```json
{
  "success": true,
  "data": {...}
}
```

Hoặc khi có lỗi:
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## Notes
- Backend đang chạy trên port **3000**
- Database có sẵn **50 watches** với IDs từ 1-50
- Admin user: `admin@watchshop.com` / `Admin123!@#`
- Token hết hạn sau 24 giờ
