$key = 'AIzaSyAOThl-L067Nh5nszu2cXXkyg-jLxcHxew'
$bodyText = '{"contents":[{"parts":[{"text":"say hi"}]}]}'
$models = @(
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-3-flash-preview',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemma-3-27b-it'
)

foreach ($model in $models) {
    # Try v1beta first
    $url = "https://generativelanguage.googleapis.com/v1beta/models/" + $model + ":generateContent?key=" + $key
    Write-Host ("Testing: " + $model)
    try {
        $r = Invoke-RestMethod -Uri $url -Method POST -ContentType 'application/json' -Body $bodyText -TimeoutSec 15
        Write-Host "  SUCCESS - model works!"
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errText = $reader.ReadToEnd()
        if ($errText -match 'limit: 0') {
            Write-Host ("  QUOTA LIMIT=0 - " + $code)
        } elseif ($code -eq 404) {
            Write-Host "  404 not found"
        } else {
            Write-Host ("  Error " + $code + ": " + $errText.Substring(0, [Math]::Min(200, $errText.Length)))
        }
    }
}
