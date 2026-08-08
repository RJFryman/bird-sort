const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// @harmony/feedback is symlinked in from the harmony repo and has its own
// node_modules (it needs react installed to typecheck itself). Without this,
// Metro bundles that second copy of React and every hook in the module throws
// "Cannot read properties of null (reading 'useState')".
//
// disableHierarchicalLookup stops Metro walking up into the linked package's
// node_modules; nodeModulesPaths pins every resolution to this app's copy.
const FEEDBACK = path.resolve(__dirname, '../harmony-bet-feedback/packages/feedback');

config.watchFolders = [FEEDBACK];
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
