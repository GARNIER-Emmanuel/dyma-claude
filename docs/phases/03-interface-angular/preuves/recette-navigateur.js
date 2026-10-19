async (page) => {
  const browser = page.context().browser();
  const results = [];
  const root = 'C:/dev/Perso/Learn/dymacourse/dyma-claude/docs/phases/03-interface-angular/preuves/';
  const url = 'http://127.0.0.1:4200/';
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const screenshot = (p, name) => p.screenshot({ path: root + name + '.png', fullPage: true });
  async function scenario(name, viewport, run, init) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const p = await context.newPage();
    const errors = [];
    p.on('pageerror', (error) => errors.push(error.message));
    try {
      if (init) await context.addInitScript(init);
      await p.goto(url);
      await p.getByRole('heading', { name: 'Mes entretiens', exact: true }).waitFor();
      const details = await run(p);
      assert(errors.length === 0, 'Erreurs JavaScript : ' + errors.join('; '));
      results.push({ name, viewport, status: 'réussi', ...details, pageErrors: errors });
    } catch (error) {
      results.push({ name, viewport, status: 'échoué', error: error.message, pageErrors: errors });
    } finally { await context.close(); }
  }
  async function fillInterview(p, company = 'Entreprise fictive') {
    await p.getByLabel('Entreprise obligatoire').fill(company);
    await p.getByLabel('Date de l’entretien obligatoire').fill('19/10/2026');
    await p.getByLabel('Poste obligatoire').fill('Développeur fictif');
    await p.getByLabel('Contrat obligatoire', { exact: true }).fill('CDI');
    await p.getByLabel('Performance des conditions', { exact: true }).fill('0');
  }
  async function savedData(p) { return p.evaluate(() => JSON.parse(localStorage.getItem('jobview:data'))); }
  async function noOverflow(p) {
    assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Débordement horizontal');
  }

  await scenario('PC : parcours complet, clavier, zéro/absence et profil', { width: 1440, height: 900 }, async (p) => {
    await p.keyboard.press('Tab');
    assert(await p.getByRole('link', { name: 'Aller au contenu' }).evaluate((e) => e === document.activeElement), 'Lien d’évitement non accessible');
    await p.keyboard.press('Enter');
    assert(await p.locator('main').evaluate((e) => e === document.activeElement), 'Lien d’évitement sans focus');
    await p.getByRole('button', { name: 'Nouvel entretien', exact: false }).focus();
    await p.keyboard.press('Enter');
    await p.getByRole('button', { name: 'Enregistrer l’entretien', exact: true }).click();
    assert(await p.getByLabel('Entreprise obligatoire').evaluate((e) => e === document.activeElement), 'Premier champ invalide sans focus');
    assert(await p.locator('[aria-invalid=true]').count() === 4, 'Quatre champs requis attendus');
    await fillInterview(p);
    await p.getByLabel('Date de l’entretien obligatoire').fill('31/02/2026');
    await p.getByLabel('Compatibilité', { exact: true }).fill('2.5');
    await p.getByRole('button', { name: 'Enregistrer l’entretien', exact: true }).click();
    assert((await p.locator('body').innerText()).includes('date réelle'), 'Date impossible acceptée');
    assert((await p.locator('body').innerText()).includes('note entière'), 'Note décimale acceptée');
    assert(await savedData(p) === null, 'Écriture de saisie invalide');
    await screenshot(p, 'pc-formulaire-invalide');
    await p.getByLabel('Date de l’entretien obligatoire').fill('19/10/2026');
    await p.getByLabel('Compatibilité', { exact: true }).fill('');
    await p.getByLabel('Feeling', { exact: true }).selectOption('OK');
    await p.getByRole('button', { name: 'Enregistrer l’entretien', exact: true }).click();
    await p.getByRole('status').filter({ hasText: 'Entretien enregistré.' }).waitFor();
    assert(await p.getByRole('heading', { name: 'Entreprise fictive', exact: true }).isVisible(), 'Détail absent');
    const initial = await savedData(p);
    assert(initial.profile === null && initial.interviews.length === 1, 'Profil obligatoire ou entretien absent');
    assert(initial.interviews[0].conditionsRating === 0 && !('compatibilityRating' in initial.interviews[0]), 'Zéro confondu avec absence');
    assert((await p.locator('body').innerText()).includes('Non noté'), 'Absence non affichée');
    await screenshot(p, 'pc-detail');
    await p.getByRole('button', { name: 'Mes entretiens', exact: true }).last().click();
    assert(await p.getByRole('button', { name: 'Consulter l’entretien : Entreprise fictive, Développeur fictif' }).isVisible(), 'Entretien absent de la liste');
    await screenshot(p, 'pc-liste');
    await p.getByRole('navigation').getByRole('button', { name: 'Mon profil', exact: true }).click();
    await p.getByLabel('Compétences', { exact: true }).fill('Angular\nJava');
    await p.getByLabel('Métier recherché', { exact: true }).fill('Développeur fictif');
    await p.getByLabel('Contrat recherché', { exact: true }).fill('CDI');
    await p.getByLabel('Fourchette de salaire souhaitée', { exact: true }).fill('40–45 k€');
    await p.getByLabel('Horaires souhaités', { exact: true }).fill('35 h');
    await p.getByLabel('Télétravail souhaité', { exact: true }).fill('Deux jours');
    await p.getByLabel('Localisation recherchée', { exact: true }).fill('Ville fictive');
    await p.getByRole('button', { name: 'Enregistrer mon profil', exact: true }).click();
    await p.getByRole('status').filter({ hasText: 'Profil enregistré.' }).waitFor();
    await screenshot(p, 'pc-profil');
    await p.getByLabel('Métier recherché', { exact: true }).fill('Autre métier fictif');
    assert(!(await p.getByRole('status').innerText()).includes('Profil enregistré.'), 'Ancienne confirmation trompeuse');
    await p.getByRole('button', { name: 'Enregistrer mon profil', exact: true }).click();
    const afterProfile = await savedData(p);
    assert(JSON.stringify(afterProfile.interviews) === JSON.stringify(initial.interviews), 'Profil modifiant les évaluations');
    await p.getByRole('navigation').getByRole('button', { name: 'Mes entretiens', exact: true }).click();
    await p.getByRole('button', { name: 'Nouvel entretien', exact: false }).click();
    await fillInterview(p);
    await p.getByLabel('Feeling', { exact: true }).selectOption('Pas top');
    await p.getByRole('navigation').getByRole('button', { name: 'Mon profil', exact: true }).click();
    await p.getByRole('navigation').getByRole('button', { name: 'Mes entretiens', exact: true }).click();
    assert(await p.getByLabel('Entreprise obligatoire').inputValue() === 'Entreprise fictive', 'Brouillon perdu en navigation');
    await p.getByRole('button', { name: 'Enregistrer l’entretien', exact: true }).click();
    const final = await savedData(p);
    assert(final.interviews.length === 2 && final.interviews[0].id !== final.interviews[1].id, 'Entretiens fusionnés');
    assert(final.interviews[1].conditionsRating === 0, 'Feeling modifiant une note');
    await p.reload();
    await p.getByRole('heading', { name: 'Mes entretiens', exact: true }).waitFor();
    assert(await p.getByRole('button', { name: 'Consulter l’entretien : Entreprise fictive, Développeur fictif' }).count() === 2, 'Rechargement incomplet');
    await noOverflow(p);
    return { interviews: final.interviews.length, zero: true, missingRating: true, keyboard: true, profileRetained: true, reloadOnly: true };
  });

  for (const width of [390, 320]) {
    await scenario('Mobile émulé : création, détail, profil et clavier ' + width, { width, height: width === 390 ? 844 : 740 }, async (p) => {
      await noOverflow(p);
      await p.getByRole('button', { name: 'Créer mon premier entretien' }).click();
      await fillInterview(p);
      await noOverflow(p);
      await screenshot(p, 'mobile-' + width + '-formulaire');
      await p.getByRole('button', { name: 'Enregistrer l’entretien', exact: true }).click();
      await p.getByRole('status').filter({ hasText: 'Entretien enregistré.' }).waitFor();
      await noOverflow(p);
      await screenshot(p, 'mobile-' + width + '-detail');
      await p.getByRole('button', { name: 'Mes entretiens', exact: true }).last().click();
      await noOverflow(p);
      await screenshot(p, 'mobile-' + width + '-liste');
      await p.getByRole('navigation').getByRole('button', { name: 'Mon profil', exact: true }).click();
      await p.getByLabel('Métier recherché', { exact: true }).fill('Profil mobile fictif');
      await p.getByRole('button', { name: 'Enregistrer mon profil', exact: true }).click();
      await p.getByRole('status').filter({ hasText: 'Profil enregistré.' }).waitFor();
      await noOverflow(p);
      await p.getByLabel('Métier recherché', { exact: true }).focus();
      await p.keyboard.press('Tab');
      assert(await p.getByLabel('Contrat recherché', { exact: true }).evaluate((e) => e === document.activeElement), 'Ordre clavier incohérent');
      return { noHorizontalOverflow: true, profileSaved: true, keyboard: true, emulated: true };
    });
  }

  for (const mode of ['invalid-json', 'invalid-format', 'unknown-version', 'read-denied']) {
    await scenario('Stockage : ' + mode, { width: 390, height: 844 }, async (p) => {
      const body = await p.locator('body').innerText();
      assert(body.includes('Enregistrement indisponible'), 'Erreur invisible');
      assert(!body.includes('Votre prochain entretien commence ici'), 'Lecture non sûre traitée comme vide');
      await p.getByRole('button', { name: 'Nouvel entretien', exact: false }).click();
      await fillInterview(p);
      assert(await p.getByRole('button', { name: 'Enregistrer l’entretien', exact: true }).isDisabled(), 'Enregistrement non bloqué');
      assert(await p.evaluate(() => window.__qaWrites) === 0, 'Écriture après lecture non sûre');
      await screenshot(p, 'erreur-' + mode);
      await p.evaluate(() => window.__qaRestore());
      await p.getByRole('button', { name: 'Réessayer la lecture', exact: true }).click();
      assert(await p.getByLabel('Entreprise obligatoire').inputValue() === 'Entreprise fictive', 'Brouillon perdu à la nouvelle lecture');
      assert(await p.getByRole('button', { name: 'Enregistrer l’entretien', exact: true }).isEnabled(), 'Nouvelle lecture bloquée');
      return { noWrite: true, draftRetained: true, retry: true };
    }, ((mode) => {
      return `(() => {
        const originalGet = Storage.prototype.getItem;
        const originalSet = Storage.prototype.setItem;
        window.__qaWrites = 0;
        const mode = ${JSON.stringify(mode)};
        const raw = mode === 'invalid-json' ? '{' : mode === 'invalid-format' ? '{"version":1}' : '{"version":2}';
        if (mode !== 'read-denied') originalSet.call(localStorage, 'jobview:data', raw);
        Storage.prototype.getItem = function(key) { if (key === 'jobview:data' && mode === 'read-denied') throw new DOMException('Refus fictif', 'SecurityError'); return originalGet.call(this, key); };
        Storage.prototype.setItem = function(key, value) { if(key === 'jobview:data') window.__qaWrites++; return originalSet.call(this, key, value); };
        window.__qaRestore = () => { Storage.prototype.getItem = originalGet; localStorage.removeItem('jobview:data'); };
      })();`;
    })(mode));
  }

  for (const mode of ['QuotaExceededError', 'SecurityError', 'Error']) {
    await scenario('Écriture : ' + mode, { width: 1440, height: 900 }, async (p) => {
      await p.getByRole('button', { name: 'Nouvel entretien', exact: false }).click();
      await fillInterview(p);
      await p.getByRole('button', { name: 'Enregistrer l’entretien', exact: true }).click();
      assert((await p.getByRole('alert').innerText()).includes('saisie est conservée'), 'Échec invisible');
      assert(!(await p.getByRole('status').innerText()).includes('enregistré'), 'Fausse confirmation');
      assert(await savedData(p) === null, 'Contenu modifié après échec');
      assert(await p.getByLabel('Entreprise obligatoire').inputValue() === 'Entreprise fictive', 'Saisie perdue');
      await screenshot(p, 'echec-' + mode);
      await p.evaluate(() => { window.__qaFail = false; });
      await p.getByRole('button', { name: 'Enregistrer l’entretien', exact: true }).click();
      await p.getByRole('status').filter({ hasText: 'Entretien enregistré.' }).waitFor();
      return { draftRetained: true, noFalseSuccess: true, retrySaved: true };
    }, `(() => {
      const original = Storage.prototype.setItem;
      window.__qaFail = true;
      Storage.prototype.setItem = function(key, value) {
        if (key === 'jobview:data' && window.__qaFail) {
          const name = ${JSON.stringify(mode)};
          if (name === 'Error') throw new Error('Échec fictif');
          throw new DOMException('Échec fictif', name);
        }
        return original.call(this, key, value);
      };
    })();`);
  }

  await scenario('Saisies affichées comme texte et textes longs', { width: 320, height: 740 }, async (p) => {
    await p.getByRole('button', { name: 'Créer mon premier entretien' }).click();
    await fillInterview(p, '<img src=x onerror=alert(1)>');
    await p.getByLabel('Poste obligatoire').fill('Poste-fictif-' + 'long'.repeat(35));
    await p.getByRole('button', { name: 'Enregistrer l’entretien', exact: true }).click();
    await p.getByRole('status').filter({ hasText: 'Entretien enregistré.' }).waitFor();
    assert(await p.locator('img').count() === 0, 'HTML interprété');
    assert((await p.locator('body').innerText()).includes('<img src=x onerror=alert(1)>'), 'Texte modifié');
    await noOverflow(p);
    await p.getByRole('button', { name: 'Mes entretiens', exact: true }).last().click();
    await noOverflow(p);
    await screenshot(p, 'mobile-texte-long');
    return { literalText: true, noHorizontalOverflow: true };
  });
  await scenario('Parcours intégral au clavier', { width: 1440, height: 900 }, async (p) => {
    async function tabTo(selector) {
      for (let i = 0; i < 30; i++) {
        await p.keyboard.press('Tab');
        if (await p.locator(selector).evaluate((e) => e === document.activeElement)) return;
      }
      throw new Error('Cible clavier inaccessible : ' + selector);
    }
    await tabTo('app-interview-list .page-heading button'); await p.keyboard.press('Enter');
    await p.getByRole('heading', { name: 'Nouvel entretien', exact: true }).waitFor();
    await tabTo('#interview-company'); await p.keyboard.type('Entreprise clavier fictive');
    await p.keyboard.press('Tab'); await p.keyboard.type('19/10/2026');
    await p.keyboard.press('Tab'); await p.keyboard.type('Poste clavier');
    await p.keyboard.press('Tab'); await p.keyboard.type('CDI');
    await p.keyboard.press('Tab'); await p.keyboard.type('0');
    await tabTo('app-interview-form button[type=submit]'); await p.keyboard.press('Enter');
    await p.getByRole('status').filter({ hasText: 'Entretien enregistré.' }).waitFor();
    assert(await p.locator('#detail-heading').evaluate((e) => e === document.activeElement), 'Focus absent du détail');
    await tabTo('app-interview-detail button'); await p.keyboard.press('Enter');
    await tabTo('app-interview-list li button'); await p.keyboard.press('Enter');
    await p.getByRole('heading', { name: 'Entreprise clavier fictive', exact: true }).waitFor();
    await tabTo('nav button:nth-of-type(2)'); await p.keyboard.press('Enter');
    await tabTo('#skills'); await p.keyboard.type('Angular');
    await p.keyboard.press('Tab'); await p.keyboard.type('Profil clavier');
    await tabTo('app-profile-form button[type=submit]'); await p.keyboard.press('Enter');
    await p.getByRole('status').filter({ hasText: 'Profil enregistré.' }).waitFor();
    await screenshot(p, 'pc-clavier');
    return { keyboardOnly: true, profileAndInterviewSaved: true, listAndDetail: true };
  });

  await scenario('Échec d’écriture avec données déjà enregistrées', { width: 390, height: 844 }, async (p) => {
    const before = await savedData(p);
    await p.getByRole('button', { name: 'Nouvel entretien', exact: false }).click();
    await fillInterview(p);
    await p.getByRole('button', { name: 'Enregistrer l’entretien', exact: true }).click();
    assert((await p.getByRole('alert').innerText()).includes('stockage du navigateur est saturé'), 'Quota invisible');
    assert(JSON.stringify(await savedData(p)) === JSON.stringify(before), 'Données antérieures modifiées');
    assert(!(await p.getByRole('status').innerText()).includes('enregistré'), 'Fausse confirmation');
    await screenshot(p, 'mobile-echec-donnees-conservees');
    return { previousDataPreserved: true, noFalseSuccess: true };
  }, `(() => {
    const original = Storage.prototype.setItem;
    original.call(localStorage, 'jobview:data', JSON.stringify({ version: 1, profile: { skills: ['Java'], desiredJob: 'Profil initial fictif', desiredSalaryRange: '', workingHours: '', remoteWork: '', location: '', desiredContract: '' }, interviews: [{ id: 'initial-fictif', company: 'Entreprise initiale fictive', date: '2026-10-18', position: 'Poste initial', contract: 'CDI', conditionsRating: 0 }] }));
    Storage.prototype.setItem = function(key, value) { if (key === 'jobview:data') throw new DOMException('Quota fictif', 'QuotaExceededError'); return original.call(this, key, value); };
  })();`);
  return { date: new Date().toISOString(), browser: browser.version(), url, reducedMotion: true, contextsClosed: true, results };
}
