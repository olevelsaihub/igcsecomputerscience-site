/* 4CP0 Paper 2 coding page: editor (CodeMirror 6) + Python in the browser (Pyodide in a Web Worker).
 * Data: <script type="application/json" id="cs-code-data"> {part, seedName, seed, files, finished, tests(base64), base}
 * "Run" uses the stdin box. "Run the checks" runs the hidden cases (some with changed data the page never shows),
 * marks cases that also pass on the untouched starter file or an empty file as "no credit", and lists the scheme points evidenced.
 * Points a test cannot judge are a self-check list. Nothing here holds a model solution. */
(function () {
  'use strict';
  const root = document.querySelector('[data-cs-coding]');
  if (!root) return;
  const data = JSON.parse(document.getElementById('cs-code-data').textContent);
  const tests = JSON.parse(decodeURIComponent(escape(atob(data.tests))));
  const LIMIT_MS = 10000;
  const storeKey = 'cs4cp0-code:' + data.part;
  let worker = null, nextId = 1;
  const pending = new Map();

  function startWorker() {
    worker = new Worker(data.base + 'assets/py-worker.js');
    worker.onmessage = (ev) => {
      const p = pending.get(ev.data.id);
      if (p) { clearTimeout(p.timer); pending.delete(ev.data.id); p.resolve(ev.data); }
    };
  }

  function run(code, stdin, files, read, randomSeed) {
    if (!worker) startWorker();
    const id = nextId++;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        pending.delete(id);
        worker.terminate();
        worker = null;
        resolve({ id, ok: false, stdout: '', stderr: 'Stopped after ' + LIMIT_MS / 1000 + ' seconds. Check for a loop that never ends, or a program waiting for more input than the test gives.', files: {}, timeout: true });
      }, LIMIT_MS + 15000);   // first run also loads Python (a few seconds)
      pending.set(id, { resolve, timer });
      worker.postMessage({ id, code, stdin, files, read, randomSeed });
    });
  }

  // ---- same rules as work/s4_run_code_checks.py
  const norm = (s) => String(s || '').replace(/\r\n/g, '\n').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/^\n+|\n+$/g, '');
  // Tests are written for Python's re with re.M | re.S. Translate Python-only syntax to JavaScript:
  // leading inline flags (?i)(?m)(?s), \A and \Z/\z anchors, named groups (?P<n>...) and (?P=n).
  function pyRegex(value) {
    let src = String(value), flags = 'ms';
    for (let m; (m = src.match(/^\(\?([aiLmsux]+)\)/));) { src = src.slice(m[0].length); if (m[1].includes('i')) flags += flags.includes('i') ? '' : 'i'; }
    src = src.replace(/\\A/g, '(?<![\\s\\S])').replace(/\\[Zz]/g, '(?![\\s\\S])')
             .replace(/\(\?P</g, '(?<').replace(/\(\?P=(\w+)\)/g, '\\k<$1>');
    return new RegExp(src, flags);
  }
  function check(kind, value, text) {
    const t = norm(text);
    const vals = Array.isArray(value) ? value : [value];
    if (kind === 'exact') return t === norm(value);
    if (kind === 'contains') return vals.every((v) => t.includes(norm(v)));
    if (kind === 'not_contains') return !vals.some((v) => t.includes(norm(v)));
    if (kind === 'regex') return pyRegex(value).test(t);
    if (kind === 'lines_in_order') {
      let pos = 0;
      for (const v of value) { const i = t.indexOf(norm(v), pos); if (i < 0) return false; pos = i + norm(v).length; }
      return true;
    }
    return false;
  }
  function patchSource(src, patches) {
    const lines = src.split('\n');
    for (const [name, literal] of Object.entries(patches || {})) {
      const re = new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*=');
      const i = lines.findIndex((l) => re.test(l));
      if (i < 0) throw new Error('The program no longer sets ' + name + ', which the checks need.');
      let j = i, depth = 0;
      for (;;) {
        depth += (lines[j].match(/[[({]/g) || []).length - (lines[j].match(/[\])}]/g) || []).length;
        if (depth <= 0 || j + 1 >= lines.length) break;
        j++;
      }
      lines.splice(i, j - i + 1, name + ' = ' + literal);
    }
    return lines.join('\n');
  }

  // ---- editor
  const host = root.querySelector('[data-editor]');
  let saved = null;
  try { saved = localStorage.getItem(storeKey); } catch (e) { /* private mode */ }
  const view = window.CSEditor.create(host, saved || data.seed);
  host.__csView = view;   // for automated page checks
  const out = root.querySelector('[data-output]');
  const results = root.querySelector('[data-results]');
  const status = root.querySelector('[data-status]');
  const save = () => { try { localStorage.setItem(storeKey, window.CSEditor.get(view)); } catch (e) { /* ignore */ } };
  host.addEventListener('keyup', save);

  root.querySelector('[data-reset]').addEventListener('click', () => {
    if (confirm('Replace your code with the original starter file?')) { window.CSEditor.set(view, data.seed); save(); }
  });
  root.querySelector('[data-download]').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([window.CSEditor.get(view)], { type: 'text/x-python' }));
    a.download = data.finished + '.py';
    a.click();
  });
  root.querySelector('[data-run]').addEventListener('click', async () => {
    save();
    status.textContent = 'Running… (the first run loads Python, which takes a few seconds)';
    out.textContent = '';
    const r = await run(window.CSEditor.get(view), root.querySelector('[data-stdin]').value, data.files, Object.keys(data.files), undefined);
    out.textContent = r.stdout + (r.stderr ? '\n' + r.stderr : '');
    status.textContent = r.ok ? 'Finished.' : (r.timeout ? 'Stopped (time limit).' : 'Your program stopped with an error.');
  });
  root.querySelector('[data-check]').addEventListener('click', async () => {
    save();
    results.innerHTML = '';
    status.textContent = 'Running the checks…';
    const code = window.CSEditor.get(view);
    const evidenced = new Set();
    let passed = 0, scored = 0;
    for (const [n, c] of tests.cases.entries()) {
      let src, r;
      try { src = patchSource(code, c.patch_assignments); } catch (e) { r = { ok: false, stdout: '', stderr: e.message, files: {} }; }
      const files = Object.assign({}, data.files, c.files || {});
      const read = (c.file_checks || []).map((f) => f.file);
      if (!r) r = await run(src, c.stdin || '', files, read, c.random_seed);
      let ok = r.ok || !!c.expect_error;
      try {
        if (c.check) ok = ok && check(c.check.type, c.check.value, r.stdout);
        for (const fc of c.file_checks || []) ok = ok && r.files && r.files[fc.file] != null && check(fc.type, fc.value, r.files[fc.file]);
      } catch (e) { ok = false; }
      const noCredit = !!c.passes_on_seed;
      if (ok && !noCredit) passed++;   // a check the starter or an empty file passes proves nothing
      if (ok && !noCredit) { scored++; (c.awards || []).forEach((a) => evidenced.add(a)); }
      const li = document.createElement('li');
      li.className = ok ? (noCredit ? 'cs-case nocredit' : 'cs-case pass') : 'cs-case fail';
      li.innerHTML = '<strong>Check ' + (n + 1) + (c.hidden ? ' (hidden data)' : '') + ':</strong> ' + (ok ? 'passed' : 'not yet') +
        (noCredit ? ' · no credit (the starter file or an empty file already does this)' : '') +
        (c.awards && c.awards.length ? ' · shows ' + c.awards.join(', ') : '');
      if (!ok && !c.hidden) {
        const pre = document.createElement('pre');
        pre.textContent = (c.stdin ? 'Input given:\n' + c.stdin + '\n' : '') + 'Your output:\n' + (r.stdout || '(nothing)') + (r.stderr ? '\n' + r.stderr : '');
        li.appendChild(pre);
      }
      results.appendChild(li);
    }
    const pts = [...evidenced].sort();
    const free = tests.cases.filter((c) => c.passes_on_seed).length;
    status.textContent = passed + ' of ' + (tests.cases.length - free) + ' checks passed' +
      (free ? ' (' + free + ' more give no credit: an empty or starter file passes them)' : '') + '. Marking points shown by running: ' + (pts.length ? pts.join(', ') : 'none yet') +
      '. Now tick the self-check list below for the points a test cannot judge.';
  });
})();
