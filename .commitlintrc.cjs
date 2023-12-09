const types = require('./scripts/ks-cvlar.types.cjs');
const scopes = require('./scripts/ks-cvlar.scopes.cjs');
const { ConvertToLintTypes, ConvertToLintScopes } = require('./dist/index.cjs');

module.exports = {
  rules: {
    'type-enum': [2, 'always', ConvertToLintTypes(types)],
    'scope-enum': [2, 'always', ConvertToLintScopes(scopes)]
  }
};
