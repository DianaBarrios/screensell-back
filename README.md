# Screensell - API

This web application will help Screen Sell to grow and not be limited by their offline sales. It will allow them to have an online presence with profits and a bigger reach. Clients will be able to find any screen they need and place their order easily.

## Installation

Install dependencies with:
```bash
npm install
npm start
```


## Endpoints

### Admin: 
```
/admin/                   GET - Endpoint used to get all admins
/admin/:id                GET - Endpoint used to get admin by id
---
/admin/new                POST - Endpoint used to create new admins
/admin/login              POST - Endpoint used to create a new session
--
/admin/:id                PATCH - Endpoint used to edit admin
```

### User: 
 
```
/user/                     GET - Endpoint used to get all users
/user/:id                  GET - Endpoint used to get user by id
/user/validate             GET - Endpoint to validate session token 
---
/user/new                  POST - Endpoint used to create new users
/user/login                POST - Endpoint used to create a new session
--
/user/:id                  PATCH - Endpoint used to edit 
/user/:id/owns             PATCH - Endpoint used to edit user products array
```


### Orders: 
 
```
/order/                     GET - Endpoint used to get all orders
/order/status/:status       GET - Endpoint used to get orders by status
/order/:id                  GET - Endpoint used to get orders by id
/order/byUser/:user         GET - Endpoint used to get orders by user
--
/order/new                  POST - Endpoint used to create a new order
--
/order/:id                  PATCH -Endpoint used to edit order
```

### Products: 
 
```
/product/                    GET - Endpoint used to get all the products
/product/getid/:id           GET - Endpoint used to get products by id
/product/:name               GET - Endpoint used to get product by name
/product/:name               GET - Endpoint used to get product by name
/product/getResult/:q        GET - Endpoint used to find products by term 
-- 
/product/new                 POST - Endpoint used to create a new product
--
/product/:id                 DELETE - Endpoint used to delete a product
```
### Reviews: 
 
```
/review/                     GET - Endpoint used to get all the reviews
/review/byProduct/:product   GET - Endpoint used to get reviews by product
--
/review/new                  POST - Endpoint used to create a new review
--
/review/:id                  DELETE - Endpoint used to delete reviews

```

### AWS: 
 
```
/aws/upload                  POST - Endpoint used to upload images to  aws
```

### Mail: 
 
```
/mail                        POST - Endpoint used to send emails 
```

## Team
* Alicia Cisneros A01281991 
* Diana Barrios A00819792
