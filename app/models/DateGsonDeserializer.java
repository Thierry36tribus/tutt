package models;

import java.lang.reflect.Type;
import java.util.Date;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;

public class DateGsonDeserializer implements JsonDeserializer<Date> {

	@Override
	public Date deserialize(final JsonElement jsonElement, final Type type, final JsonDeserializationContext context)
			throws JsonParseException {
		return new Date(jsonElement.getAsLong());
	}

}
