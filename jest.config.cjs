module.exports = {
  testEnvironment: 'jest-environment-node',
  experimentalVMModules: true,
    transform: {
    '^.+\\.js$': 'babel-jest'
  }
}