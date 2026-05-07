# API Plan — Snapmart (Week 3)

This file outlines the basic API endpoints and payload ideas for the starter scaffold.

Auth
- POST /api/auth/register — { name,email,password }
- POST /api/auth/login — { email,password }

Products
- GET /api/products — list
- GET /api/products/:id — details

Cart
- GET /api/cart — get current user's cart
- POST /api/cart — update cart items

Orders
- POST /api/orders — create order
- GET /api/orders — list orders for user/admin

Notes: Endpoints are placeholders; authentication and validation will be introduced in later weeks.
