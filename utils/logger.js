exports.logAction = (action, entity, user_id) => {
  console.log(JSON.stringify({
    action,
    entity,
    user_id,
    timestamp: new Date().toISOString(),
  }));
};