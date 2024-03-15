# Instagram non followers checker

## Overview

This project is a simple web application that allows users to check for Instagram non-followers. It provides a convenient way to identify users who don't follow you back on Instagram.

## Getting Started
To get started with the Instagram Non-Followers Checker, follow these steps:

- Clone the Repository:

```bash
git clone https://github.com/iamsuryasonar/instagram_analytic.git
```
- Install Dependencies:

```bash
cd frontend
# or
cd backend

npm install
```

- Run the Application:

```bash
# frontend
npm run dev
# http://localhost:5173/
# backend
npm run dev
```

## Instructions:

- Download followers data from instagram
    - go to 'Your Activity' in instagram
    - go to 'Download your information'
    - go to 'Download or transfer information'
    - go to 'Some of your information'
    - select 'Followers and following' then click next
    - select 'Download to device' and click 'Next'
    - filter 'Format' to JSON
    - Click 'Create files'
    - Now the JSON file will be available in 'Download your information' section
    - Download it.
- Upload the JSON to this app and check your non-followers. 


## What does it do:

This app filters out the users that you follow but they don't.