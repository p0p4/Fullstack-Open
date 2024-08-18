# Part 5 - Blog List End To End Testing

## Overview

#### Highlists

### Modules & Exercises

- [End to end testing: Playwright](https://fullstackopen.com/en/part5/end_to_end_testing_playwright)
  - [5.17–5.23](https://fullstackopen.com/en/part5/end_to_end_testing_playwright#exercises-5-17-5-23)

## Usage

### Initialization

```shell
# in project root
npm install
```

### Run tests

_Both the backend and frontend of Blog List need to be running for Playwright tests._
_Follow the guide for_ [Blog List Backend](../../part4/bloglist-backend/) _from_ [Part4](../../part4/) _to start the backend in_ **test mode** _and the guide for_ [Blog List Frontend](../bloglist-frontend/) _from_ [Part5](../) _to run the application._
_Once both are running correctly, continue with the following..._

```shell
# in project root
npm test
# for report
npm run test:report
```

### Clone the directory

```shell
git clone -n --depth=1 --filter=tree:0 \
  git@github.com:p0p4/Fullstack-Open.git
cd Fullstack-Open
git sparse-checkout set --no-cone part5/playwright
git checkout
```
