$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$Port = 4173
$Url = "http://127.0.0.1:$Port/"
$ServerProcess = $null
$BrowserProcess = $null
$BrowserProfile = $null
$StdoutLog = Join-Path $env:TEMP 'FrontierHeroes-vite-out.log'
$StderrLog = Join-Path $env:TEMP 'FrontierHeroes-vite-err.log'
$Failed = $false

function Find-GameBrowser {
    $ProgramFilesX86 = [Environment]::GetFolderPath([Environment+SpecialFolder]::ProgramFilesX86)
    $Candidates = @(
        (Join-Path $env:ProgramFiles 'Microsoft\Edge\Application\msedge.exe'),
        (Join-Path $ProgramFilesX86 'Microsoft\Edge\Application\msedge.exe'),
        (Join-Path $env:LOCALAPPDATA 'Microsoft\Edge\Application\msedge.exe'),
        (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
        (Join-Path $ProgramFilesX86 'Google\Chrome\Application\chrome.exe'),
        (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe')
    ) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }
    return ($Candidates | Select-Object -First 1)
}

function Remove-LauncherLogs {
    foreach ($LogPath in @($StdoutLog, $StderrLog)) {
        if ([string]::IsNullOrWhiteSpace($LogPath)) { continue }
        try {
            if (Test-Path -LiteralPath $LogPath -PathType Leaf) {
                Remove-Item -LiteralPath $LogPath -Force -ErrorAction Stop
            }
        } catch {
            # Cleanup is best effort: never report a game failure only because a log
            # was already absent or Windows temporarily denied deleting it.
        }
    }
}

function Get-ProfileBrowserProcesses {
    param([string]$ProfilePath, [string]$ProcessName)
    try {
        return @(Get-CimInstance Win32_Process -Filter "Name = '$ProcessName'" -ErrorAction SilentlyContinue |
            Where-Object { $_.CommandLine -and $_.CommandLine.IndexOf($ProfilePath, [StringComparison]::OrdinalIgnoreCase) -ge 0 })
    } catch {
        return @()
    }
}

try {
    Write-Host ''
    Write-Host '============================================' -ForegroundColor DarkYellow
    Write-Host '  FRONTIER HEROES - LAUNCHER' -ForegroundColor Yellow
    Write-Host '============================================' -ForegroundColor DarkYellow
    Write-Host 'Este lancador fecha o servidor quando a janela do jogo for fechada.'
    Write-Host 'Mantenha esta janela aberta enquanto joga.'
    Write-Host ''

    $NodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
    if (-not $NodeCommand) {
        throw 'Node.js nao encontrado. Instale a versao LTS em https://nodejs.org/ e execute start-game.bat novamente.'
    }
    $NodePath = $NodeCommand.Source
    $NpmPath = Join-Path (Split-Path $NodePath -Parent) 'npm.cmd'
    if (-not (Test-Path -LiteralPath $NpmPath)) {
        throw "Nao encontrei npm.cmd junto do Node.js em: $NpmPath"
    }

    $ViteCli = Join-Path $ProjectRoot 'node_modules\vite\bin\vite.js'
    if (-not (Test-Path -LiteralPath $ViteCli)) {
        Write-Host 'Instalando dependencias do jogo na primeira execucao...' -ForegroundColor Cyan
        Push-Location $ProjectRoot
        try {
            & $NpmPath install
            if ($LASTEXITCODE -ne 0) { throw "npm install terminou com codigo $LASTEXITCODE." }
        } finally {
            Pop-Location
        }
    }
    if (-not (Test-Path -LiteralPath $ViteCli)) {
        throw 'O Vite nao foi instalado corretamente. Veja a mensagem do npm acima.'
    }

    $BrowserPath = Find-GameBrowser
    if (-not $BrowserPath) {
        throw 'Nao encontrei Microsoft Edge ou Google Chrome. Instale um deles para abrir o jogo em uma janela independente.'
    }

    # Do not accidentally attach to or terminate an unrelated server using this port.
    $Existing = $null
    $TestClient = $null
    try {
        $TestClient = New-Object System.Net.Sockets.TcpClient
        $Connect = $TestClient.BeginConnect('127.0.0.1', $Port, $null, $null)
        if ($Connect.AsyncWaitHandle.WaitOne(180) -and $TestClient.Connected) { $Existing = $true }
        $TestClient.Close()
    } catch {
        if ($TestClient) { $TestClient.Close() }
    }
    if ($Existing) {
        throw "A porta $Port ja esta em uso. Feche a outra instancia de Frontier Heroes e tente novamente; nenhum processo existente foi encerrado."
    }

    Remove-LauncherLogs
    $ViteArguments = '"' + $ViteCli + '" --host 127.0.0.1 --port ' + $Port + ' --strictPort'
    $ServerProcess = Start-Process -FilePath $NodePath -ArgumentList $ViteArguments -WorkingDirectory $ProjectRoot -PassThru -WindowStyle Hidden -RedirectStandardOutput $StdoutLog -RedirectStandardError $StderrLog

    $Ready = $false
    for ($i = 0; $i -lt 60; $i++) {
        if ($ServerProcess.HasExited) {
            $Details = ''
            if (Test-Path $StderrLog) { $Details = Get-Content $StderrLog -Raw -ErrorAction SilentlyContinue }
            throw "O servidor terminou antes de iniciar. $Details"
        }
        try {
            $Response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 2 -UseBasicParsing
            if ($Response.StatusCode -ge 200 -and $Response.StatusCode -lt 400) { $Ready = $true; break }
        } catch {}
        Start-Sleep -Milliseconds 500
    }
    if (-not $Ready) {
        $Details = ''
        if (Test-Path $StderrLog) { $Details = Get-Content $StderrLog -Raw -ErrorAction SilentlyContinue }
        throw "O jogo nao respondeu em $Url. $Details"
    }

    $BrowserName = Split-Path $BrowserPath -Leaf
    $BrowserProfile = Join-Path $env:LOCALAPPDATA 'FrontierHeroes\BrowserProfile'
    New-Item -ItemType Directory -Path $BrowserProfile -Force | Out-Null
    $BrowserArgs = '--user-data-dir="' + $BrowserProfile + '" --no-first-run --no-default-browser-check --disable-background-mode --disable-extensions --new-window --app="' + $Url + '"'
    Write-Host ''
    Write-Host "Servidor iniciado em $Url" -ForegroundColor Green
    Write-Host "Abrindo uma janela isolada usando $BrowserName." -ForegroundColor Cyan
    Write-Host 'Feche a janela do jogo para encerrar o servidor automaticamente.'
    $BrowserProcess = Start-Process -FilePath $BrowserPath -ArgumentList $BrowserArgs -PassThru

    # Use a dedicated persistent browser profile so local save data survives closing
    # the game. Track all processes for that profile, so the server stays alive
    # while the app window is open.
    $SeenBrowser = $false
    while ($true) {
        $BrowserInstances = Get-ProfileBrowserProcesses -ProfilePath $BrowserProfile -ProcessName $BrowserName
        if ($BrowserInstances.Count -gt 0) {
            $SeenBrowser = $true
        } elseif ($SeenBrowser) {
            break
        } elseif ($BrowserProcess.HasExited) {
            Start-Sleep -Seconds 1
            $BrowserInstances = Get-ProfileBrowserProcesses -ProfilePath $BrowserProfile -ProcessName $BrowserName
            if ($BrowserInstances.Count -eq 0) {
                throw 'O navegador fechou antes de manter a janela do jogo aberta.'
            }
        }
        if ($ServerProcess.HasExited) {
            throw 'O servidor foi encerrado inesperadamente enquanto o jogo estava aberto.'
        }
        Start-Sleep -Seconds 2
    }

    Write-Host ''
    Write-Host 'Janela do jogo fechada. Encerrando o servidor local...' -ForegroundColor Yellow
} catch {
    $Failed = $true
    Write-Host ''
    Write-Host 'Nao foi possivel iniciar ou manter o jogo aberto:' -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if (Test-Path $StderrLog) {
        $LogText = Get-Content $StderrLog -Raw -ErrorAction SilentlyContinue
        if ($LogText) { Write-Host $LogText -ForegroundColor DarkRed }
    }
} finally {
    if ($ServerProcess -and -not $ServerProcess.HasExited) {
        try {
            $TaskKill = Join-Path $env:WINDIR 'System32\taskkill.exe'
            if (Test-Path -LiteralPath $TaskKill) {
                & $TaskKill /PID $ServerProcess.Id /T /F | Out-Null
            } else {
                Stop-Process -Id $ServerProcess.Id -Force -ErrorAction SilentlyContinue
            }
            Start-Sleep -Milliseconds 500
        } catch {}
    }
    if (-not $Failed) {
        Remove-LauncherLogs
    }
}
if ($Failed) { exit 1 }
exit 0
