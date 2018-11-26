
import React from 'react';
import { qauf, _url } from '../../../constants';
import { updTask, crTask, deleteTask } from '../../../GraphQL/Qur/Mutation';
import { taskCacheUpdate, objectCacheUpdate } from '../../../GraphQL/Cache';

const TaskCacheUpdate = (value, change, quota, taskId, objectId)   => {
  let cap = ""

  if (quota) cap = '"';

  let changes = `${change}: ${cap}${value}${cap}`;

  if (change !== "name"){
    changes = `name: "Нет названия", ${change}: ${cap}${value}${cap}`
  }

  if (!taskId)
    qauf(crTask(`{${changes}, objectId: "${this.state.objectId}"}`), _url, localStorage.getItem('auth-token')).then(a=>{
      console.warn("create task done", a.data.createTask.id)
      this.props.objectCacheUpdate({
        variables:{
          value: {[change] : value},
          action: "createTask",
          taskId: a.data.createTask.id,
          objectId: this.state.objectId
        }
      })
    }).catch((e)=>{
      console.warn(e);
    })
  else
    qauf(updTask(this.state.taskId,`{${change}: ${cap}${value}${cap}}`), _url, localStorage.getItem('auth-token')).then(a=>{
      console.warn("update task done", a)
      this.props.objectCacheUpdate({
        variables:{
          value: {value : value, key : change},
          action: "updateTask",
          taskId: this.state.taskId,
          objectId: this.state.objectId
        }
      })
    }).catch((e)=>{
      console.warn(e);
    })
};


export default TaskCacheUpdate;
