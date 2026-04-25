// Setup-after-env do project Jest "native".
//
// Workaround: jest-expo registra getters lazy em globalThis (winter/runtime).
// Se algum getter for invocado durante teardown (após Jest setar
// isInsideTestCode = false), Runtime._execModule joga
// "outside of the scope of the test code". Forçamos a resolução agora
// para que esses globais virem valores estáticos antes do teardown.
[
  '__ExpoImportMetaRegistry',
  'TextDecoder',
  'TextDecoderStream',
  'TextEncoderStream',
  'URL',
  'URLSearchParams',
  'structuredClone',
].forEach((name) => {
  try {
    void globalThis[name];
  } catch {
    // ignora resolução falha — globals opcionais
  }
});

require('./test/native-mocks.cjs');
