package models;

import java.util.Date;

import javax.persistence.Entity;

import play.Logger;
import play.data.validation.MaxSize;
import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Project extends Model {

	@MaxSize(255)
	@Required
	public String label;

	public Date lastUpdate;

	public Project(final String label) {
		super();
		this.label = label;
		lastUpdate = new Date();
	}

	@Override
	public String toString() {
		return "Project [id=" + id + ", label=" + label + "]";
	}

	public void start() {
		Logger.debug("start %s", this);
		lastUpdate = new Date();
		save();
		final WorkingSession session = WorkingSession.findNonStoppedSession();
		if (session != null) {
			session.project.stop();
		}
		final WorkingSession newSession = new WorkingSession(this);
		newSession.create();
	}

	public void stop() {
		Logger.debug("stop %s", this);
		final WorkingSession session = WorkingSession.findNonStoppedSession();
		// TODO check que c'est le bon projet ?
		session.stop = new Date();
		session.save();
		// -1 sec pour pas avoir la même date que le projet qui starte en même
		// temps
		lastUpdate = new Date(System.currentTimeMillis() - 1000);
		save();
	}

}
