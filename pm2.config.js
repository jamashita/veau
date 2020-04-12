module.exports = {
  apps: [
    {
      name: 'veau',
      script: 'dist/Server/Server.js',
      output: 'logs/output.log',
      error: 'logs/error.log',
      exec_mode: 'cluster',
      instances: 'max'
    }
  ]
};
