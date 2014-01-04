package models;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import play.data.validation.Required;
import play.db.jpa.Model;
import controllers.Security;

@Entity
public class WorkingSession extends Model {

	private final static SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/yyyy");

	@Required
	public Date start;

	public Date stop;

	public boolean endOfPeriod;

	@ManyToOne
	@Required
	public Project project;

	public long userId;

	public WorkingSession(final Project project, final TuttUser user) {
		super();
		this.project = project;
		this.userId = user.id;
		start = project.lastUpdate;
	}

	@Override
	public String toString() {
		return "WorkingSession [start=" + start + ", stop=" + stop + ", project=" + project.id + "]";
	}

	public static List<WorkingSession> findAllowed() {
		final TuttUser user = Security.connectedUser();
		final List<WorkingSession> all = find("userId = ? order by start desc", user.id).fetch();
		final List<WorkingSession> allowed = new LinkedList<WorkingSession>();
		int count = 0;
		for (final WorkingSession session : all) {
			if (user.projects.contains(session.project)) {
				allowed.add(session);
				count++;
				if (count == 20) {
					break;
				}
			}
		}
		return allowed;
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
		return find("project.id =? and userId = ? order by start desc", projectId, Security.connectedUser().id).fetch();
	}

	public String getStartAsStr() {
		return SDF.format(start);
	}

	public float getHours() {
		final long to = (stop == null ? System.currentTimeMillis() : stop.getTime());
		return (to - start.getTime()) / 3600000f;
	}
}
