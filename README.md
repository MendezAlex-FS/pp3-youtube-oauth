# YouTube Playlist Manipulator

## Project Overview

A full-stack YouTube application that lets users authenticate with Google OAuth and handles YouTube playlists using the YouTube Data API.

## Prerequisites

### Required software

- **Node.js**: v18+ (recommended)  
- **npm**: v9+ (or compatible with your Node version)
- **Git**: latest stable
- **Browser**: Chrome / Edge / Firefox (latest)

### Accounts / Access

- Google Cloud Project with OAuth consent screen configured
- OAuth Client ID + Client Secret
- YouTube Data API enabled in Google Cloud

## Getting Started

1. Clone the repository

    ```bash
    git clone https://github.com/MendezAlex-FS/pp3-youtube-oauth.git
    cd pp3-youtube-oauth
    ```

2. Server setup

   ```bash
   cd server
   npm install
   ```

## Links

### Local Development

- Client: [http://localhost:5173](http://localhost:5173)
- Server: [http://localhost:3000](http://localhost:3000)

### API Examples

- Token Status: GET [http://localhost:3000/api/v1/auth/status](http://localhost:3000/api/v1/auth/status)
- OAuth Start: GET [http://localhost:3000/api/v1/auth/start](http://localhost:3000/api/v1/auth/start)
