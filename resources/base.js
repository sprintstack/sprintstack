importPackage(java.lang);

var Base = function() {

  this.print = function(str) {
    System.out.println(str);
  }

  this.alert = function(text) {
    javax.swing.JOptionPane.showMessageDialog(null, text);
  }

}

module.exports = new Base();

