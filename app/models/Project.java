package models;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.persistence.Entity;

import controllers.Security;
import play.Logger;
import play.data.validation.MaxSize;
import play.data.validation.Required;
import play.db.jpa.JPABase;
import play.db.jpa.Model;

@Entity
public class Project extends Model {

    /*
     * private static final String[] COLORS = { "#000000", "#FFFFFF", "#FF0000",
     * "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#800000",
     * "#008000", "#000080", "#808000", "#800080", "#008080", "#C0C0C0",
     * "#808080", "#9999FF", "#993366", "#FFFFCC", "#CCFFFF", "#660066",
     * "#FF8080", "#0066CC", "#CCCCFF", "#000080", "#FF00FF", "#FFFF00",
     * "#00FFFF", "#800080", "#800000", "#008080", "#0000FF", "#00CCFF",
     * "#CCFFFF", "#CCFFCC", "#FFFF99", "#99CCFF", "#FF99CC", "#CC99FF",
     * "#FFCC99", "#3366FF", "#33CCCC", "#99CC00", "#FFCC00", "#FF9900",
     * "#FF6600", "#666699", "#969696", "#003366", "#339966", "#003300",
     * "#333300", "#993300", "#993366", "#333399", "#333333" };
     */

    private static final String[] COLORS = { "#583E42", "#D93F5E", "#B5969E", "#F98BAF", "#954B7D", "#B88CB7",
            "#551770", "#662388", "#807EC7", "#189ACC", "#2AC4FE", "#1E5AAD", "#3A77B9", "#23CDE6", "#2E99BA",
            "#2B738A", "#6BBB96", "#4AA477", "#529214", "#B4DB66", "#F8CD11", "#FFEEAA", "#E1D9BF", "#DFBC50",
            "#F5A602", "#FFCC66", "#7E6948", "#FBEEDC", "#CD9162", "#AC6530", "#DD4A38", "#C45D4F", "#FAA5A3",
            "#EE0F0F", "#6B6B6B", "#999999", "#DEDEDE" };

    @MaxSize(255)
    @Required
    public String label;

    public Date lastUpdate;

    public String color;

    public boolean archived;

    public Project(final String label) {
        super();
        this.label = label;
        lastUpdate = new Date();
        color = COLORS[(int) (System.currentTimeMillis() % COLORS.length)];
    }

    @Override
    public <T extends JPABase> T delete() {
        final List<WorkingSession> sessions = WorkingSession.findByProject(id);
        for (final WorkingSession session : sessions) {
            session.delete();
        }
        final List<TuttUser> users = TuttUser.findAll();
        for (final TuttUser user : users) {
            user.projects.remove(this);
            user.save();
        }
        return super.delete();
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
        final WorkingSession newSession = new WorkingSession(this, Security.connectedUser());
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

    public static List<Project> findAllowed() {
        final TuttUser user = Security.connectedUser();
        final List<Project> all = find("archived", false).fetch();
        final List<Project> allowed = new LinkedList<Project>();
        for (final Project project : all) {
            if (user.projects.contains(project)) {
                allowed.add(project);
            }
        }
        return allowed;
    }
}
