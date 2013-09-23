package controllers;

import java.util.Date;
import java.util.List;

import models.DateGsonDeserializer;
import models.DateGsonSerializer;
import models.Project;
import models.WorkingSession;
import play.Logger;
import play.modules.excel.RenderExcel;
import play.mvc.Controller;
import play.mvc.With;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@With(Secure.class)
public class Application extends Controller {

	public static void index() {
		redirect("/app/");
	}

	public static void all(final boolean started) {
		if (started) {
			renderJSON(gson().toJson((WorkingSession.findStartedProject())));
		} else {
			renderJSON(gson().toJson(Project.findAllowed()));
		}
	}

	public static void find(final long projectId) {
		renderJSON(gson().toJson(Project.findById(projectId)));
	}

	public static void delete(final long projectId) {
		Logger.debug("delete(%s)", projectId);
		((Project) Project.findById(projectId)).delete();
		ok();
	}

	public static void create(final String body) {
		Logger.debug("create, body = %s", body);
		if (body == null || body.length() == 0) {
			ok();
		}
		// TODO check unicité label
		final Project project = new Project(body);
		Security.connectedUser().add((Project) project.save());
		ok();
	}

	public static void post(final String body, final boolean start, final boolean stop) {
		final Project postedProject = gson().fromJson(body, Project.class);
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
			project.color = postedProject.color;
			project.save();
		}
		ok();
	}

	public static void postSession(final String body) {
		final WorkingSession postedSession = gson().fromJson(body, WorkingSession.class);
		final WorkingSession session = WorkingSession.findById(postedSession.id);
		session.start = postedSession.start;
		session.stop = postedSession.stop;
		session.endOfPeriod = postedSession.endOfPeriod;
		session.save();
		ok();
	}

	public static void allSessions(final long projectId) {
		if (projectId == 0) {
			renderJSON(gson().toJson(WorkingSession.findAllowed()));
		} else {
			renderJSON(gson().toJson(WorkingSession.findByProject(projectId)));
		}
	}

	public static void deleteSession(final long sessionId) {
		final WorkingSession session = WorkingSession.findById(sessionId);
		if (session != null) {
			session._delete();
		}
		ok();
	}

	public static void excel(final long projectId) {
		final List<WorkingSession> sessions = WorkingSession.findByProject(projectId);
		request.format = "xls";
		renderArgs.put(RenderExcel.RA_FILENAME, "sessions_of_project_" + projectId);
		render(sessions);
	}

	private static Gson gson() {
		final GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.registerTypeAdapter(Date.class, new DateGsonSerializer());
		gsonBuilder.registerTypeAdapter(Date.class, new DateGsonDeserializer());
		return gsonBuilder.create();
	}
}