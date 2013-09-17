package models;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class WorkingSession extends Model {

	private final static SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/yyyy");

	@Required
	public Date start;

	public Date stop;

	@ManyToOne
	@Required
	public Project project;

	public WorkingSession(final Project project) {
		super();
		this.project = project;
		start = project.lastUpdate;
	}

	@Override
	public String toString() {
		return "WorkingSession [start=" + start + ", stop=" + stop + ", project=" + project.id + "]";
	}

	public static Project findStartedProject() {
		final WorkingSession nonStoppedSession = findNonStoppedSession();
		if (nonStoppedSession == null) {
			return null;
		}
		return nonStoppedSession.project;
	}

	public static WorkingSession findNonStoppedSession() {
		return find("byStopIsNull").first();
	}

	public static List<WorkingSession> findByProject(final long projectId) {
		return find("project.id =?", projectId).fetch();
	}

	public String getStartAsStr() {
		return SDF.format(start);
	}

	public float getHours() {
		final long to = (stop == null ? System.currentTimeMillis() : stop.getTime());
		return (to - start.getTime()) / 3600000f;
	}
}
