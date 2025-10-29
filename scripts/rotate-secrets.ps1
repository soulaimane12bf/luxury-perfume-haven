<#
rotate-secrets.ps1
PowerShell helper to rotate Neon/Postgres password and update Vercel env vars via the Vercel API.

Usage (recommended):
  1. Set these environment vars in your shell first:
     $env:VERCEL_TOKEN = '<your-vercel-token>'
     $env:VERCEL_PROJECT_ID = '<your-vercel-project-id>'
     # Optional if you want to run ALTER ROLE directly:
     $env:CURRENT_DATABASE_URL = '<postgres-connection-string-with-current-creds>'

  2. Run the script from project root:
     pwsh .\scripts\rotate-secrets.ps1

Notes:
 - This script *does not* automatically rotate the credential inside Neon UI. If you cannot run ALTER ROLE (no access), rotate the password from the Neon dashboard and then run the section that updates Vercel env vars.
 - The script will create new environment variables in Vercel (production scope). It deletes existing env vars with the same name first.
 - REQUIRED: `VERCEL_TOKEN` and `VERCEL_PROJECT_ID` environment variables must be set.
#>

param(
    [switch] $RunDbUpdate  # If set, attempt an ALTER ROLE on the DB using CURRENT_DATABASE_URL
)

function New-StrongPassword {
    # Generate a 32-char password using RNG
    $bytes = New-Object 'System.Byte[]' 32
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $pw = [Convert]::ToBase64String($bytes)
    # Make filesystem-friendly
    return ($pw -replace '[+/=]', 'A')[0..31] -join ''
}

# Validate Vercel env inputs
if (-not $env:VERCEL_TOKEN) {
    Write-Error "VERCEL_TOKEN is not set. Set environment variable VERCEL_TOKEN with a Vercel token that has project scope."
    exit 1
}
if (-not $env:VERCEL_PROJECT_ID) {
    Write-Error "VERCEL_PROJECT_ID is not set. Find it with 'vercel projects ls' or in the Vercel dashboard."
    exit 1
}

$newDbPassword = New-StrongPassword
Write-Host "Generated new DB password: (hidden)"
# For safety do not echo the password in logs. Provide it to the user at the end.

# If requested, attempt to alter the DB role password using psql if CURRENT_DATABASE_URL is provided
if ($RunDbUpdate) {
    if (-not $env:CURRENT_DATABASE_URL) {
        Write-Error "To run ALTER ROLE, set CURRENT_DATABASE_URL environment variable to the existing DB connection string (postgresql://user:pass@host:port/dbname)."
        exit 1
    }
    # Parse URL to find username
    $uri = [System.Uri]::new($env:CURRENT_DATABASE_URL)
    $userInfo = $uri.UserInfo.Split(":")
    $dbUser = $userInfo[0]

    # psql must be installed and available
    if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
        Write-Error "psql not found in PATH. Install psql or rotate password from Neon dashboard and re-run the script to update Vercel env vars."
        exit 1
    }

    $alterSql = "ALTER ROLE \"$dbUser\" WITH PASSWORD '$newDbPassword';"
    Write-Host "Running ALTER ROLE for $dbUser (this will change DB password)..."
    $psqlCmd = "psql '$($env:CURRENT_DATABASE_URL)' -c \"$alterSql\""
    Write-Host "Executing: $psqlCmd"
    iex $psqlCmd
    if ($LASTEXITCODE -ne 0) {
        Write-Error "ALTER ROLE failed. Please rotate the password using the DB provider UI or correct credentials."
        exit 1
    }
    Write-Host "DB password updated successfully on the server."
}

# Update Vercel env vars via REST API: delete existing var then create for production
$vercelToken = $env:VERCEL_TOKEN
$projectId = $env:VERCEL_PROJECT_ID
$headers = @{ Authorization = "Bearer $vercelToken"; "Content-Type" = "application/json" }

function Get-EnvVarId($name) {
    $url = "https://api.vercel.com/v9/projects/$projectId/env"
    $resp = Invoke-RestMethod -Method Get -Uri $url -Headers $headers
    foreach ($v in $resp.env) {
        if ($v.key -eq $name) { return $v.id }
    }
    return $null
}

function Delete-EnvVar($id) {
    if (-not $id) { return }
    $url = "https://api.vercel.com/v9/projects/$projectId/env/$id"
    Invoke-RestMethod -Method Delete -Uri $url -Headers $headers | Out-Null
}

function Create-EnvVar($name, $value, $target) {
    $url = "https://api.vercel.com/v9/projects/$projectId/env"
    $body = @{ key = $name; value = $value; target = @($target); type = 'encrypted' } | ConvertTo-Json
    Invoke-RestMethod -Method Post -Uri $url -Headers $headers -Body $body
}

# Names to update (customize if your project uses different names)
$envNames = @('DATABASE_URL', 'POSTGRES_URL', 'POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING', 'POSTGRES_URL_NO_SSL', 'POSTGRES_PASSWORD')

# Build new values — prefer to keep same host & user if possible; otherwise user will update manually.
# If you rotated via psql, we can attempt to replace just the password in existing URLs
$existingDbUrl = $null
try { $existingDbUrl = (Invoke-RestMethod -Method Get -Uri "https://api.vercel.com/v9/projects/$projectId/env" -Headers $headers).env | Where-Object { $_.key -eq 'DATABASE_URL' } | Select-Object -ExpandProperty value } catch { }

function ReplacePasswordInUrl($url, $newPw) {
    if (-not $url) { return $null }
    # parse and rebuild
    try {
        $u = [System.Uri]::new($url)
        $userinfo = $u.UserInfo
        if (-not $userinfo) { return $null }
        $parts = $userinfo -split ':'
        $user = $parts[0]
        $newUserinfo = "$user`:$newPw"
        $builder = New-Object System.UriBuilder $u
        $builder.UserName = $user
        $builder.Password = $newPw
        return $builder.Uri.AbsoluteUri
    } catch {
        return $null
    }
}

# Compute new DATABASE_URL if possible
$newDatabaseUrl = $null
if ($existingDbUrl) {
    $newDatabaseUrl = ReplacePasswordInUrl $existingDbUrl $newDbPassword
}

# If we couldn't compute, print instructions and still update POSTGRES_PASSWORD
if (-not $newDatabaseUrl) {
    Write-Warning "Could not compute new full DATABASE_URL automatically. The script will still update POSTGRES_PASSWORD. If your app uses full DATABASE_URL string, update it in Vercel dashboard with the new password and host."
}

# Update environment variables in Vercel for production target
$target = 'production'

foreach ($name in $envNames) {
    $id = Get-EnvVarId $name
    if ($id) { Write-Host "Deleting existing env var $name (id: $id)"; Delete-EnvVar $id }
    $valueToSet = switch ($name) {
        'DATABASE_URL' { if ($newDatabaseUrl) { $newDatabaseUrl } else { '' } }
        'POSTGRES_PASSWORD' { $newDbPassword }
        default { '' }
    }
    if ($valueToSet -ne '') {
        Write-Host "Creating env var $name (target: $target)"
        Create-EnvVar $name $valueToSet $target
    } else { Write-Host "Skipping create for $name (no value computed)" }
}

Write-Host "Rotation script finished. IMPORTANT:"
Write-Host " - New DB password (copy now): $newDbPassword" -ForegroundColor Yellow
Write-Host " - If DATABASE_URL was not updated automatically, update it now in Vercel dashboard to use the new password."
Write-Host " - Trigger a manual deploy in Vercel to ensure new env vars are picked up."
