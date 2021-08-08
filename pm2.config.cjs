module.exports = {
  apps : [{
    name      : 'wemo-interface',
    script    : 'server.js',
    node_args : '-r dotenv-flow/config',
    env: {
      "NODE_ENV": "production",
    }
  }],
}