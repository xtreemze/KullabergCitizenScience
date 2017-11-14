function buildConfig(env) {
  return require('./' + env + '.js')({ env: env });
}
module.exports = buildConfig;
