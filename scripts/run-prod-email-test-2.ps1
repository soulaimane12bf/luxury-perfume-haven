# Production email test script (payload matching API expectations)
$envFile = Join-Path $PSScriptRoot '..\.vercel.env'
$envFile = Resolve-Path $envFile -ErrorAction SilentlyContinue
if(-not $envFile){ Write-Output "ERROR: .vercel.env not found"; exit 2 }
$envFile = $envFile.Path
$tokenLine = Get-Content $envFile | Where-Object { $_ -match '^VERCEL_OIDC_TOKEN\s*=' } | Select-Object -First 1
if(-not $tokenLine){ Write-Output "ERROR: VERCEL_OIDC_TOKEN not found"; exit 2 }
$token = $tokenLine -replace '^.*VERCEL_OIDC_TOKEN\s*=\s*\"?','' -replace '\"\s*$',''
$prod = 'https://luxury-perfume-haven.vercel.app'
$url = "$prod/api/orders?vercel-bypass=$token"
$bodyObj = @{
  customer_name = 'Automated Test Buyer'
  customer_email = 'test+send@example.com'
  customer_phone = '+212600000000'
  customer_address = '123 Test St, Casablanca'
  items = @(
    @{ id = 9999; name = 'Automated Test Product'; image_url = ''; price = 1; quantity = 1 }
  )
  total_amount = 1
  notes = 'Automated test from agent'
}
$bodyJson = ($bodyObj | ConvertTo-Json -Depth 6)
Write-Output "Posting to: $($prod)/api/orders (using bypass token from .vercel.env)"

# Use PowerShell's Invoke-RestMethod to POST JSON and print the response (avoids complex quoting)
try {
  $response = Invoke-RestMethod -Uri $url -Method Post -Body $bodyJson -ContentType 'application/json' -ErrorAction Stop
  # Print success response as formatted JSON
  $response | ConvertTo-Json -Depth 5
} catch {
  if ($_.Exception.Response) {
    $r = $_.Exception.Response
    $sr = New-Object System.IO.StreamReader($r.GetResponseStream())
    $b = $sr.ReadToEnd()
    Write-Output "HTTP_ERROR: $($r.StatusCode) $($r.StatusDescription)"
    Write-Output $b
  } else {
    Write-Output "REQUEST_FAILED: $($_.Exception.Message)"
  }
  exit 1
}
