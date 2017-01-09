# UI Config Project

The User Interface Configuration Tool is designed to promote VOD and Guide events on the LaBox home screen.

## Insatallation

## Routing VOD API

In 'httpd.conf' file do following changes:

ProxyPass /ondemand/api http://10.251.51.10:9001/vodIpService
ProxyPassReverse /ondemand/api http://10.251.51.10:9001/vodIpService

Please note - this is WB4 URL's


## Usage
