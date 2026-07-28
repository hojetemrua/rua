// Metro precisa saber que o projeto vive num monorepo: os pacotes estão fora
// de apps/movel, e as dependências ficam no node_modules da raiz.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");

const projeto = __dirname;
const raiz = path.resolve(projeto, "../..");

const config = getDefaultConfig(projeto);

config.watchFolders = [raiz];
config.resolver.nodeModulesPaths = [
  path.resolve(projeto, "node_modules"),
  path.resolve(raiz, "node_modules"),
];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
