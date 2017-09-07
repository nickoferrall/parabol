exports.up = async (r) => {
  const tables = [
    r.table('Notification')
      .filter({type: 'REQUEST_NEW_USER'})
      .replace((row) => {
        return row
          .merge({
            inviterUserId: row('varList')(0),
            inviterName: row('varList')(1),
            inviteeEmail: row('varList')(2),
            teamId: row('varList')(3),
            teamName: row('varList')(4)
          })
          .without('varList');
      }),
    r.table('Notification')
      .filter({type: 'TEAM_ARCHIVED'})
      .replace((row) => {
        return row
          .merge({
            teamName: row('varList')(0),
          })
          .without('varList');
      }),
    r.table('Notification')
      .filter((row) => row('type').match('^TRIAL_'))
      .replace((row) => {
        return row
          .merge({
            expiresAt: row('varList')(0),
          })
          .without('varList');
      })
  ];
  try {
    await Promise.all(tables);
  } catch (e) {
    console.log('Exception during Promise.all(tables)');
  }
};

exports.down = async () => {
  // noop
};
