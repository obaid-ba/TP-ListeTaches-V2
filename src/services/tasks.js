import { supabase } from '../lib/supabase';

function tasksTable() {
  if (!supabase) {
    throw new Error(
      'Supabase n’est pas configuré. Renseignez l’URL et la clé dans le fichier .env.local, puis relancez l’application.'
    );
  }
  return supabase.from('tasks');
}

function toUserError(error) {
  const message = error.message ?? '';

  if (error.code === 'PGRST205' || error.code === '42P01') {
    return new Error(
      'La table « tasks » est introuvable. Exécutez supabase/schema.sql dans votre projet Supabase.'
    );
  }
  if (error.code === '42501') {
    return new Error('Accès refusé par les règles de sécurité de Supabase.');
  }
  if (error.code === 'PGRST116') {
    return new Error('Cette tâche n’existe plus.');
  }
  if (/api key/i.test(message)) {
    return new Error('La clé Supabase est invalide. Vérifiez le fichier .env.local.');
  }
  if (/network|fetch/i.test(message)) {
    return new Error(
      'Impossible de joindre le serveur. Vérifiez votre connexion internet puis réessayez.'
    );
  }
  return new Error(message || 'Une erreur est survenue.');
}

export async function fetchTasks() {
  const { data, error } = await tasksTable()
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw toUserError(error);
  return data;
}

export async function createTask(values) {
  const { data, error } = await tasksTable().insert(values).select().single();

  if (error) throw toUserError(error);
  return data;
}

export async function updateTask(id, values) {
  const { data, error } = await tasksTable()
    .update(values)
    .eq('id', id)
    .select()
    .single();

  if (error) throw toUserError(error);
  return data;
}

export async function deleteTask(id) {
  const { error } = await tasksTable().delete().eq('id', id);

  if (error) throw toUserError(error);
}
