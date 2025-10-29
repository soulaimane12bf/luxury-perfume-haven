# Safe production email test script
# Reads .vercel.env for VERCEL_OIDC_TOKEN and POSTs a test order to production
$envFile = Join-Path $PSScriptRoot '..\.vercel.env'
$envFile = Resolve-Path $envFile -ErrorAction SilentlyContinue
if(-not $envFile){ Write-Output "ERROR: .vercel.env not found at expected path"; exit 2 }
$envFile = $envFile.Path
$tokenLine = Get-Content $envFile | Where-Object { $_ -match '^VERCEL_OIDC_TOKEN\s*=' } | Select-Object -First 1
if(-not $tokenLine){ Write-Output "ERROR: VERCEL_OIDC_TOKEN not found in .vercel.env"; exit 2 }
$token = $tokenLine -replace '^.*VERCEL_OIDC_TOKEN\s*=\s*\"?','' -replace '\"\s*$',''
$prod = 'https://luxury-perfume-haven.vercel.app'
$url = "$prod/api/orders?vercel-bypass=$token"
$body = '{"name":"Automated Test Buyer","email":"test+send@example.com","items":[{"id":9999,"title":"Automated Test Product","price":1,"quantity":1}],"total":1}'
Write-Output "Posting to: $($prod)/api/orders (bypass token used from .vercel.env)"
# Use curl.exe to avoid PowerShell formatting of output; curl.exe prints headers with -i
$curlCmd = "curl.exe -s -i -X POST '$url' -H 'Content-Type: application/json' -d '$body'"
Invoke-Expression $curlCmd
