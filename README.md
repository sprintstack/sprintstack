# rhinode

node.js on Java, courtesy of [Rhino](http://www.mozilla.org/rhino/).

## Getting started

To run rhinode, you'll need >= JDK 7. To build, you'll need ant.

### Build

    git clone git@github.com:m0wfo/rhinode.git
    cd rhinode
    ant jar

### Run

Add bin/rhinode to your $PATH

    export PATH=$PATH:{your path}/rhinode/bin

...and run:

    rhinode

to load up a REPL (note, multiline statements aren't supported at present).

### Download

Download the latest prebuilt jar [here](https://github.com/downloads/m0wfo/rhinode/rhinode.jar).

Rhinode is very alpha-ish at the moment; you're better off cloning and building from source as it's in a constant state of flux right now... constructive criticism, hate-mail, offers of love, money or patches are all much appreciated.

## License

Copyright (C) 2012 Chris Mowforth

Distributed under the MIT license. See LICENSE for more.
