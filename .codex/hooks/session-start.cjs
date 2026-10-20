const { execFileSync } = require('node:child_process');
const { resolve } = require('node:path');

try {
  // Partir de l'emplacement du script fonctionne aussi depuis un sous-dossier.
  const status = execFileSync('git', ['status', '--short', '--branch'], {
    cwd: resolve(__dirname, '../..'),
    encoding: 'utf8',
    timeout: 5000,
    env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' }
  }).trimEnd();

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: [
        'État Git de JobView au démarrage de la session :',
        status,
        'Au début de ta première réponse après ce démarrage ou cette reprise, afficher en français la branche active et les fichiers modifiés ou non suivis indiqués ci-dessus. Si aucun fichier ne figure dans cet état Git, indiquer que le répertoire de travail est propre.',
        'Préserver les modifications existantes et examiner les différences avant toute intervention.',
        'Cet état est un instantané : vérifier à nouveau Git avant de modifier des fichiers.'
      ].join('\n')
    }
  }));
} catch (error) {
  console.error(`Hook SessionStart : lecture de l'état Git impossible (${error.message}).`);
  process.exitCode = 1;
}
