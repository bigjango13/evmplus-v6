# EvMPlus.org v6

The premiere event and unit management site for Civil Air Patrol

Current units running the EventManagement+ suite:

1. [MD001 - Maryland Wing](https://mdwg.evmplus.org/)
2. [MD089 - St. Mary's Composite Squadron](https://stmarys.evmplus.org/)
3. [MD008 - Harford Composite Squadron](https://harford.evmplus.org/)
4. [MD003 - Frederick Composite Squadron](https://frederick.evmplus.org/)
5. [MD079 - Easton Composite Squadron](https://easton.evmplus.org)

## Requirements for building and running

In order to build and run the code for production, you will need Docker and Docker Compose installed. It is highly recommended that Docker BuildKit is used when setting up images.

## Server configuration

This program depends on the following to fully function:

1. [MySQL server](#mysql-setup)
2. [AWS SMTP credentials](#aws-smtp-setup)
3. [AWS DNS credentials](#aws-dns-setup)
4. [Google keys and calendar setup](#google-setup)
5. A [Discord bot token](#discord-bot-setup)
6. [reCAPTCHA keys](#recaptcha-setup)
7. [CAPWATCH credentials](#capwatch-setup)

Each of these sections will require creating files in the keys folder which have just the access token required. After the server is appropriately configured, you should have the following structure in the `keys` folder:

- certbot: Contains certbot configuration, and can be ignored as it is automatically handled
- google-keys:
    - {}.json: A credential file for the service account that is used to handle Google calendar credentials
- aws_access_key_id: AWS SES credentials
- aws_secret_access_key: AWS SES credentials
- capwatch_capid: CAPID of member downloading CAPWATCH files
- capwatch_orgid: ORGID of the organization to download CAPWATCH files for
- capwatch_password: The password of the member who is downloading CAPWATCH information
- db_password: The password for the MySQL database
- db_user: The username for the MySQL database. Currently, can only be `em`
- discord_client_token: The token for managing the Discord bot
- recaptcha_secret: The secret reCAPTCHA key for the server

The `packages/client/.env` file should also have the following content:

    REACT_APP_RECAPTCHA_KEY=your public key here
    REACT_APP_VERSION=$npm_package_version
    REACT_APP_HOST_NAME=your hostname here

`your public key here` and `your hostname here` should be replaced with their respective values

### MySQL setup

Create the files `./keys/db_user` and `./keys/db_password`.  Place the text `em` in the `db_user` file.  Create a new 
database password and place that text in the `db_password` file

### AWS SMTP setup

1. [Acquire AWS credentials](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-your-credentials.html)
2. Manage the IAM user created to allow access to SMTP
3. Store the AWS credentials in `./keys/aws_access_key_id` and `./keys/aws_secret_access_key`

### AWS DNS setup

Only required for setting up SSL keys for HTTPS traffic as opposed to HTTP traffic

1. [Acquire AWS credentials](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-your-credentials.html)
2. [Manage IAM user created to allow access to DNS](https://certbot-dns-route53.readthedocs.io/en/stable/#credentials)
3. [Store the AWS crednetials in `./keys/aws_ssl_keys` according to the documentation](https://certbot-dns-route53.readthedocs.io/en/stable/#config-ini)

### Google setup

1. Service account setup
    1. Go to [the Google Cloud console](https://console.cloud.google.com/)
    2. Create a new project
    3. In the navigation menu, go to 'APIs & Services' -> 'Library'
    4. Find the Google Calendar API, and enable it
    5. In the navigation menu, go to 'IAM & Admin' -> 'Service accounts'
    6. Click 'Create service account' at the top
    7. Give it a name, and give it 'Project Owner' as a role
    8. Don't grant access to any users
    9. Back at the 'Service accounts' page, in the actions menu on the right, click 'Create key'
    10. Select JSON
    11. Save this to the `./keys/google-keys` directory
        - Be sure to name it according to the following format: `${accountID}.json`, where accountID is the ID of the account you will be creating later
2. Google calendar setup
    1. Create a Google calendar
    2. On the calendar, add the service account from before with the ability to 'Manage Events and Sharing'
    3. Copy the ID of this Google calendar, it will be needed for the account setup step later

### Discord bot setup

1. [Create a bot and get its token](https://discordpy.readthedocs.io/en/latest/discord.html).
2. Store this token in the `./keys/discord_client_token`

### reCAPTCHA setup

1. [Create a new site](https://www.google.com/recaptcha/admin/create)
    - Be sure to add your domain
2. Store the provided secret key in `./keys/recaptcha_secret`, e.g. '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
3. Store the public key in `./packages/client/.env`, under the key REACT_APP_RECAPTCHA_KEY, e.g.

    REACT_APP_RECAPTCHA_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI

### CAPWATCH Credentials

1. [Request CAPWATCH download permissions](https://capnhq.gov/cap.capwatch.web/Modules/CapwatchRequest.aspx)
2. Store the ORGID in the `./keys/capwatch_orgid` file, as well as your CAP ID and eServices password in `./keys/capwatch_capid` and `./keys/capwatch_password`, respectively

## Using Command Line Utilities

First, run `docker-compose up -d util-cli`, and keep note of the name of the container created. Then, run `docker attach {container-name}` you will be provided a shell from which you can run different utilities to perform administrative actions. Administrative actions include adding SSL keys for signin tokens, creating accounts, downloading CAPWATCH files, importing CAPWATCH files, and sending global notifications.

By running `docker-compose up -d mysqlsh`, keeping note of the name of the container created, and then running `docker attach {container-name}`, you will be dropped into a mysqlsh session

To import a new CAPWATCH file, run `docker-compose up download_capwatch_update`

## Building and running the server

By running `docker-compose up main`, it will build and start the MySQL database as well as the server itself. To get SSL for HTTPS as well, modify and then run `./init-nginx-ssl.sh` with your email and then use `docker-compose up main proxy` instead.

### Creating an account and supplying it data

From inside the util-cli container [started here](#using-command-line-utilities), you can run the `createAccount.js` file to start the process of creating an account that can be used to process data

### Accessing the site

To access the site, you have to use a domain name that starts with the account ID you used earlier. For instance, to access the `md089` account, you would go to `md089.evmplus.org`.

## Alternatively...

If you are a unit commander or unit IT officer looking to implement this for your squadron, you can instead send an email to `eventsupport@md.cap.gov` to request an official EvMPlus.org website.

This will take advantage of the hosting and support already available, and will allow for cross unit communication with units already established under the EvMPlus.org domain.

CAPWATCH data for all Maryland Wing members and units is already being handled.

There is currently a feature request being worked on which will allow you as a unit commander or unit IT officer to upload your own CAPWATCH data to a evmplus.org hosted unit. [This feature request can be tracked here.](https://github.com/cap-md089/evmplus-v6/issues/48)

## Developing EvMPlus.org

The development requirements for EvMPlus.org are a bit different. The server will require the same configuration and external services as a production system, but the keys and database do not need to be the same.

1. Install required software
    - Node 13
    - Yarn
    - [Commitizen](https://github.com/commitizen/cz-cli)
    - Git
    - [Lerna](https://www.npmjs.com/package/lerna)
    - [TTypescript](https://www.npmjs.com/package/ttypescript) and [Typescript](https://www.npmjs.com/package/typescript)
2. In the project directory, run `lerna bootstrap`
3. The environment should be set up to code
    - To start the webpack development server, go into `packages/client` and run `yarn start` to start developing the client code
    - To develop the server and its sub modules, run `ttsc --build tsconfig.dev.json --watch` in the project folder as well as `yarn start` in `packages/server`
    - The server will need to be started when developing the client