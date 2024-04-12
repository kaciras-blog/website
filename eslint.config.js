import core from "@kaciras/eslint-config-core";
import typescript from "@kaciras/eslint-config-typescript";
import vueTs from "@kaciras/eslint-config-vue/typescript.js";

export default [...core, ...typescript, ...vueTs, { ignores: ["dist/**"] }];
