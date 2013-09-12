package models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import play.Logger;

public class Project {

	public long id;
	public String label;
	public Date lastUpdate;

	private static List<Project> PROJECTS;

	public Project(final long id, final String label) {
		super();
		this.id = id;
		this.label = label;
		this.lastUpdate = new Date();
	}

	@Override
	public String toString() {
		return "Project [id=" + id + ", label=" + label + "]";
	}

	public static List<Project> all() {
		if (PROJECTS == null) {
			PROJECTS = new ArrayList<Project>();
			PROJECTS.add(new Project(1, "Tutt"));
			PROJECTS.add(new Project(2, "Fête de la montagne 2014"));
			PROJECTS.add(new Project(3, "Pro-montagne"));
		}
		return PROJECTS;
	}

	public static Project find(final long id) {
		Logger.debug("Project.find(%s)", id);
		if (id == 0) {
			return new Project(all().size() + 1, "Mon nouveau projet");
		}
		return all().get((int) id - 1);
	}

	public void start() {
		Logger.debug("start %s", this);
		lastUpdate = new Date();
	}

	public void stop() {
		Logger.debug("stop %s", this);
		// -1 sec pour pas avoir la même date que le projet qui starte en même
		// temps
		lastUpdate = new Date(System.currentTimeMillis() - 1000);
	}

}
