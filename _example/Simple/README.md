Simple Run Setup
================

This application starts the server and website for Simple Python 
Repository. The default port is at `https://domain:9443`.

The application assumes you have ssl files in the same folder. 
To generate the required ssl files, run the following command

```bash
openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.crt -nodes -days 365
```