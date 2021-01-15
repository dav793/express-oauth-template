# Express OAuth 2.0 Template

A bare-bones secure HTTPS server using OAuth 2.0 authentication over SSL and MongoDB for user data storage.

## How to run:

### 1. Configure Docker environment

Create file `.env` in project root dir and set `ROOT_PATH` to the actual path of this project in your local filesystem.

Example `.env` file:
```bash
ROOT_PATH=/Users/davidvargas/Workspace/express-template-oauth
```

### 2. Run MongoDB Docker container

```bash
docker-compose -f docker-compose.db.yml up
```

This will run a MongoDB instance attached to port `27017`. You can access it using the following credentials:

* username: `root`
* password: `example`

### 3. Set up initial data state

```bash 
scripts/setupDatabase.sh -h localhost -d express-template-auth -u root -p example
```

### 4. Move to Server directory

```bash
cd server
```

### 5. Download project dependencies

```bash
npm install
```

### 6. Configure Server environment

Create file `.env` and set each environment variable to your own values

Example `.env` file:
```bash
HTTPS_PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=27017
DATABASE_NAME=express-template-oauth
DATABASE_USERNAME=root
DATABASE_PASSWORD=example
```

### 6. Run Express HTTPS Server

```bash
npm start
```
