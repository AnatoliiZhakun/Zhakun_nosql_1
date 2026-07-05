# Завантажуємо MONGO_URI з .env
$envFile = ".env"

Get-Content $envFile | ForEach-Object {
    if ($_ -match "^\s*MONGO_URI=(.+)$") {
        $mongoUri = $Matches[1]
    }
}

if (-not $mongoUri) {
    Write-Host "❌ MONGO_URI не знайдено у .env"
    exit
}

mongosh "$mongoUri" --file scripts/02_transform.js