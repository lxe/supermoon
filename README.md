# Supermoon (spm)

 > WARNING: This is a work (of art) in progress. Please don't use in production.

A cached top-level npm package installer. Makes `npm install`ing your dependencies super-fast! Hopefully to become a less hacky npm client.

Supermoon installs your dependencies in a golbally configured directory, and then links the appropriate versions to your local `node_modules`.

## How is this different from `npm link` or `npm install -g`?

Installing or linking packages globally only allows you to install one version of a package on your system. Supermoon cache holds as many versions as needed.

## Why should I use it?

You should use it if you:

 - Don't care about sub-dependency versions
 - Don't care about shrinkwrap
 - Don't care about publishing packages to a registry
 - Always delete your node_modules and hate waiting for `npm install` to finish.

## Installation
```
npm install -g supermoon
```

## Usage
Currently all supermoon does is installs the top-level dependencies in your `package.json`. Instead of running `npm install` in your node project, run:

```
spm install
```

instead.

Supermoon will install and cache your top-level dependencies.

## Configuration
`~/.supermoonrc.json`:

 - `registry` - npm registry to use. Is not used at this point.
 - `tmpdir` - temp staging directory to termporary install pacakges and other artifacts. (default is `~/.supermoon/tmp`)
 - `cachedir` - dir to hold the local package repository. (default is `~/.supermoon/packages`)
 - `link` - set to true if you would like to symlink the packages out of the cache to your project's node_modules folder instead of copying them.

## Changelog

- *v1.1.0*
  - using graceful-fs to avoid EMFILE errors

- *v1.0.0*
  - 1-oh? why not?!
  - bugfix: make sure fail() is only called once
  - add async concurrency limiter and cprf
  - using ~/.npmrc default registry
  - add long stack traces

- *v0.3.2*
  - No longer linking by default. Copying instead (slower). Use `--link=true` to link.

- *v0.3.1*
  - linking package fix. (I really need to write tests for this thing).

- *v0.3.0*
  - properly installing binary links to node_modules/.bin
  - changed url encoding scheme for non-registry package versions

- *v0.2.4*
  - fixed semver verification for packages downloaded from both registry and non-registry sources
  - performing cleanup upon initialization, and no longer intercepting uncaughtExceptions
  - color npm output!

- *v0.2.3* - bug fix: installing devDependencies

- *v0.2.2* - bug fixes

- *v0.2.1* - bug fixes

- *v0.2.0*
  - Ability to install dependencies from non-registry URIs (ssh/http/etc..)

- *v0.1.1* - bug fixes

- *v0.1.0* - initial release

## TODOs

 - Tests!
 - Better error handling
 - Multiple registries
 - Decouple npm from process.spawn or even remove altogether
 - Cache and detect cached sub-dependencies


## LICENSE

ISC

