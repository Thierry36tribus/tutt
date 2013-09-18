package controllers;

import models.TuttUser;

public class Security extends Secure.Security {

	static boolean authentify(final String username, final String password) {
		if (TuttUser.count() == 0) {
			return true;
		}
		final TuttUser user = TuttUser.find("byLoginAndPassword", username, password).first();
		return user != null;
	}

	public static TuttUser connectedUser() {
		return TuttUser.find("byLogin", connected()).first();
	}

	static boolean check(final String profile) {
		if ("administrator".equals(profile)) {
			return (connectedUser().login.equals("lechaman"));
		}
		return true;
	}
}
