package com.mowforth.rhinode.core;

import java.util.Hashtable;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;

public class IDNS {

    private static DirContext provider;

    private static void setupProvider() {
        Hashtable<String,String> env = new Hashtable<String, String>();
        env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");
        try {
            provider = new InitialDirContext(env);
        } catch (NamingException e) { System.out.println(e); }
    }

    public static String[] resolve(String domain, String record) {
        if (provider == null) setupProvider();

        try {
            Attributes query = provider.getAttributes(domain, new String[] { record });
            Attribute records = query.get(record);
            NamingEnumeration recordData = records.getAll();
            int size = records.size();
            String[] data = new String[size];
            int i = 0;

            while (i < size) {
                data[i] = recordData.next().toString();
                i++;
            }

            return data;
        } catch (NamingException e) {
            System.out.println(e);
            return null;
        }
    }
}
