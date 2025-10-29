<#
Install or make psql available on Windows.

This helper tries to detect common package managers (winget or chocolatey) and
offers the commands to install PostgreSQL (which provides the psql client).

Notes:
- Installation usually requires Administrator privileges. Run PowerShell as
  Administrator (right-click -> Run as Administrator) if you want the script
  to perform the install automatically.
- If you can't run elevated, the script prints copyable commands to run
  manually (or you can use Docker as an alternative if you have Docker).

Usage:
  # Run interactively
  pwsh .\scripts\install-psql-windows.ps1

After install, reopen your terminal and run `psql --version` to verify.
#>

function Write-Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn($msg){ Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-ErrorLine($msg){ Write-Host "[ERROR] $msg" -ForegroundColor Red }

Write-Info "Checking existing psql availability..."
try {
    $psql = (Get-Command psql -ErrorAction Stop)
    Write-Info "psql is already installed at: $($psql.Path)"
    Write-Info "Version: $(psql --version 2>&1)"
    exit 0
} catch {
    Write-Info "psql not found in PATH. Proceeding to installation helpers."
}

function Is-Admin {
    $current = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($current)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

$hasWinget = (Get-Command winget -ErrorAction SilentlyContinue) -ne $null
$hasChoco  = (Get-Command choco -ErrorAction SilentlyContinue) -ne $null
$hasDocker = (Get-Command docker -ErrorAction SilentlyContinue) -ne $null

Write-Info "Available package helpers: winget=$hasWinget, choco=$hasChoco, docker=$hasDocker"

if (-not (Is-Admin)) {
    Write-Warn "This PowerShell session is not elevated. Automatic installation usually requires Administrator privileges."
    Write-Warn "If you want the script to install packages for you, re-run PowerShell 'Run as Administrator' and run this script again."
}

if ($hasWinget) {
    Write-Info "Winget found. Recommended: install PostgreSQL (includes psql) via winget."
    $cmd = 'winget install --id PostgreSQL.PostgreSQL.17 -e --accept-package-agreements --accept-source-agreements'
    if (Is-Admin) {
        Write-Info "Running: $cmd"
        iex $cmd
        Write-Info "If the installer completed, open a new terminal and run: psql --version"
        exit 0
    } else {
        Write-Host "Run PowerShell as Administrator and execute:" -ForegroundColor White
        Write-Host "  $cmd" -ForegroundColor Green
        Write-Host "Or run the command below to install via winget with interactive elevation:" -ForegroundColor White
        Write-Host "  Start-Process -FilePath pwsh -ArgumentList '-NoProfile -ExecutionPolicy Bypass -Command \"$cmd\"' -Verb RunAs" -ForegroundColor Green
        exit 0
    }
}

if ($hasChoco) {
    Write-Info "Chocolatey found. You can install PostgreSQL (provides psql) via choco."
    $cmd = 'choco install postgresql -y'
    if (Is-Admin) {
        Write-Info "Running: $cmd"
        iex $cmd
        Write-Info "If the installer completed, open a new terminal and run: psql --version"
        exit 0
    } else {
        Write-Host "Run PowerShell as Administrator and execute:" -ForegroundColor White
        Write-Host "  $cmd" -ForegroundColor Green
        Write-Host "Or run the following to elevate and install:" -ForegroundColor White
        Write-Host "  Start-Process -FilePath pwsh -ArgumentList '-NoProfile -ExecutionPolicy Bypass -Command \"$cmd\"' -Verb RunAs" -ForegroundColor Green
        exit 0
    }
}

Write-Warn "No winget/choco available or automatic install not possible in this session."

if ($hasDocker) {
    Write-Info "Docker is available — you can run psql via a temporary container without installing anything system-wide."
    Write-Host "Example to run an interactive psql shell against your Neon DB (replace <DATABASE_URL>):" -ForegroundColor White
    Write-Host "  docker run --rm -it postgres:17 psql <DATABASE_URL>" -ForegroundColor Green
    Write-Host "Or to run a single command (ALTER ROLE example):" -ForegroundColor White
    Write-Host "  docker run --rm -e PGPASSWORD=<PASSWORD> postgres:17 psql -h <host> -U <user> -d <db> -c \"ALTER ROLE ...;\"" -ForegroundColor Green
    exit 0
}

Write-Info "Manual / last-resort instructions"
Write-Host "1) Download the official PostgreSQL installer for Windows from https://www.postgresql.org/download/windows/ (EnterpriseDB). Run it as Administrator and ensure 'Command Line Tools' are selected. After install, open a new terminal and run: psql --version" -ForegroundColor White
Write-Host "2) If you prefer not to install a server, consider installing only client tools from third-party builds. These are less common; prefer the official installer or package managers above." -ForegroundColor White
Write-Host "3) If you want, I can prepare a script that downloads the EnterpriseDB installer and launches it, but it will still require elevation and interactive steps." -ForegroundColor Yellow

exit 0
