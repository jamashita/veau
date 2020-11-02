# Veau

![](images/screenshot.png)

## For developers

### Run in development mode

#### Prerequirement

docker is required.  
if you haven't installed docker for desktop, install it first.

1. run `yarn install`
1. move to `deployment/development` directory
1. run `docker-compose up -d` to run mysql and redis in docker
1. move to root directory in this project
1. build the app by running `yarn build`
1. run `yarn watch`
1. access `http://localhost:4000` and you will see the app login page
1. the account and password are already provided, please see the *Account and Password* section.

## License

[MIT](LICENSE)