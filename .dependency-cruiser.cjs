/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'foundations-no-ecosystem',
      severity: 'error',
      comment: 'foundations não pode importar de ecosystem',
      from: { path: '^src/foundations' },
      to: { path: '^src/ecosystem' },
    },
    {
      name: 'foundations-no-components',
      severity: 'error',
      comment: 'foundations não pode importar de components',
      from: { path: '^src/foundations' },
      to: { path: '^src/components' },
    },
    {
      name: 'ecosystem-no-components',
      severity: 'error',
      comment: 'ecosystem não pode importar de components',
      from: { path: '^src/ecosystem' },
      to: { path: '^src/components' },
    },
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Sem imports circulares (engine interno do styled-system excluído — Fase 4)',
      from: { pathNot: '^src/ecosystem/styled-system' },
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.app.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
  },
};
