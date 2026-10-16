<?php
/**
 * Computer Science 4CP0 answer checking (server side). Mirrors work/marking.py; no AI at marking time.
 * POST {"part": id, "answer": text} -> feedback after submission.
 * Rules come from the private bundle outside the web root (never served):
 *   {private_dir}/cs-marking/bundle.json   (built by work/build_marking_bundle.py)
 * PHP 7.4 compatible. Live endpoint on the open-access site: POST /check (see the guards at the end of this file).
 */
declare(strict_types=1);

function cs_mk_numbers(string $text): array {
    $out = [];
    if (!preg_match_all('/[-\x{2212}\x{2013}]?\d[\d\s,]*(?:\.\d+)?/u', $text, $m)) return $out;
    foreach ($m[0] as $raw) {
        $raw = preg_replace('/(?<=\d)[\s,](?=\d{3}(?!\d))/u', '', $raw);
        $raw = str_replace([' ', "\u{2212}", "\u{2013}"], ['', '-', '-'], $raw);
        if (is_numeric($raw)) $out[] = (float)$raw;
    }
    return $out;
}

function cs_mk_close(float $x, array $values, float $tol): bool {
    foreach ($values as $v) if (abs($x - (float)$v) <= max($tol, 1e-9) + 1e-9) return true;
    return false;
}

function cs_mk_norm(string $text): string {
    $t = preg_replace('/[\s,\'"`\x{2018}\x{2019}\x{201C}\x{201D}]/u', '', $text);
    return rtrim(mb_strtoupper((string)$t, 'UTF-8'), '.');
}

function cs_mk_check(array $rule, string $answer): array {
    $mode = $rule['mode'];
    if ($mode === 'mcq') {
        if (!empty($rule['void'])) {
            return ['mode' => 'mcq', 'marks' => $rule['max'], 'max' => $rule['max'], 'correct' => null,
                    'feedback' => 'This question had no correct option in the exam, so every candidate was given the mark.'];
        }
        $letter = strtoupper(substr(trim($answer), 0, 1));
        $ok = $letter === $rule['key'];
        $fb = ['mode' => 'mcq', 'marks' => $ok ? $rule['max'] : 0, 'max' => $rule['max'], 'correct' => $ok,
               'key' => $rule['key'], 'why' => $rule['why'] ?? ''];
        if (!$ok && isset($rule['distractor_notes'][$letter])) $fb['your_option'] = $rule['distractor_notes'][$letter];
        return $fb;
    }
    if ($mode === 'numeric') {
        $ans = $rule['answer'];
        $tol = (float)($ans['tol'] ?? 0);
        $nums = cs_mk_numbers($answer);
        $final = $nums ? end($nums) : null;
        if ($final !== null && cs_mk_close($final, $ans['values'], $tol)) {
            return ['mode' => 'numeric', 'marks' => $rule['max'], 'max' => $rule['max'], 'correct' => true,
                    'working' => $rule['working'] ?? '', 'why' => $rule['why'] ?? ''];
        }
        $got = 0; $steps = [];
        foreach ($rule['partial'] ?? [] as $p) {
            $hit = false;
            // method marks need the intermediate value itself: within 0.2% (at least 0.0005), not a loose band
            foreach ($nums as $n) foreach ($p['accept_values'] ?? [] as $v) if (abs($n - (float)$v) <= max(abs((float)$v) * 0.002, 0.0005) + 1e-9) { $hit = true; break 2; }
            $steps[] = ['label' => $p['label'], 'found' => $hit];
            if ($hit) $got += (int)$p['marks'];
        }
        return ['mode' => 'numeric', 'marks' => min($got, $rule['max'] - 1), 'max' => $rule['max'], 'correct' => false,
                'steps' => $steps, 'working' => $rule['working'] ?? '', 'why' => $rule['why'] ?? ''];
    }
    if ($mode === 'exact') {
        $got = cs_mk_norm($answer);
        foreach ($rule['answer']['accept'] as $a) {
            if ($got === cs_mk_norm((string)$a)) {
                return ['mode' => 'exact', 'marks' => $rule['max'], 'max' => $rule['max'], 'correct' => true,
                        'working' => $rule['working'] ?? '', 'why' => $rule['why'] ?? ''];
            }
        }
        $marks = 0; $steps = [];
        foreach ($rule['partial'] ?? [] as $p) {
            $hit = false;
            foreach ($p['accept'] ?? [] as $a) { $n = cs_mk_norm((string)$a); if ($n !== '' && strpos($got, $n) !== false) { $hit = true; break; } }
            $steps[] = ['label' => $p['label'], 'found' => $hit];
            if ($hit) $marks += (int)$p['marks'];
        }
        return ['mode' => 'exact', 'marks' => min($marks, $rule['max'] - 1), 'max' => $rule['max'], 'correct' => false,
                'steps' => $steps, 'working' => $rule['working'] ?? '', 'why' => $rule['why'] ?? ''];
    }
    if ($mode === 'self') {
        return ['mode' => 'self', 'marks' => null, 'max' => $rule['max'], 'ideal' => $rule['ideal'],
                'checklist' => $rule['checklist'], 'levels' => $rule['levels'] ?? null, 'tip' => $rule['self_mark_tip'] ?? ''];
    }
    throw new RuntimeException('unknown mode');
}

/** Public endpoint: POST {part, answer} -> marking JSON. Called by the engine's open-check.php wrapper, or directly below. */
function cs_mk_endpoint(): void {
    // Public endpoint on the open-access site (POST /check, routed by .htaccess). It guards itself and does not rely on
    // a sign-in gate: POST only, HTTPS (localhost allowed for tests), no crawlers or scripted clients, small bodies.
    header('Content-Type: application/json');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex, nofollow');
    $fail = function (int $status, string $message): void { http_response_code($status); echo json_encode(['error' => $message]); exit; };
    $host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
    $local = (bool)preg_match('/^(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/', $host);
    $https = (($_SERVER['HTTPS'] ?? '') !== '' && strtolower((string)$_SERVER['HTTPS']) !== 'off')
        || strtolower((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https';
    if (!$https && !$local) $fail(403, 'HTTPS only.');
    $ua = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
    if ($ua === '' || preg_match('~bot|crawl|spider|scrap|ChatGPT-User|Claude-User|Perplexity-User|anthropic-ai|cohere-ai|Google-Extended|meta-external|facebookexternalhit|BingPreview|ia_archiver|archive\.org|omgili|ImageSift|curl/|wget/|python[-/]|httpx/|aiohttp/|libwww-perl|Go-http-client|Java/|node-fetch|undici|axios/|PostmanRuntime|HeadlessChrome|PhantomJS|HTTrack|Selenium|Playwright|Puppeteer~i', $ua)) {
        $fail(403, 'Automated clients are not allowed.');
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { header('Allow: POST'); $fail(405, 'POST only.'); }
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) $fail(413, 'Answer too long.');
    try {
        require_once dirname(__DIR__) . '/cs-config.php';
        $config = cs_config();
        if (!empty($config['bundle_key'])) {   // open deploy: marking/bundle.sealed, key only in the private config
            require_once __DIR__ . '/olv-bundle.php';
            $bundle = olv_open_bundle(__DIR__ . '/bundle.sealed', (string)$config['bundle_key']);
        } else {
            $bundleFile = rtrim((string)$config['private_dir'], '/') . '/cs-marking/bundle.json';
            $bundle = is_file($bundleFile) ? json_decode((string)file_get_contents($bundleFile), true) : null;
        }
    } catch (Throwable $e) {
        $bundle = null;
    }
    if (!is_array($bundle) || !isset($bundle['rules'])) $fail(503, 'Answer checking is not available right now.');
    $raw = (string)file_get_contents('php://input', false, null, 0, 20001);
    if (strlen($raw) > 20000) $fail(413, 'Answer too long.');
    $req = json_decode($raw, true);
    if (!is_array($req)) $fail(400, 'Send JSON: {"part": ..., "answer": ...}.');
    $rule = $bundle['rules'][(string)($req['part'] ?? '')] ?? null;
    if (!$rule) $fail(404, 'No checking rule for this part.');
    try {
        echo json_encode(cs_mk_check($rule, substr((string)($req['answer'] ?? ''), 0, 5000)));
    } catch (Throwable $e) {
        $fail(500, 'Answer checking is not available right now.');
    }
}

if (PHP_SAPI !== 'cli' && basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'] ?? '')) {
    cs_mk_endpoint();
}
