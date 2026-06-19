<?php
// ONE-TIME USE MALWARE SCANNER - DELETE AFTER USE
// Password protect this file
$access_key = 'digi2024scan';
if (!isset($_GET['key']) || $_GET['key'] !== $access_key) {
    die('Access denied. Add ?key=digi2024scan to the URL.');
}

$root = __DIR__;
$malware_found = [];
$suspicious_files = [];

$malware_patterns = [
    'eval(base64_decode',
    'eval(gzinflate',
    'eval(str_rot13',
    'eval(gzuncompress',
    'eval(rawurldecode',
    '\$_POST[\'cmd\']',
    '\$_GET[\'cmd\']',
    'shell_exec(',
    'passthru(',
    'FilesMan',
    'r57shell',
    'c99shell',
    'WSO Shell',
    'b374k',
    'preg_replace.*\/e',
    'assert(\$_',
    'system(\$_',
    'exec(\$_',
    'base64_decode.*eval',
    'gzinflate.*base64',
    'str_replace.*chr(',
    'create_function.*eval',
    '\$GLOBALS.*eval',
];

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($root, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

$scanned = 0;
foreach ($iterator as $file) {
    if ($file->isFile() && in_array(strtolower($file->getExtension()), ['php', 'js', 'html', 'htm'])) {
        $scanned++;
        $path = $file->getRealPath();
        $content = @file_get_contents($path);
        if ($content === false) continue;

        foreach ($malware_patterns as $pattern) {
            if (preg_match('/' . $pattern . '/i', $content)) {
                $malware_found[] = [
                    'file' => str_replace($root, '', $path),
                    'pattern' => $pattern,
                    'modified' => date('Y-m-d H:i:s', filemtime($path)),
                    'size' => filesize($path),
                ];
                break;
            }
        }

        // Check for suspicious filenames
        $basename = strtolower(basename($path));
        if (preg_match('/^[a-z0-9]{6,12}\.php$/', $basename) &&
            !in_array($basename, ['wp-login.php', 'wp-cron.php', 'wp-blog-header.php', 'wp-settings.php', 'wp-mail.php', 'xmlrpc.php'])) {
            $suspicious_files[] = [
                'file' => str_replace($root, '', $path),
                'modified' => date('Y-m-d H:i:s', filemtime($path)),
                'size' => filesize($path),
            ];
        }
    }
}

// Handle delete action
$deleted = [];
$delete_errors = [];
if (isset($_POST['delete']) && is_array($_POST['delete'])) {
    foreach ($_POST['delete'] as $rel_path) {
        $full_path = realpath($root . '/' . ltrim($rel_path, '/'));
        if ($full_path && strpos($full_path, $root) === 0 && file_exists($full_path)) {
            if (unlink($full_path)) {
                $deleted[] = $rel_path;
            } else {
                $delete_errors[] = $rel_path;
            }
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
<title>Malware Scanner - diginestsolutions.com</title>
<style>
body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
h1 { color: #d00; }
h2 { color: #333; border-bottom: 2px solid #ccc; padding-bottom: 5px; }
.box { background: #fff; border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
.danger { background: #fff0f0; border-color: #f00; }
.warning { background: #fffbe6; border-color: #f90; }
.ok { background: #f0fff0; border-color: #0a0; }
table { width: 100%; border-collapse: collapse; }
th { background: #333; color: #fff; padding: 8px; text-align: left; }
td { padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; word-break: break-all; }
.btn-delete { background: #d00; color: #fff; border: none; padding: 6px 14px; cursor: pointer; border-radius: 3px; }
.notice { background: #ff4444; color: #fff; padding: 10px; border-radius: 5px; font-weight: bold; margin: 10px 0; }
</style>
</head>
<body>
<h1>Malware Scanner Report</h1>
<p>Site root: <code><?php echo htmlspecialchars($root); ?></code> | Files scanned: <strong><?php echo $scanned; ?></strong></p>

<?php if (!empty($deleted)): ?>
<div class="box ok">
    <strong>Deleted successfully:</strong><br>
    <?php foreach ($deleted as $d) echo htmlspecialchars($d) . '<br>'; ?>
</div>
<?php endif; ?>

<?php if (!empty($delete_errors)): ?>
<div class="box danger">
    <strong>Could not delete (check permissions):</strong><br>
    <?php foreach ($delete_errors as $e) echo htmlspecialchars($e) . '<br>'; ?>
</div>
<?php endif; ?>

<form method="POST" action="?key=<?php echo $access_key; ?>">

<h2>Malware Detected (<?php echo count($malware_found); ?> files)</h2>
<?php if (empty($malware_found)): ?>
<div class="box ok"><strong>No malware patterns found.</strong></div>
<?php else: ?>
<div class="box danger">
<div class="notice">WARNING: <?php echo count($malware_found); ?> file(s) contain malware patterns. Select and delete them below.</div>
<table>
<tr><th>Select</th><th>File</th><th>Pattern Found</th><th>Modified</th><th>Size</th></tr>
<?php foreach ($malware_found as $m): ?>
<tr>
    <td><input type="checkbox" name="delete[]" value="<?php echo htmlspecialchars($m['file']); ?>"></td>
    <td><code><?php echo htmlspecialchars($m['file']); ?></code></td>
    <td><code style="color:red"><?php echo htmlspecialchars($m['pattern']); ?></code></td>
    <td><?php echo $m['modified']; ?></td>
    <td><?php echo number_format($m['size']); ?> bytes</td>
</tr>
<?php endforeach; ?>
</table>
</div>
<?php endif; ?>

<h2>Suspicious Filenames (<?php echo count($suspicious_files); ?> files)</h2>
<?php if (empty($suspicious_files)): ?>
<div class="box ok"><strong>No suspicious filenames found.</strong></div>
<?php else: ?>
<div class="box warning">
<p>These files have random-looking names common in malware. Review before deleting.</p>
<table>
<tr><th>Select</th><th>File</th><th>Modified</th><th>Size</th></tr>
<?php foreach ($suspicious_files as $s): ?>
<tr>
    <td><input type="checkbox" name="delete[]" value="<?php echo htmlspecialchars($s['file']); ?>"></td>
    <td><code><?php echo htmlspecialchars($s['file']); ?></code></td>
    <td><?php echo $s['modified']; ?></td>
    <td><?php echo number_format($s['size']); ?> bytes</td>
</tr>
<?php endforeach; ?>
</table>
</div>
<?php endif; ?>

<br>
<button type="submit" class="btn-delete" onclick="return confirm('Delete all selected files? This cannot be undone.')">Delete Selected Files</button>

</form>

<div class="box warning" style="margin-top:30px">
    <strong>IMPORTANT:</strong> Delete this scanner file (scanner.php) from your server after use!
</div>
</body>
</html>
