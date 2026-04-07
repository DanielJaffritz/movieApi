# movieApi

a movie api structure to request movies and add them to watchlists

## Getting Started

### Installation

clone the repo

```bash
git clone https://github.com/DanielJaffritz/CashFlow.git
```

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

the app will run on port 5001 by default

It is recommended to use an api client like [requestly](https://requestly.com/) if you dont want to make a whole frontend for it
>make sure to get the enviromental variables needed based on the example.env file

### End points

registration:

- POST {localhost_port}/auth/register, (you need pass a body with username, email and password)
- POST {localhost_port}/auth/login, (you need to pass a body with email and password)
- POST {localhost_port}/auth/logout.

watchlistitem:

- POST {localhost_port}/watchlists/ (you need to pass a body with at least a movie id, you can also pass the status, notes on the movie and rating),
- PUT {localhost_port}/watchlists/:id (you need to pass the watchlist item id in the url, and the data you want to change in the body),
- DELETE {localhost_port}/watchlists/:id (you need to pass the watchlists item id in the url)

### Stack used

- [nodejs](https://nodejs.org)
- [express.js](https://expressjs.com/)
- [neon database](https://neon.com/)
