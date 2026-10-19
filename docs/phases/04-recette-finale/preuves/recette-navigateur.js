async (sharedPage) => {
  // Run through the existing Playwright MCP runtime. Never close its shared browser.
  const browserType = sharedPage.context().browser().browserType();
  const root = 'C:/dev/Perso/Learn/dymacourse/dyma-claude/';
  const evidence = root + 'docs/phases/04-recette-finale/preuves/';
  const url = 'http://127.0.0.1:4200/';
  const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  // A new run gets fresh profiles; only the two launches within one run reuse them.
  const runId = new Date().toISOString().replace(/[:.]/g, '-');
  const output = { started: new Date().toISOString(), runId, url, executablePath, profiles: [], network: [], reopenings: [] };
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const variants = [
    { name: 'pc', marker: 'PC', width: 1440, height: 900, mobile: false },
    { name: 'mobile-390', marker: 'M390', width: 390, height: 844, mobile: true },
    { name: 'mobile-320', marker: 'M320', width: 320, height: 740, mobile: true },
  ];

  for (const variant of variants) {
    const profilePath = root + '.angular/jobview-phase4/chromium-' + variant.name + '-' + runId;
    const options = {
      executablePath, headless: true, viewport: { width: variant.width, height: variant.height },
      reducedMotion: 'reduce', isMobile: variant.mobile, hasTouch: variant.mobile,
      ...(variant.mobile ? { userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Mobile Safari/537.36' } : {}),
    };
    const result = { name: variant.name, viewport: options.viewport, isMobile: variant.mobile, hasTouch: variant.mobile, profilePath, scenarios: [], pageErrors: [], screenshots: [], layout: [] };
    output.profiles.push(result);
    let context;
    let p;
    let phase = 'démarrage';
    let launch = 1;
    const net = { profile: variant.name, requests: [], websockets: [], markers: [] };
    output.network.push(net);
    const stamp = () => new Date().toISOString();
    const mark = (value) => { phase = value; net.markers.push({ time: stamp(), launch, phase }); };
    const raw = () => p.evaluate(() => localStorage.getItem('jobview:data'));
    const stored = async () => JSON.parse(await raw());
    const saved = async (text) => p.getByRole('status').filter({ hasText: text }).waitFor();
    const visible = async (locator, message) => { await locator.waitFor({ state: 'visible' }); assert(await locator.isVisible(), message); };
    const noOverflow = async (screen) => {
      const dimensions = await p.evaluate(() => ({ innerWidth, width: document.documentElement.scrollWidth, viewport: { width: innerWidth, height: innerHeight } }));
      result.layout.push({ screen, ...dimensions });
      assert(dimensions.width <= dimensions.innerWidth, 'Débordement horizontal : ' + screen);
    };
    const shot = async (name) => {
      await noOverflow(name);
      const filename = variant.name + '-' + name + '.png';
      await p.screenshot({ path: evidence + filename, fullPage: true });
      result.screenshots.push(filename);
    };
    const profileNav = () => { mark('consultation profil'); return p.getByRole('navigation').getByRole('button', { name: 'Mon profil', exact: true }).click(); };
    const listNav = async () => {
      mark('consultation liste');
      await p.getByRole('navigation').getByRole('button', { name: 'Mes entretiens', exact: true }).click();
      await p.locator('section[aria-label="Mes entretiens"]').waitFor({ state: 'visible' });
      // Switching spaces restores the current interview screen, including its draft.
      if (await p.locator('app-interview-detail').isVisible()) await p.locator('app-interview-detail button').click();
      else if (await p.getByRole('heading', { name: 'Nouvel entretien', exact: true }).isVisible()) await p.getByRole('button', { name: 'Retour à la liste', exact: true }).click();
      await p.getByRole('heading', { name: 'Mes entretiens', exact: true }).waitFor();
    };
    const submitInterview = () => { mark('sauvegarde entretien'); return p.getByRole('button', { name: 'Enregistrer l’entretien', exact: true }).click(); };
    const submitProfile = () => { mark('sauvegarde profil'); return p.getByRole('button', { name: 'Enregistrer mon profil', exact: true }).click(); };
    const company = variant.marker + ' Entreprise fictive JV-P4';
    const position = variant.marker + ' Poste fictif JV-P4';
    const p1 = {
      skills: ['Angular fictif', 'Java fictif'], desiredJob: variant.marker + ' Développeur recette JV-P4',
      desiredSalaryRange: '40–45 k€ fictifs', workingHours: '35 h fictives', remoteWork: 'Deux jours fictifs',
      location: 'Ville fictive JV-P4', desiredContract: 'CDI fictif',
    };
    const p2 = { ...p1, desiredJob: variant.marker + ' Autre métier fictif JV-P4', remoteWork: 'Trois jours fictifs' };
    const labels = {
      skills: 'Compétences', desiredJob: 'Métier recherché', desiredSalaryRange: 'Fourchette de salaire souhaitée',
      workingHours: 'Horaires souhaités', remoteWork: 'Télétravail souhaité', location: 'Localisation recherchée', desiredContract: 'Contrat recherché',
    };
    async function fillProfile(profile) {
      mark('saisie profil');
      for (const [key, label] of Object.entries(labels)) await p.getByLabel(label, { exact: true }).fill(key === 'skills' ? profile.skills.join('\n') : profile[key]);
    }
    async function inspectProfile(profile) {
      for (const [key, label] of Object.entries(labels)) {
        const expected = key === 'skills' ? profile.skills.join('\n') : profile[key];
        assert(await p.getByLabel(label, { exact: true }).inputValue() === expected, 'Champ profil perdu : ' + key);
      }
    }
    async function fillInterview(name = company) {
      mark('saisie entretien');
      await p.getByLabel('Entreprise obligatoire').fill(name);
      await p.getByLabel('Date de l’entretien obligatoire').fill('19/10/2026');
      await p.getByLabel('Poste obligatoire').fill(position);
      await p.getByLabel('Contrat obligatoire', { exact: true }).fill('CDI fictif');
      await p.getByLabel('Performance des conditions', { exact: true }).fill('0');
      await p.getByLabel('Compatibilité', { exact: true }).fill('');
    }
    async function step(id, run) {
      mark(id);
      const item = { id, started: stamp() };
      result.scenarios.push(item);
      try { Object.assign(item, await run(), { status: 'réussi', finished: stamp() }); }
      catch (error) { Object.assign(item, { status: 'échoué', error: error.message, finished: stamp() }); throw error; }
    }
    function observe(c) {
      const requests = new Map();
      c.on('request', (request) => {
        const row = { time: stamp(), launch, phase, url: request.url(), method: request.method(), type: request.resourceType(), body: request.postData(), status: null, failure: null };
        requests.set(request, row); net.requests.push(row);
      });
      c.on('response', (response) => { const row = requests.get(response.request()); if (row) row.status = response.status(); });
      c.on('requestfailed', (request) => { const row = requests.get(request); if (row) row.failure = request.failure()?.errorText; });
      c.on('page', observePage);
      for (const page of c.pages()) observePage(page);
    }
    function observePage(page) {
      page.on('pageerror', (error) => result.pageErrors.push({ time: stamp(), launch, phase, error: error.message }));
      page.on('websocket', (socket) => {
        const row = { url: socket.url(), launch, opened: stamp(), sent: [], received: [], errors: [] };
        net.websockets.push(row);
        socket.on('framesent', ({ payload }) => row.sent.push({ time: stamp(), phase, payload: typeof payload === 'string' ? payload : Array.from(payload) }));
        socket.on('framereceived', ({ payload }) => row.received.push({ time: stamp(), phase, payload: typeof payload === 'string' ? payload : Array.from(payload) }));
        socket.on('socketerror', (error) => row.errors.push(String(error)));
        socket.on('close', () => { row.closed = stamp(); });
      });
    }
    try {
      context = await browserType.launchPersistentContext(profilePath, options);
      observe(context);
      p = context.pages()[0] || await context.newPage();
      p.setDefaultTimeout(8000);
      result.browser = context.browser().version();
      await p.goto(url);
      await p.getByRole('heading', { name: 'Mes entretiens', exact: true }).waitFor();
      result.userAgent = await p.evaluate(() => navigator.userAgent);
      assert(await raw() === null, 'Profil de recette non neuf');

      let originalA;
      await step('S1', async () => {
        await visible(p.getByRole('heading', { name: 'Votre prochain entretien commence ici' }), 'État vide absent');
        await shot('vide');
        await p.getByRole('button', { name: 'Créer mon premier entretien' }).click();
        await fillInterview();
        await p.getByLabel('Feeling', { exact: true }).selectOption('OK');
        await shot('formulaire');
        await submitInterview(); await saved('Entretien enregistré.');
        const data = await stored();
        assert(data.profile === null && data.interviews.length === 1, 'Création sans profil incorrecte');
        originalA = data.interviews[0];
        assert(originalA.company === company && originalA.position === position && originalA.date === '2026-10-19' && originalA.contract === 'CDI fictif', 'Champs non conservés');
        assert(originalA.conditionsRating === 0 && !('compatibilityRating' in originalA), 'Zéro confondu avec absence');
        const detail = await p.locator('app-interview-detail').innerText();
        assert(detail.includes('0 / 10') && detail.includes('Non noté'), 'Notes incorrectes au détail');
        await shot('detail'); await listNav();
        const list = await p.locator('app-interview-list').innerText();
        assert(list.includes('0 / 10') && list.includes('Non noté'), 'Notes incorrectes dans la liste');
        await shot('liste');
        return { saved: data, profileRequired: false, zeroAndMissingDistinct: true };
      });
      await step('S2', async () => {
        await profileNav(); await fillProfile(p1); await submitProfile(); await saved('Profil enregistré.');
        await inspectProfile(p1);
        let data = await stored();
        assert(JSON.stringify(data.profile) === JSON.stringify(p1), 'Profil P1 incomplet');
        assert(JSON.stringify(data.interviews[0]) === JSON.stringify(originalA), 'Profil P1 modifiant A');
        await fillProfile(p2); await submitProfile(); await saved('Profil enregistré.');
        data = await stored(); await inspectProfile(p2);
        assert(JSON.stringify(data.interviews[0]) === JSON.stringify(originalA), 'Profil P2 modifiant A');
        await shot('profil'); await listNav();
        await p.getByRole('button', { name: 'Nouvel entretien', exact: false }).click();
        await fillInterview();
        await p.getByLabel('Feeling', { exact: true }).selectOption('OK');
        await p.getByLabel('Feeling', { exact: true }).selectOption('Pas top');
        await submitInterview(); await saved('Entretien enregistré.'); data = await stored();
        const second = data.interviews[1];
        assert(data.interviews.length === 2 && second.id !== originalA.id, 'Entretiens fusionnés');
        assert(second.conditionsRating === 0 && !('compatibilityRating' in second) && second.feeling === 'Pas top', 'Feeling modifiant les notes');
        assert(JSON.stringify(data.interviews[0]) === JSON.stringify(originalA), 'Nouvel entretien modifiant A');
        return { saved: data, independentProfile: true, independentFeeling: true, distinctIds: true };
      });
      await step('S3', async () => {
        await listNav(); await p.getByRole('button', { name: 'Nouvel entretien', exact: false }).click();
        const before = await raw();
        await submitInterview();
        await p.waitForFunction(() => document.querySelectorAll('[aria-invalid=true]').length === 4);
        assert(await p.locator('[aria-invalid=true]').count() === 4, 'Champs requis non signalés');
        assert(await p.getByLabel('Entreprise obligatoire').evaluate((e) => e === document.activeElement), 'Focus invalide absent');
        assert(await raw() === before, 'Écriture formulaire vide');
        await shot('invalide-requis');
        await fillInterview(); await p.getByLabel('Date de l’entretien obligatoire').fill('31/02/2026'); await submitInterview();
        await p.waitForFunction(() => document.querySelector('#date-error')?.textContent.includes('date réelle'));
        assert((await p.locator('#date-error').innerText()).includes('date réelle'), 'Date impossible acceptée');
        assert(await raw() === before, 'Écriture date invalide');
        await p.getByLabel('Date de l’entretien obligatoire').fill('19/10/2026');
        for (const label of ['Performance des conditions', 'Compatibilité']) {
          for (const value of ['-1', '11', '2.5']) {
            await p.getByLabel(label, { exact: true }).fill(value); await submitInterview();
            await visible(p.getByText('Saisissez une note entière entre 0 et 10, ou laissez ce champ vide.', { exact: true }), 'Note invalide acceptée : ' + label + '=' + value);
            assert(await raw() === before, 'Écriture note invalide');
            assert(!(await p.getByRole('status').innerText()).includes('enregistré'), 'Faux succès formulaire invalide');
          }
          await p.getByLabel(label, { exact: true }).fill(label === 'Compatibilité' ? '' : '0');
        }
        await shot('invalide-note');
        return { unchangedStorage: true, cases: ['4 champs requis', '31/02/2026', 'conditions -1/11/2.5', 'compatibilité -1/11/2.5'] };
      });
      await step('S4', async () => {
        const before = await raw(); const failedCompany = variant.marker + ' Sauvegarde fictive refusée JV-P4';
        await fillInterview(failedCompany);
        await p.evaluate(() => {
          window.__qaNativeSetItem = Storage.prototype.setItem; window.__qaAttempts = 0;
          Storage.prototype.setItem = function (key, value) {
            if (key === 'jobview:data') { window.__qaAttempts++; throw new DOMException('Quota fictif JV-P4', 'QuotaExceededError'); }
            return window.__qaNativeSetItem.call(this, key, value);
          };
        });
        let attempts;
        try {
          await submitInterview();
          await visible(p.getByRole('alert').filter({ hasText: 'stockage du navigateur est saturé' }), 'Quota entretien invisible');
          assert(await raw() === before, 'Données perdues après quota entretien');
          assert(await p.getByLabel('Entreprise obligatoire').inputValue() === failedCompany, 'Brouillon entretien perdu');
          assert(!(await p.getByRole('status').innerText()).includes('enregistré'), 'Faux succès entretien');
          await shot('echec-entretien'); await listNav();
          assert(await p.locator('app-interview-list li').count() === 2, 'Entretien en échec présenté comme sauvegardé');
          await profileNav();
          await p.getByLabel('Métier recherché', { exact: true }).fill(variant.marker + ' Profil fictif refusé JV-P4');
          await submitProfile();
          await visible(p.getByRole('alert').filter({ hasText: 'stockage du navigateur est saturé' }), 'Quota profil invisible');
          assert(await raw() === before, 'Données perdues après quota profil');
          assert(await p.getByLabel('Métier recherché', { exact: true }).inputValue() === variant.marker + ' Profil fictif refusé JV-P4', 'Brouillon profil perdu');
          assert(!(await p.getByRole('status').innerText()).includes('enregistré'), 'Faux succès profil');
          attempts = await p.evaluate(() => window.__qaAttempts);
          assert(attempts === 2, 'Nombre inattendu de tentatives'); await shot('echec-profil');
        } finally {
          await p.evaluate(() => { Storage.prototype.setItem = window.__qaNativeSetItem; delete window.__qaNativeSetItem; delete window.__qaAttempts; });
        }
        await fillProfile(p2); await submitProfile(); await saved('Profil enregistré.');
        await listNav(); await p.getByRole('button', { name: 'Nouvel entretien', exact: false }).click();
        assert(await p.getByLabel('Entreprise obligatoire').inputValue() === failedCompany, 'Brouillon perdu après navigation');
        await submitInterview(); await saved('Entretien enregistré.'); const data = await stored();
        assert(data.interviews.length === 3 && new Set(data.interviews.map((i) => i.id)).size === 3, 'Nouvelle tentative absente ou dupliquée');
        assert(JSON.stringify(data.interviews[0]) === JSON.stringify(originalA), 'Données initiales modifiées');
        return { failedAttempts: attempts, previousDataPreserved: true, draftsRetained: true, noFalseSuccess: true, retryWithoutDuplicate: true };
      });
      await step('S5', async () => {
        const before = await raw(); const expected = JSON.parse(before);
        await profileNav(); await inspectProfile(p2); await shot('avant-reouverture-profil');
        await listNav(); await shot('avant-reouverture-liste');
        const b = context.browser();
        const proof = { profile: variant.name, profilePathBefore: profilePath, profilePathAfter: profilePath, originBefore: new URL(p.url()).origin, before, closeStarted: stamp(), browserVersion: b.version(), launchOptions: options };
        let disconnectedAt;
        b.on('disconnected', () => { disconnectedAt = stamp(); });
        mark('S5 fermeture complète'); await context.close(); context = null;
        proof.closeCompleted = stamp(); proof.disconnectedAt = disconnectedAt; proof.isConnectedAfterClose = b.isConnected();
        assert(disconnectedAt && !b.isConnected(), 'Fermeture complète non établie');
        launch = 2; mark('S5 nouveau lancement'); proof.relaunchStarted = stamp();
        context = await browserType.launchPersistentContext(profilePath, options); observe(context);
        p = context.pages()[0] || await context.newPage(); p.setDefaultTimeout(8000);
        const response = await p.goto(url);
        proof.serverStatusAfter = response.status(); proof.originAfter = new URL(p.url()).origin;
        await p.getByRole('heading', { name: 'Mes entretiens', exact: true }).waitFor();
        proof.after = await raw(); proof.reopened = stamp();
        assert(proof.before === proof.after && proof.originAfter === proof.originBefore && proof.serverStatusAfter === 200, 'Persistance inexacte après réouverture');
        assert(context.browser() !== b && context.browser().isConnected(), 'Nouveau navigateur absent');
        await shot('apres-reouverture-liste'); await profileNav(); await inspectProfile(expected.profile); await shot('apres-reouverture-profil');
        await listNav();
        assert(await p.locator('app-interview-list li').count() === expected.interviews.length, 'Liste incomplète après réouverture');
        for (let index = 0; index < expected.interviews.length; index++) {
          const interview = expected.interviews[index];
          await p.locator('app-interview-list li button').nth(index).click();
          await visible(p.locator('app-interview-detail').getByRole('heading', { name: interview.company, exact: true }), 'Détail non retrouvé');
          const detail = await p.locator('app-interview-detail').innerText();
          assert(detail.includes(interview.position) && detail.includes(interview.contract) && detail.includes('19/10/2026') && detail.includes('0 / 10') && detail.includes('Non noté'), 'Détail inexact après réouverture');
          if (interview.feeling) assert(detail.includes(interview.feeling), 'Feeling perdu');
          if (index === 0) await shot('apres-reouverture-detail');
          await listNav();
        }
        proof.uiProfileFieldsVerified = 7; proof.uiInterviewsVerified = expected.interviews.length; proof.status = 'réussi';
        output.reopenings.push(proof);
        return { profileFieldsVerified: 7, interviewsVerified: expected.interviews.length, exactRawEquality: true, fullBrowserDisconnected: true, newBrowserLaunched: true };
      });
      await step('S6', async () => {
        await noOverflow('liste finale'); await profileNav(); await noOverflow('profil final');
        if (!variant.mobile) {
          async function tabTo(selector) {
            for (let count = 0; count < 45; count++) {
              await p.keyboard.press('Tab');
              if (await p.locator(selector).first().evaluate((e) => e === document.activeElement)) return;
            }
            throw new Error('Cible clavier inaccessible : ' + selector);
          }
          await tabTo('nav button:nth-of-type(1)'); await p.keyboard.press('Enter');
          await tabTo('app-interview-list .page-heading button'); await p.keyboard.press('Enter');
          await tabTo('#interview-company'); await p.keyboard.type('PC Clavier fictif JV-P4');
          await p.keyboard.press('Tab'); await p.keyboard.type('19/10/2026');
          await p.keyboard.press('Tab'); await p.keyboard.type('Poste clavier fictif JV-P4');
          await p.keyboard.press('Tab'); await p.keyboard.type('CDI fictif');
          await p.keyboard.press('Tab'); await p.keyboard.type('0');
          await tabTo('app-interview-form button[type=submit]'); await p.keyboard.press('Enter'); await saved('Entretien enregistré.');
          assert(await p.locator('#detail-heading').evaluate((e) => e === document.activeElement), 'Focus absent au détail');
          await tabTo('app-interview-detail button'); await p.keyboard.press('Enter');
          await tabTo('app-interview-list li button'); await p.keyboard.press('Enter');
          await tabTo('nav button:nth-of-type(2)'); await p.keyboard.press('Enter');
          await tabTo('#skills'); await p.keyboard.press('ControlOrMeta+A'); await p.keyboard.type('Angular fictif\nJava fictif');
          await tabTo('app-profile-form button[type=submit]'); await p.keyboard.press('Enter'); await saved('Profil enregistré.');
          await shot('clavier');
        }
        return { noHorizontalOverflow: true, keyboardOnlyJourney: !variant.mobile, mobileEmulated: variant.mobile };
      });
      await step('S7', async () => {
        assert(net.markers.some((m) => m.launch === 1) && net.markers.some((m) => m.launch === 2), 'Observation manquante à un lancement');
        const emissions = net.requests.map((r) => r.url + '\n' + (r.body || '')).concat(net.websockets.flatMap((s) => s.sent.map((f) => String(f.payload))));
        const markers = ['JV-P4', 'fictif', 'Angular fictif', 'Java fictif', '40–45', 'Deux jours', 'Trois jours', company, position];
        const leaks = [];
        for (const payload of emissions) {
          let decoded = payload; try { decoded = decodeURIComponent(payload); } catch { /* Non-URI body. */ }
          for (const marker of markers) {
            if (decoded.toLowerCase().includes(marker.toLowerCase()) || payload.includes(encodeURIComponent(marker))) leaks.push({ marker, payload });
          }
        }
        const origins = [...new Set(net.requests.map((r) => new URL(r.url).origin))];
        assert(origins.every((origin) => origin === new URL(url).origin), 'Destination réseau inattendue');
        assert(leaks.length === 0, 'Donnée métier transmise');
        assert(net.requests.every((r) => r.body === null && r.method === 'GET'), 'Corps/méthode inattendu à examiner');
        assert(result.pageErrors.length === 0, 'Erreur JavaScript applicative');
        net.analysis = { origins, requests: net.requests.length, websocketConnections: net.websockets.length, sentFrames: net.websockets.reduce((sum, s) => sum + s.sent.length, 0), allRequestsGetWithoutBody: true, businessMarkerMatches: leaks, scope: 'Pages et transports observés pendant ces scénarios uniquement ; HTTP(S) et WebSocket.' };
        return net.analysis;
      });
      result.finalStoredData = await stored(); result.status = 'réussi';
    } catch (error) {
      result.status = 'échoué'; result.error = error.message;
      if (p && !p.isClosed()) {
        try { await p.screenshot({ path: evidence + variant.name + '-diagnostic.png', fullPage: true }); } catch { /* Preserve the original failure. */ }
      }
    } finally {
      if (context) {
        if (p && !p.isClosed()) await p.evaluate(() => { if (window.__qaNativeSetItem) Storage.prototype.setItem = window.__qaNativeSetItem; }).catch(() => {});
        await context.close();
      }
      result.dedicatedBrowserClosed = true;
      result.finished = stamp();
    }
  }
  // Vite's ephemeral connection token is unrelated to the tested business data.
  // Check the complete URLs above, then omit that credential from saved evidence.
  for (const network of output.network) {
    for (const request of network.requests) request.url = request.url.replace(/([?&]token=)[^&#]*/gi, '$1[redacted]');
    for (const socket of network.websockets) socket.url = socket.url.replace(/([?&]token=)[^&#]*/gi, '$1[redacted]');
    network.redaction = 'Seule la valeur du jeton de connexion Vite est masquée dans les URL sauvegardées ; analyse effectuée avant masquage.';
  }
  output.finished = new Date().toISOString();
  output.status = output.profiles.every((p) => p.status === 'réussi') ? 'réussi' : 'échoué';
  return output;
}
