# aws-backend-node
AWS Backend Node

All tasks are completed
Please check following urls: 
GET - https://8ak9gfcgg4.execute-api.eu-west-1.amazonaws.com/dev/swagger
GET - https://8ak9gfcgg4.execute-api.eu-west-1.amazonaws.com/dev/swagger.json
GET - https://0i8erly05h.execute-api.eu-west-1.amazonaws.com/products
GET - https://0i8erly05h.execute-api.eu-west-1.amazonaws.com/products/{productId}

Additional:
Async/await is used in lambda functions
ES6 modules are used for Product Service implementation
Custom Webpack/ESBuild/etc is manually configured for Product Service. Not applicable for preconfigured/built-in bundlers that come with templates, plugins, etc.
SWAGGER documentation is created for Product Service
Lambda handlers are covered by basic UNIT tests (NO infrastructure logic is needed to be covered)
Lambda handlers (getProductsList, getProductsById) code is written not in 1 single module (file) and separated in codebase.
Main error scenarios are handled by API ("Product not found" error). Also Invalid Product ID is taken care


Import Service

GET - https://e9xyxn31if.execute-api.eu-west-1.amazonaws.com/dev/import
GET - https://l3ivbfh22k.execute-api.eu-west-1.amazonaws.com/swagger
GET - https://l3ivbfh22k.execute-api.eu-west-1.amazonaws.com/swagger.json