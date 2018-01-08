import tasks from '../controllers/tasks.server.controller';

export = (app) => {
  app.route('/api/tasks').get(tasks.getAllTasks);
  app.route('/api/tasks/me').get(tasks.validateSessionUser, tasks.getMyTasks);
  app.route('/api/tasks').post(tasks.validateSessionUser, tasks.addTask);
  app.route('/api/tasks').put(tasks.validateSessionUser, tasks.updateTask);
  app.route('/api/tasks').delete(tasks.validateSessionUser, tasks.deleteTask);
}
