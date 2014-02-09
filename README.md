# Collect

Remove barriers to experimenting with new data sources.

 * [**What**](#what) are the intentions of this project?
 * [**Where**](#where) will I use it?
 * [**How**](#how) can I get started?
   * [**Setup**](#how-openshift) on Openshift
   * [**Configure**](#how-configure) data sources
   * [**Access**](#how-access) data sources
   * [**Ingest**](#how-ingest) data sources
   * [**Query**](#how-query) data sources

## What? ## {#what}

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

## Where? {#where}

Personal setup on the [**OpenShift**](https://www.openshift.com) PAAS 

## How? {#how}

### Get setup on OpenShift {#how-openshift}

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

  6. Edit config and credentials for your data sources. See how [**here**](#how-configure).
  ~~~~~~~~~~~
  vi passport-config.js
  git commit -am "Edited accounts. KEEP SECRET."
  ~~~~~~~~~~~

  7. Deploy secret branch to openshift
  ~~~~~~~~~~~~~
  git push origin secret:master
  ~~~~~~~~~~~~~

### Configure Data Sources {#how-configure}

  1. Configure applications at data source as applicable
    * Creation applications to use
    * Provide callback url for Oauth 
  2. See examples in passport-config.js for each auth type

### Use Data Sources {#how-access}

 1. Login with Persona at https://<YOUR-APP>.rhcloud.com
 2. Change url to https://<YOUR-APP>.rhcloud.com/auth/`{dataSource}` (Oauth only)
   * Authorize application to access data
 3. Change url to https://<YOUR-APP>.rhcloud.com/api/`{dataSource}`/ (Default Path)
 4. Change url to https://<YOUR-APP>.rhcloud.com/api/`{dataSource}`/`any/valid/get/path`

### Ingest Data Sources {#how-ingest}

 1. Change url to https://<YOUR-APP>.rhcloud.com/ingest/`{dataSource}`/`any/valid/get/path`

### Query Data Sources {#how-query}

 1. Experiment with the url after https://<YOUR-APP>.rhcloud.com
   * /query
   * /query?_meta.api=`{dataSourceName}`
   * /query?_meta.api=`{dataSourceName}`&`{some.path.to.match}`=`{value}`
 2. Experiment with operators (~op) after the query parameter names
   * /query?_meta.api=`{dataSourceName}`&`{some.path.to.match}`~`{operator}`=`{value}`
       | Operator | Description | Example |
       | -------- | ----------- | ------- |
       | ~eq | Equal (Default) | name~eq=abc |
       | ~ne | Not Equal | name~ne=abc |
       | ~gt | Greater Than name~gt=123 |
       | ~gte | Greater Than or Equal | name~gte=123 |
       | ~lt | Less Than | name~lt=123 |
       | ~lte | Less Than or Equal | name~lte=123 |
       | ~re | Regular Expression | name~re=[abc]+ |
       | ~rei | Regular Expression (Case Insensitive) | name~rei=[abc]+ |
       | ~in | In list separated by ~ | name~in=abc~cde~fgh |
       | ~nin | Not In list separted by ~ | name~nin=abc~cde~fgh |

