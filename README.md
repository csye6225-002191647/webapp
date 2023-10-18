## Getting Started
These instructions will help you set up and deploy the web application locally. hello
 
### Installation
- Clone the organization repo using: git clone PATH
- Change to server directory: cd server
- Install NodeJs dependencies: npm i
- Create a .env file and add the following variables POSTGRES_PORT, POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASS
- Start the server: npm start
 
### Application contains the following endpoints
- GET /healthz - To check the health of the webapp
- POST /v1/assignments - To create a new assignment
- GET /v1/assignments - To receive all assignments information
- GET /v1/assignments/:id - To receive assignment information
- PUT /v1/assignments/:id - To update assignment information
- DELETE /v1/assignments/:id - To delete assignment information