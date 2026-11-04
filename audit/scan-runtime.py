from pathlib import Path
import re,json
root=Path('.')
refs=[]
for folder in ['src','.next/static','.next/server/app']:
 for p in Path(folder).rglob('*'):
  if not p.is_file() or p.suffix not in ['.html','.css','.js','.json','.rsc','.txt','.ts','.tsx']:continue
  try:s=p.read_text(encoding='utf8')
  except (UnicodeDecodeError,OSError):continue
  if re.search(r'https?://kennethteetersfoundation\.org/(wp-content|wp-json|wp-includes)/',s):refs.append(str(p))
Path('audit/runtime-reference-scan.json').write_text(json.dumps({'unwantedRuntimeDependencies':refs,'allowedProductionDomainUses':['canonical URLs','Open Graph URL','JSON-LD identifiers and locally hosted asset URLs','sitemap and robots'],'intentionalLegacyPath':'next.config.ts redirects old PDF URL to /assets/documents/aplication.pdf','archivedOriginalReferences':'audit/ and original user-supplied HTML/files are offline evidence and not served'},indent=2),encoding='utf8')
assert not refs,refs
p=Path('README.md');s=p.read_text(encoding='utf8').replace('`package-lock.json` is committed project input','`package-lock.json` is included project input');p.write_text(s,encoding='utf8')
print('No unwanted WordPress references in application source or production HTML/CSS/JS output.')
