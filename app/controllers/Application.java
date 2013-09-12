package controllers;

import models.Project;
import play.Logger;
import play.mvc.Controller;

import com.google.gson.Gson;

public class Application extends Controller {

	// TODO à supprimer pas REST !
	private static Project startedProject;

	public static void index() {
		render();
	}

	public static void all(final boolean started) {
		if (started) {
			renderJSON(startedProject);
		} else {
			renderJSON(Project.all());
		}
	}

	public static void find(final long projectId) {
		renderJSON(Project.find(projectId));
	}

	public static void delete(final long projectId) {
		Logger.debug("delete(%s)", projectId);

		// TODO

		ok();
	}

	public static void post(final String body, final boolean start, final boolean stop) {
		final Project project = new Gson().fromJson(body, Project.class);
		if (start) {
			Logger.debug("start, body = %s, project =%s", body, project);
			if (startedProject != null) {
				startedProject.stop();
			}
			startedProject = Project.find(project.id);
			startedProject.start();
		} else if (stop) {
			if (startedProject != null) {
				startedProject.stop();
			}
			startedProject = null;
		} else {

			// TODO create if existe pas, save sinon

			Logger.debug("save project %s", project);
		}
		ok();
	}
}