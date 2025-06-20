const supabase = require('../supabaseClient');
exports.getCache = async (key) => {
  const { data } = await supabase.from('cache').select('*').eq('key', key).single();
  if (data && new Date(data.expires_at) > new Date()) return data.value;
  return null;
};
exports.setCache = async (key, value, ttl = 3600) => {
  const expires_at = new Date(Date.now() + ttl * 1000).toISOString();
  await supabase.from('cache').upsert({ key, value, expires_at });
};