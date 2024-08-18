# Part 2 - Data for Countries

## Overview

#### Highlights

### Modules & Exercises

- [Adding styles to React app](https://fullstackopen.com/en/part2/adding_styles_to_react_app)
  - [2.18–2.20](https://fullstackopen.com/en/part2/adding_styles_to_react_app#exercises-2-18-2-20)

## Usage

### Initialization

```shell
# in project root
npm install
```

### Run Application

#### With Weather Functionality

_To enable weather features replace_ <API_KEY> _with an API key from_ https://home.openweather.co.uk/

```shell
# in project root

# Linux/macOS Bash
export VITE_SOME_KEY=<API_KEY> && npm run dev
# Windows PowerShell
($env:VITE_SOME_KEY="<API_KEY>") -and (npm run dev)
# Windows cmd.exe
set "VITE_SOME_KEY=<API_KEY>" && npm run dev
```

#### Without Weather Functionality

_Some features will be broken_

```shell
# in project root
npm run dev -- --host
```

### Clone the directory

```shell
git clone -n --depth=1 --filter=tree:0 \
  git@github.com:p0p4/Fullstack-Open.git
cd Fullstack-Open
git sparse-checkout set --no-cone part2/countries
git checkout
```
