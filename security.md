# MVT--Phase-2.0
WebApp Security Considerations

## **Purpose:**

This document outlines the security considerations of the WebApp. To improve security through openness and not obscurity.

## **Security Principles:**

Maintain confidentiality, integrity, and availability through the implementation of National Institute of Standards and Technology Cyber Security Framework (NIST CSF) and best practices.

## **Confidentiality:**

1. Implement secure user authentication (federated/directory-based authentication with password policy preferable).
2. Secure communication
    • Use SSL/TLS to encrypt the client-server connection (Obtain SSL/TLS certificate from CA).
    ```
        const express = require('express');
        const https = require('https');
        const app = express();
        const options = {
            // The path should be changed accordingly to your setup
            cert: fs.readFileSync('./sslcert/fullchain.pem'),
            key: fs.readFileSync('./sslcert/privkey.pem')
        };
        https.createServer(options, app).listen(443);
    ```
3. Secure the use of cookies
    ```
        const session = require('cookie-session')
        const express = require('express')
        const app = express()

        const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        app.use(session({
        name: 'session',
        keys: ['key1', 'key2'],
        cookie: {
            secure: true,
            httpOnly: true,
            domain: 'example.com',
            path: 'foo/bar',
            expires: expiryDate
        }
        }))
    ```
4. Enable logging

## **Integrity:**

1. Encrypt data at rest (encrypt AWS RDS database).
2. Implement role based or attribute based app security feature.
3. Use Helmet that protects the app from some well-known web
    vulnerabilities by setting HTTP headers appropriately.
    ```
        const helmet = require('helmet')
        app.use(helmet())
        app.disable('x-powered-by')
    ```
4. Implement user input data validation and sanitization including protection from query injection.

## **Availability:**

1. Prevent brute-force attacks against authorization
Ensure login endpoints are protected to make private data more secure.
A simple and powerful technique is to block authorization attempts using two metrics:
    a. First is number of consecutive failed attempts by the same user name and IP address.
    b. Second is number of failed attempts from an IP address over some long period of time. For example, block an IP address if it makes 100 failed attempts in one day.
2. Implement AWS recommended application DoS services.

## **Treats and Risks:**

1. Use Helmet that protects the app from some well-known web
   vulnerabilities by setting HTTP headers appropriately.
   ```
        const helmet = require('helmet')
        app.use(helmet())
        app.disable('x-powered-by')
    ```
2. Ensure dependencies are secure.
   ```
        $ npm audit
        $ npm install -g snyk
        $ cd your-app
        $ snyk test
        $ snyk wizard
    ```
## **Data Privacy:**

1. Enable data encrypted at rest and in transit.
2. Access to the WebApp will be restricted via secure user authentication.
3. Data access levels (read/write/delete) through the WebApp will be  via role/attribute based access control set by an authorized.administrator.
4. Ability to search for individual PHI record, export and or delete permanantly.

## **Useful Links:**
https://www.nist.gov/cyberframework/framework

https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html

https://compliancy-group.com/hipaa-rules-and-regulations/

https://expressjs.com/en/advanced/best-practice-security.html

https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/commonsecuritybestpractices.md

https://medium.com/@nodepractices/were-under-attack-23-node-js-security-best-practices-e33c146cb87d

https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#login-endpoint-protection


