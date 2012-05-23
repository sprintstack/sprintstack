# SprintStack

Concurrent + Evented I/O for [Rhino](http://www.mozilla.org/rhino/).

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

Checkout the [https://github.com/sprintstack/sprintstack/wiki](wiki)

### Download

'todo'

You're better off cloning and building from source as it's in a constant state of flux right now... constructive criticism, hate-mail, offers of love, money or patches are all much appreciated.

## License

Copyright (C) 2012 Chris Mowforth

SprintStack is Ddstributed under the MIT license. Various dependencies are distributed under separate licenses. See LICENSE for more.
