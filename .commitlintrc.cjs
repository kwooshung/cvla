const commitTypes = require('./scripts/commitTypes.cjs');
const commitScopes = require('./scripts/commitScopes.cjs');

module.exports = {
  extends: ['git-commit-emoji', 'cz'],
  rules: {
    'type-enum': [2, 'always', commitTypes.map((type) => type.value)],
    'scope-enum': [2, 'always', commitScopes.map((scope) => scope[0])]
  }
};
