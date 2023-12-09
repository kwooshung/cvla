import types from './scripts/ks-cvlar.types.mjs';
import scopes from './scripts/ks-cvlar.scopes.mjs';
import { ConvertToLintType, ConvertToLintScopes } from '@kwooshung/clvr';

module.exports = {
  extends: ['git-commit-emoji'],
  rules: {
    'type-enum': [2, 'always', ConvertToLintType(types)],
    'scope-enum': [2, 'always', ConvertToLintScopes(scopes)]
  }
};
