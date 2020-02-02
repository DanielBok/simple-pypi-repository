Simple PyPi Repository
======================

An application to store your python packages with minimal setup and basic features.

## Getting started

The recommended way to use the application is to take run the `docker-compose.yaml` file provided and run it as is.
If you need to add additional items, write a `docker-compose.[extra].yaml` where `[extra]` is any name you'd like.
Then run the compose files together.

Most settings can be put in via environment variables. A list of the important ones will be covered below

### Custom configurations 

Table to show list of important environment variables

## Key features

### Account registration

### Uploading packages

### Installing packages via pip

### Creating authorization tokens to protect packages

## Acknowledgements

This [blog](https://pydist.com/blog/pip-install) here gives a good description of how pip works behind the scenes.
The long and short of it is that when a pip install is executed, it will find try to find a HTML page with all the
information. If it does, it will download the package with the link provided and install it.

Here's a quick list of what happens:

1. `pip install package_name`
2. pip looks at all index that it is provided for a `/simple/package_name` web page
    1. The web page in it should contain a list of download links. A sample link: 
    `<a href="link/to/package">package_version.whl</a>` 
    2. The name of the link contains all the meta information that is required such as its version, platform, 
    whether it's a binary or needs to built from source, python implementation and version it is good for, etc.
3. After looking at all the links, pip downloads the latest package that is good for the python version that the user
    has. If the user specifies a version with `pip install package==0.1`, pip will look for a direct version match
4. If a match is found, download and install package along with its dependencies
