import * as path from 'path';
import orm from '../../../../config/lib/sequelize';

function getAllTasks(req, res){
  orm.Task.findAll().then((tasks) => {
    res.status(200).send(tasks);
  }).catch((err) => {
    res.status(500).send(err);
  });
}

function addTask(req, res) {
  if (!req.body.title) {
    return res.status(400).send({
      message: 'Missing title field'
    });
  }

  let title = '' + req.body.title;
  let username = req.session.user.username;

  orm.Task.create({
    title: title,
    username: username,
  }).then((tasks) => {
    res.status(200).send(tasks);
  }).catch((error) => {
    res.status(500).send(error);
  });
}

function updateTask(req, res) {
  orm.Task.update(req.body, {
    where: {
      id: req.body.id
    }
  }).then((tasks) => {
    res.status(200).send(tasks);
  }).catch((err) => {
    res.status(500).send(error);
  });
}

function deleteTask(req, res) {
  orm.Task.destroy({
    where: {
      id: req.body.id
    }
  }).then((tasks) => {
    res.status(200).send(tasks);
  }).catch((error) => {
    res.status(500).send(error);
  });
}

function getMyTasks(req, res) {
  orm.Task.findAll({
    where: {
      username: req.session.user.username
    }
  }).then((tasks) => {
    res.status(200).send(tasks);
  }).catch((error) => {
    res.status(500).send(error);
  })
}

function validateSessionUser(req, res) {
  if (!req.session || !req.session.user) {
    return res.status(401).send({
      message: 'No session user'
    })
  }

  return next();
}

export default { getAllTasks, addTask, updateTask, getMyTasks, validateSessionUser, deleteTask }
