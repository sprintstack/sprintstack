# SprintStack

Concurrent + Evented I/O for [Rhino](http://www.mozilla.org/rhino/).

[![Build Status](https://travis-ci.org/sprintstack/sprintstack.png)](https://travis-ci.org/sprintstack/sprintstack)

## Getting started

To run SprintStack, you'll need >= JDK 7. To build, you'll need ant.

### Build

    git clone git@github.com:sprintstack/sprintstack.git
    cd sprintstack
    ant jar

### Run

Add bin/SprintStack to your $PATH

    export PATH=$PATH:{your path}/sprintstack/bin

...and run:

    sprintstack

to load up a REPL (JLine support has been removed for now; multiline statements are OK but you might want to install `rlwrap` for more comfort).

### Getting started

Check out the [wiki](https://github.com/sprintstack/sprintstack/wiki) for more information.

## License

Copyright (C) 2012 Chris Mowforth

SprintStack is Distributed under the MIT license. Various dependencies are distributed under separate licenses. See LICENSE for more.
