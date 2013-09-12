package controllers;

import models.Project;
import models.WorkingSession;
import play.Logger;
import play.mvc.Controller;

import com.google.gson.Gson;

public class Application extends Controller {

	public static void index() {
		render();
	}

	public static void all(final boolean started) {
		if (started) {
			renderJSON(WorkingSession.findStartedProject());
		} else {
			renderJSON(Project.all().fetch());
		}
	}

	public static void find(final long projectId) {
		renderJSON(Project.findById(projectId));
	}

	public static void delete(final long projectId) {
		Logger.debug("delete(%s)", projectId);
		Project.findById(projectId)._delete();
		ok();
	}

	public static void create(final String body) {
		Logger.debug("create, body = %s", body);
		if (body == null || body.length() == 0) {
			ok();
		}
		// TODO check unicité label
		final Project project = new Project(body);
		project.save();
		ok();
	}

	public static void post(final String body, final boolean start, final boolean stop) {
		final Project postedProject = new Gson().fromJson(body, Project.class);
		Project startedProject = WorkingSession.findStartedProject();
		if (start) {
			Logger.debug("start, body = %s, project =%s", body, postedProject);
			if (startedProject != null) {
				startedProject.stop();
			}
			startedProject = Project.findById(postedProject.id);
			startedProject.start();
		} else if (stop) {
			if (startedProject != null) {
				startedProject.stop();
			}
			startedProject = null;
		} else {
			final Project project = Project.findById(postedProject.id);
			project.label = postedProject.label;
			project.save();
		}
		ok();
	}

	public static void allSessions() {
		renderJSON(WorkingSession.all().fetch());
	}
}