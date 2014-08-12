# Supermoon (spm)

WARNING: This is a work (of art) in progress. Please don't use.

A hacky, cached top-level npm package installer. Hopefully to become a less hacky npm client. 

Supermoon installs your dependencies in a golbally configured directory, and then links the appropriate versions to your local `node_modules`.

## How is this different from `npm install -g`?

Installing packages globally only allows you to install one version of a package on your system. Supermoon cache holds as many versions as needed.

## Why should I use it?

You should use it if you:

 - Don't care about sub-dependency versions
 - Don't care about shrinkwrap
 - Don't care about publishing packages to a registry
 - Always delete your node_modules and hate waiting for `npm install` to finish.

## Changelog
 - *v0.2.2* - bug fixes
 - *v0.2.1* - bug fixes
 - *v0.2.0*
   - Ability to install dependencies from non-registry URIs (ssh/http/etc..)

 - *v0.1.1* - bug fixes
 - *v0.1.0* - initial release

## TODOs
 - Multiple registries
 - Decouple npm from process.spawn (use programmatically)

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

## LICENSE

Copyright (c) 2014, Aleksey Smolenchuk <lxe@lxe.co>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.


