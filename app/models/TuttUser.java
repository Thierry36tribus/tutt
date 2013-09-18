package models;

import java.util.LinkedList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;

import play.data.validation.Password;
import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class TuttUser extends Model {

	@Required
	public String login;
	@Required
	@Password
	public String password;

	@ManyToMany(cascade = CascadeType.ALL)
	public List<Project> projects;

	@Override
	public String toString() {
		return "TuttUser [login=" + login + "]";
	}

	public void add(final Project project) {
		if (projects == null) {
			projects = new LinkedList<Project>();
		}
		projects.add(project);
		save();
	}

}
