package controllers;

import play.mvc.With;

@With(Secure.class)
@Check("administrator")
public class Projects extends CRUD {

}
