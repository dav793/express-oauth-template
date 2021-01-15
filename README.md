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

### 3. Set up initial database state

```bash
scripts/setupDatabase.sh 
```

### 4. Move to Server directory

```bash
cd server
```

### 5. Download project dependencies

```bash
npm install
```

### 6. Run Express HTTPS Server

```bash
npm start
```
