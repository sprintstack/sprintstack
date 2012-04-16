package com.mowforth.rhinode;

import java.io.IOException;
import java.io.StringReader;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

class JSON {

    public static JSONObject decode(String input) {
        JSONParser parser = new JSONParser();

        try {
            try {
                StringReader reader = new StringReader(input);

                Object obj = parser.parse(reader);
                return (JSONObject)obj;
            } catch (IOException e) { System.out.println(e); return null; }
        } catch (ParseException e) { System.out.println(e); return null; }
    }

}
