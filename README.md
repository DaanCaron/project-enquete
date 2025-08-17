# Project Enquête

A highly customized fullstack application built specifically for [Droomelaer](https://www.droomelaer.be) to run surveys on a particular iPad model.

## About

- Not a plug-and-play tool — tailored to specific hardware and company workflows.
- Built with **React**, **Express**, and **WebSocket** for real-time communication.
- Code shared here to demonstrate **fullstack development** and **WebSocket integration** skills.
- Setup is different for each device so manual edits are required.

 ---

# Setup

- Ensure the device (PC or laptop) has a **static IP address**, as this application runs entirely in a standalone environment.


## Required Software

#### Node.js
Make sure to install [Node.js](https://nodejs.org/en/download)  

```bash
# Check Node version
node -v
# Expected: v20.18.0 or later

# Check npm version
npm -v
# Expected: 11.0.0 or later
```
---

#### PostgreSQL

Make sure to also install [PostgreSQL](https://www.postgresql.org/download/)

- Only database is required, pgadmin is optional
- Make sure to temporarily save the username and password you filled in
- keep port default (5432)


## Install all libraries
### npm install
- Do `npm install` in the root directory
- Do `npm install` in the directory `/frontend`
- Do `npm install` in the directory `/backend`
- Do `npm install` in the directory `/websocket`

eg:
```bash
C:\Users\[username]\...\project-enquete\backend> npm install
```

## Create .env files

#### Frontend
- Create a .env file in directory `frontend/.next/standalone`
- Add all necessary environment variables (e.g., API URLs, ports).

Required variables
```bash
NEXT_PUBLIC_API_URL=http://ipAddressOfComputer:8000
NEXT_PUBLIC_SOCKET_SERVER=ws://ipAddressOfComputer:4000
```

---

#### Backend
- Create a .env file in directory `backend`
- Add all necessary environment variables (e.g., API URLs, ports).
- Replace username and password with the previously mentioned credentials

Required variables
```bash
DATABASE_URL="postgresql://UserName:Password@localhost:5432/postgres?schema=enquete"
```

--- 

## Database setup

- open a terminal in the folder backend (terminal must read: `C:\Users\[username]\...\project-enquete\backend>`)
- do the following commands to initialise the database

```bash
#sets up database
npx prisma migrate deploy

#ensures express code can use prisma things
npx prisma generate
```

## Build the services

run `service.js`

click yes on all popups (there are a lot), this will create windows services from the code and makes sure it launches on reboot.

```bash
C:\Users\[username]\...\project-enquete> node service.js
```


## usefull commands
### Windows commands

to stop the windows services open a new terminal with admin preivelages
```bash
#stop
C:\WINDOWS\system32>net stop frontend
C:\WINDOWS\system32>net stop backend
C:\WINDOWS\system32>net stop websocket

#start
C:\WINDOWS\system32>net start frontend
C:\WINDOWS\system32>net start backend
C:\WINDOWS\system32>net start websocket
```

