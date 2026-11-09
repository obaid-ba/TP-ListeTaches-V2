import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../services/tasks';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  async function load(setBusy) {
    setBusy(true);
    setError(null);
    try {
      setTasks(await api.fetchTasks());
      setLoaded(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load(setLoading);
  }, []);

  const stats = useMemo(() => {
    const done = tasks.filter((task) => task.status === 'terminee').length;
    return { total: tasks.length, done, todo: tasks.length - done };
  }, [tasks]);

  async function addTask(values) {
    const created = await api.createTask(values);
    setTasks((current) => [created, ...current]);
  }

  async function editTask(id, values) {
    const updated = await api.updateTask(id, values);
    setTasks((current) =>
      current.map((task) => (task.id === id ? updated : task))
    );
  }

  async function removeTask(id) {
    await api.deleteTask(id);
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function toggleTaskStatus(task) {
    return editTask(task.id, {
      status: task.status === 'terminee' ? 'a_faire' : 'terminee',
    });
  }

  const value = {
    tasks,
    stats,
    loading,
    refreshing,
    loaded,
    error,
    retry: () => load(setLoading),
    refresh: () => load(setRefreshing),
    addTask,
    editTask,
    removeTask,
    toggleTaskStatus,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  return useContext(TaskContext);
}
