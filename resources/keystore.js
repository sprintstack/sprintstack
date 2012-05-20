importClass(java.security.KeyStore);
importClass(javax.net.ssl.SSLContext);
importClass(javax.net.ssl.KeyManagerFactory);
importClass(javax.net.ssl.TrustManagerFactory);
importClass(java.io.FileInputStream);
importClass(java.lang.System);


var setup = function(path) {
  var keystore = KeyStore.getInstance(KeyStore.getDefaultType());
  var fis = new FileInputStream(path);
  System.out.println("Enter passphrase for keystore:");
  var password = System.console().readPassword();
  try {
    keystore.load(fis, password);
  } catch (e) {
    System.out.println("Invalid passphrase.");
    fis.close();
    return setup(path);
  }
  fis.close();
  
  var kmf = KeyManagerFactory.getInstance('SunX509');
  var tmf = TrustManagerFactory.getInstance('SunX509');

  kmf.init(keystore, password);
  tmf.init(keystore);

  System.out.println("Keystore successfully loaded.");

  var context = SSLContext.getInstance("TLSv1");
  context.init(kmf.getKeyManagers(),
              tmf.getTrustManagers(), null);

  return context;
};

exports.setup = setup;
