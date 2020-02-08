Simple PyPI Repository
======================

Simple PyPI Repository (SPR) is an application for users to share Python
packages in an internal corporate environment. 

### Use this when

You need to upload and share your python packages with your colleagues
in an internal network.

You need to protect your packages, allowing only people with a 
token to download the package.

### Don't use this when

You can upload and download your packages straight from

## Usage

Run the docker-compose.yaml file as seen in the [Simple Example]([_example/Simple/docker-compose.yml](https://github.com/DanielBok/simple-pypi-repository/tree/master/_example/Simple)) 
for an idea on how to initiate the application.

We assume the backend server is running at http://spr-host:9090 
henceforth.

### Uploading packages

You can use [twine]() to upload your packages as per normal. It is
recommended to add SPR to your `.pypirc`. An example where SPR is 
named as `internal` is provided below.

```
[distutils]
index-servers =
        pypi
        testpypi
        internal

[pypi]
username: PyPI-Username
password: PyPI-Password

[internal]
repository: http://spr-host:9090/simple
username: test-account
password: password
```

Assuming you have a package called `pokedex`, you can upload the 
package with the following command.

```bash
twine upload -r internal pokedex-0.0.1-py3-none-any.whl
```

### Downloading Packages

To install packages, your users can do a standard `pip install`. The 
only difference is that they'll have to add the extra repository to
install from as follows.

```bash
pip install --extra-index-url http://spr-host:9090/simple pokedex
```

If you have set the package as private, the user will need to install
the package with a token.

```bash
pip install --extra-index-url http://<user-token>@spr-host:9090/simple pokedex
```
