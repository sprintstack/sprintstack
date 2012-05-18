package com.sprintstack.core;

import java.util.Hashtable;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;

public class IDNS {

    public static class DNSResult implements NamingEnumeration {

        private NamingEnumeration data;

        public void setEnumeration(NamingEnumeration e) { data = e; }

        public void close() {}

        public boolean hasMore() { return false; }

        public boolean hasMoreElements() { return false; }

        public Object next() {
            try {
                return data.next();
            } catch (NamingException e) { return null; }
            catch (java.util.NoSuchElementException e) { return null; }
        }

        public Object nextElement() {
            return null;
        }

    }

    private static DirContext provider;

    private static void setupProvider() {
        Hashtable<String,String> env = new Hashtable<String, String>();
        env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");
        try {
            provider = new InitialDirContext(env);
        } catch (NamingException e) { System.out.println(e); }
    }

    public static DNSResult lookup(String domain, String record) {
        if (provider == null) setupProvider();

        try {
            Attributes query = provider.getAttributes(domain, new String[] { record });
            Attribute records = query.get(record);
            NamingEnumeration recordData = records.getAll();
            DNSResult r = new DNSResult();
            r.setEnumeration(recordData);
            return r;
        } catch (NamingException e) {
            System.out.println(e);
            return null;
        }
    }

}
