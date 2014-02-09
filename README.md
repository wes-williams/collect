# Collect

Remove barriers to experimenting with new data sources.

## What? 

A non-intimidating, personal sandbox with the following features.

  1. Central access to data sources through [**Mozilla Persona**](http://www.mozilla.org/en-US/persona/)
  2. Simple configuration of new data sources
    * JSON
  3. Eliminate the burden of auth
    * Declaration driven
    * Support common methods
      * OAuth 1.0
      * OAuth 2.0
      * API Key 
  4. Expose API endpoints through a common interface
    * Convention driven
    * Read only (GET)
  5. Support scriptable, composite endpoints
    * Javascript
  6. Provide a short-lived datastore 
    * Personal 
    * Ingest data on request
    * Query ingested data on request
    * Purge on a schedule

## Where?

Personal setup on the [**OpenShift**](https://www.openshift.com) PAAS 

## How?

### Get setup on OpenShift

  1. Make a fork of this repository

  2. Create an application on openshift
  ~~~~~~~~~~
  rhc app create <APPNAME> nodejs-0.6 mongodb-2.2
  ~~~~~~~~~

  3. Pull your fork into this application
  ~~~~~~~~~
  cd <APPNAME>
  git remote add github -m master git@github.com:<YOUR-FORK-OF-THIS-REPO>.git
  git pull -s recursive -X theirs github master
  ~~~~~~~~~

  4. Change references from proxy on dataupco to match your app and domain
  ~~~~~~~~~
  find . -name "*.*" -exec grep "proxy" {} \; -print
  vi persona-config.js // change proxy-dataupco
  vi passport-config.js // change proxy-dataupco
  vi server.js // change proxy in db setup to your app name
  git commit -am "changed proxy-dataupco references"

  5. Make a branch of develop that will remain private
  ~~~~~~~~~~
  git branch secret
  git checkout secret
  ~~~~~~~~~~

  6. Edit config and credentials for your data sources.
  ~~~~~~~~~~~
  vi passport-config.js
  git commit -am "Edited accounts. KEEP SECRET."
  ~~~~~~~~~~~

  7. Deploy secret branch to openshift
  ~~~~~~~~~~~~~
  git push origin secret:master
  ~~~~~~~~~~~~~
