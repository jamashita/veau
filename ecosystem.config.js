module.exports = {
  apps: [
    {
      name: 'veau-web',
      script: 'dist/veau-server/Server.js',
      output: 'logs/web-output.log',
      error: 'logs/web-error.log',
      exec_mode: 'cluster',
      instances: 'max',
    }
  ]
};
