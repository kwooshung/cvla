import types from './scripts/types.mjs';
import scopes from './scripts/scopes.mjs';
import { ConvertToLintType, ConvertToLintScopes } from '@kwooshung/clvr';

module.exports = {
  extends: ['git-commit-emoji'],
  rules: {
    'type-enum': [2, 'always', ConvertToLintType(types)],
    'scope-enum': [2, 'always', ConvertToLintScopes(scopes)]
  }
};
