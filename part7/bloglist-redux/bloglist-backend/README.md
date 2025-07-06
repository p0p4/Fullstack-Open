# Part 4 - Blog List Backend

## Overview

#### Highlights

### Modules & Exercises

- [Structure of backend application, introduction to testing](https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing)
  - [4.1–4.2](https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2)
  - [4.3–4.7](https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-3-4-7)
- [Testing the backend](https://fullstackopen.com/en/part4/testing_the_backend)
  - [4.8–4.12](https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12)
  - [4.13–4.14](https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-13-4-14)
- [User administration](https://fullstackopen.com/en/part4/user_administration)
- [Token authentication](https://fullstackopen.com/en/part4/token_authentication)
  - [4.15–4.23](https://fullstackopen.com/en/part4/token_authentication#exercises-4-15-4-23)

## Usage

> [!NOTE]
> To run this project, the user must have a working database and properly configured environment variables. For more details, please refer to the exercises above.

### Run Application

_Needs to be running for_ [Blog List Frontend](../../part5/bloglist-frontend/) _from_ [Part5](../../part5/) _to work_

```shell
# in project root
npm install
npm start
```

### Other Run Methods

#### Dev Mode

```shell
# in project root
npm run dev -- --host
```

#### Test Mode

_Needed for_ [Playwright](../../part5/Playwright) _from_ [Part5](../../part5) _when running tests_

```shell
# in project root
npm run start:test
```

### Run tests

_Avoid running all test files in parallel, specify one at a time..._

```shell
# in project root
npm test tests/blog_api.test.js
```

### Clone the directory

```shell
git clone -n --depth=1 --filter=tree:0 \
  git@github.com:p0p4/Fullstack-Open.git
cd Fullstack-Open
git sparse-checkout set --no-cone part5/bloglist-frontend
git checkout
```
