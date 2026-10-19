import type { StorageSaveResult, UnsafeStorageRead } from './storage-data';

export function storageReadMessage(read: UnsafeStorageRead): string {
  switch (read.status) {
    case 'invalid-data':
      return 'Les données enregistrées sont illisibles. L’enregistrement est indisponible pour les préserver.';
    case 'unknown-version':
      return 'La version des données enregistrées n’est pas prise en charge. L’enregistrement est indisponible pour les préserver.';
    case 'access-denied':
      return 'L’accès aux données du navigateur est refusé. L’enregistrement est indisponible.';
  }
}

export function storageSaveMessage(result: Exclude<StorageSaveResult, { status: 'saved' }>): string {
  switch (result.status) {
    case 'blocked': return storageReadMessage(result.read);
    case 'quota-exceeded': return 'Le stockage du navigateur est saturé. Votre saisie est conservée ; libérez de l’espace puis réessayez.';
    case 'access-denied': return 'Le navigateur a refusé l’enregistrement. Votre saisie est conservée ; vérifiez ses autorisations puis réessayez.';
    case 'write-failed': return 'L’enregistrement a échoué. Votre saisie est conservée ; vous pouvez réessayer.';
    case 'invalid-input': return 'Ces informations n’ont pas pu être enregistrées. Vérifiez votre saisie puis réessayez.';
    case 'duplicate-id': return 'Cet identifiant d’entretien existe déjà. Cet entretien n’a pas été ajouté.';
  }
}
