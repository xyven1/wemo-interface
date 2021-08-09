module.exports = {
  apps : [{
    name: 'wemo-interface',
    script: 'npm',
    args: "start",
    env: {
      "NODE_ENV": "production",
    }
  }],
}