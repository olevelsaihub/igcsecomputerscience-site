/* 4CP0 Paper 2 coding pages: runs one Python program in Pyodide inside a Web Worker.
 * Message in:  {id, code, stdin, files: {name: text}, read: [names], randomSeed}
 * Message out: {id, ok, stdout, stderr, files: {name: text|null}, error}
 * The page terminates this worker if a run takes too long (infinite-loop guard) and starts a new one.
 * Pyodide is self-hosted under assets/vendor/pyodide/ (pinned version, see pyodide.lock.json). */
'use strict';
let pyodideReady = null;

function base() {
  return self.location.href.replace(/assets\/py-worker\.js.*$/, '');
}

function boot() {
  if (!pyodideReady) {
    const indexURL = base() + 'assets/vendor/pyodide/';
    importScripts(indexURL + 'pyodide.js');
    pyodideReady = self.loadPyodide({ indexURL });
  }
  return pyodideReady;
}

const RUNNER = `
import sys, io, os, random, builtins, traceback
_src, _stdin, _seed = __cs_src, __cs_stdin, __cs_seed
_out, _err = io.StringIO(), io.StringIO()
_old = (sys.stdout, sys.stderr, sys.stdin)
sys.stdout, sys.stderr, sys.stdin = _out, _err, io.StringIO(_stdin)
_ok = True
try:
    if _seed is not None:
        random.seed(int(_seed))
    exec(compile(_src, 'main.py', 'exec'), {'__name__': '__main__'})
except SystemExit:
    pass
except BaseException:
    _ok = False
    traceback.print_exc(limit=-3)
finally:
    sys.stdout, sys.stderr, sys.stdin = _old
(_ok, _out.getvalue(), _err.getvalue())
`;

self.onmessage = async (event) => {
  const msg = event.data;
  try {
    const py = await boot();
    const dir = '/home/pyodide/work';
    try { py.FS.mkdirTree(dir); } catch (e) { /* exists */ }
    for (const name of py.FS.readdir(dir)) {
      if (name !== '.' && name !== '..') { try { py.FS.unlink(dir + '/' + name); } catch (e) { /* ignore */ } }
    }
    for (const [name, text] of Object.entries(msg.files || {})) py.FS.writeFile(dir + '/' + name, text);
    py.runPython(`import os; os.chdir(${JSON.stringify(dir)})`);
    py.globals.set('__cs_src', msg.code);
    py.globals.set('__cs_stdin', msg.stdin || '');
    py.globals.set('__cs_seed', msg.randomSeed === undefined ? null : msg.randomSeed);
    const result = py.runPython(RUNNER).toJs();
    const files = {};
    for (const name of msg.read || []) {
      try { files[name] = py.FS.readFile(dir + '/' + name, { encoding: 'utf8' }); } catch (e) { files[name] = null; }
    }
    self.postMessage({ id: msg.id, ok: result[0], stdout: result[1], stderr: result[2], files });
  } catch (e) {
    self.postMessage({ id: msg.id, ok: false, stdout: '', stderr: String(e), files: {}, error: 'runner' });
  }
};
