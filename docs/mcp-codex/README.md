# MCP Codex — points à retenir

Retour d'expérience du 19 octobre 2026.

## Configuration

- Le CLI et l'extension IDE utilisent les mêmes couches de configuration : `~/.codex/config.toml` et `.codex/config.toml` pour un projet approuvé comme fiable.
- Vérifier le transport (STDIO ou HTTP), l'URL ou la commande, l'authentification et les droits attendus par le serveur.
- `bearer_token_env_var` désigne une variable d'environnement ; cette option ne définit pas le secret.

## Variables d'environnement

- Le secret doit être accessible au processus qui établit la connexion MCP.
- Définir la variable dans le terminal qui lance Codex ; sous Bash, l'exporter avec `export`.
- Une variable définie dans PowerShell n'est pas automatiquement disponible dans un Bash ouvert séparément.
- Une modification des variables Windows ne met pas à jour les processus déjà ouverts. Relancer l'IDE pour que l'extension reçoive le nouvel environnement.
- Une variable non vide ne prouve pas que le token est valide. Ne pas afficher ni enregistrer le secret dans le dépôt ou les captures.

## Serveur Codex en arrière-plan

Si le token fonctionne et que le serveur MCP répond, mais que Codex échoue, essayer depuis le même terminal :

```bash
codex --no-daemon
```

Ce lancement évite de réutiliser le serveur partagé déjà démarré. Il a résolu notre blocage sous PowerShell ; la cause interne liée à l'environnement reste une hypothèse.

## Ordre de diagnostic

1. Vérifier la présence du secret dans le bon processus.
2. Tester l'authentification auprès du fournisseur.
3. Tester l'initialisation MCP avec la même URL et les mêmes en-têtes que Codex.
4. Vérifier `/mcp` dans la session active, puis essayer un outil de lecture.

`codex mcp list` confirme la configuration, pas la connexion. `failed (0 tools)` ne donne pas la cause : relever l'erreur de démarrage ou activer temporairement `log_dir`.

Dans notre cas : API et initialisation MCP en HTTP 200, puis GitHub connecté avec 48 outils dans Codex. Bash également confirmé fonctionnel. L'extension IDE et l'exécution réelle d'un outil n'ont pas été vérifiées.

Références : [configuration Codex](https://learn.chatgpt.com/docs/config-file/config-basic), [configuration MCP](https://learn.chatgpt.com/docs/extend/mcp).
