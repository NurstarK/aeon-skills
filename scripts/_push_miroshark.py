import base64, subprocess, json, sys

with open('.outputs/miroshark-angle-2026-08-01.md', 'rb') as f:
    content_b64 = base64.b64encode(f.read()).decode('utf-8')

payload = {
    'message': 'miroshark-angle: The Simulation Gap in Agentic Commerce (2026-08-01)',
    'content': content_b64,
    'committer': {'name': 'aeonframework', 'email': 'aeonframework@proton.me'}
}

check = subprocess.run(
    ['gh', 'api', '/repos/NurstarK/MiroShark/contents/content/miroshark-angle-2026-08-01.md'],
    capture_output=True, text=True
)
if check.returncode == 0:
    existing = json.loads(check.stdout)
    payload['sha'] = existing['sha']

with open('/tmp/gh_payload.json', 'w') as f:
    json.dump(payload, f)

result = subprocess.run(
    ['gh', 'api', '--method', 'PUT',
     '-H', 'Accept: application/vnd.github+json',
     '/repos/NurstarK/MiroShark/contents/content/miroshark-angle-2026-08-01.md',
     '--input', '/tmp/gh_payload.json'],
    capture_output=True, text=True
)
print(result.stdout[:600] if result.stdout else '')
print(result.stderr[:600] if result.stderr else '', file=sys.stderr)
sys.exit(result.returncode)
