const supabase = require('../supabaseClient');
const { logAction } = require('../utils/logger');

exports.getDisasters = async (req, res) => {
  const tag = req.query.tag;
  let query = supabase.from('disasters').select('*');
  if (tag) query = query.contains('tags', [tag]);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error });
  res.json(data);
};

exports.createDisaster = async (req, res, io) => {
  const { title, location_name, description, tags, owner_id } = req.body;
  const { data, error } = await supabase.from('disasters').insert({ title, location_name, description, tags, owner_id }).select();
  if (error) return res.status(500).json({ error });
  io.emit('disaster_updated', data);
  await supabase.from('disasters').update({ audit_trail: [{ action: 'create', user_id: owner_id, timestamp: new Date().toISOString() }] }).eq('id', data[0].id);
  logAction('create', 'disaster', owner_id);
  res.status(201).json(data);
};

exports.updateDisaster = async (req, res, io) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('disasters').update(updates).eq('id', id).select();
  if (error) return res.status(500).json({ error });
  io.emit('disaster_updated', data);
  await supabase.rpc('append_audit', { id_input: id, new_entry: { action: 'update', user_id: updates.owner_id, timestamp: new Date().toISOString() } });
  logAction('update', 'disaster', updates.owner_id);
  res.json(data);
};

exports.deleteDisaster = async (req, res, io) => {
  const { id } = req.params;
  const { error } = await supabase.from('disasters').delete().eq('id', id);
  if (error) return res.status(500).json({ error });
  io.emit('disaster_updated', { deleted_id: id });
  logAction('delete', 'disaster', 'admin');
  res.status(204).end();
};
