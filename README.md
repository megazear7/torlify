# Torlify

A book maker

## Prerequisites

1. [git](https://git-scm.com/)
1. [nvm](https://www.nvmnode.com/guide/installation.html)
1. [node](https://nodejs.org/en)

## Getting Started

You can simply run the below command to get started or follow the (slightly) longer steps below.

```sh
curl -s https://raw.githubusercontent.com/megazear7/torlify/refs/heads/main/init.sh -o init.sh && chmod 744 init.sh && ./init.sh
```

Or the slightly longer version:

```sh
git clone https://github.com/megazear7/torlify.git
cd torlify
nvm use 22
npm run init
npm start
```

The cli will ask you a series of questions to initialize your system for running Torlify.
You need to have a text model provider and an audio model provider with urls and api keys ready.
Once complete, the `.env` file and the `data/app/index.json` files will be created and you
can run Torlify with `npm start`. You can also refer to the example files that are provided
if you want to set it up manually.

## Install

```sh
npm install
```

## Run

```sh
npm start
```

## Build

```sh
npm run build
```

## Fix & Lint

```sh
npm run lint
npm run fix
```
