importClass(com.mowforth.rhinode.dispatch.Dispatch);
importClass(com.mowforth.rhinode.dispatch.IFunction);

function Agent(obj) {

  this.agent = Dispatch.agent(obj);

  this.send = function(msg) {
    var fun = new JavaAdapter(IFunction, {apply: msg});
    this.agent.send(fun);
  }

  this.sendOff = function(msg) {
    var fun = new JavaAdapter(IFunction, {apply: msg});
    this.agent.sendOff(fun);
  }

  this.get = function() {
    return this.agent.get();
  }

  this.await = function() {
    this.agent.await(Dispatch.forever());
  }

  this.stop = function() {
    this.agent.close();
  }

}

var Agents = function() {

  this.newAgent = function(obj) {
    return new Agent(obj);
  }

}

module.exports = new Agents();

