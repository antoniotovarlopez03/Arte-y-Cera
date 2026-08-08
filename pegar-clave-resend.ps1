$ruta = Join-Path $PSScriptRoot ".env.local"

$claveSegura = Read-Host "Pega aqui tu clave de Resend (la que empieza por re_) y pulsa Enter" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($claveSegura)
$clave = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)

if ([string]::IsNullOrWhiteSpace($clave)) {
    Write-Host "No has pegado nada, no se ha cambiado el archivo."
} else {
    $contenido = Get-Content $ruta -Encoding utf8
    $nuevo = $contenido -replace '^RESEND_API_KEY=.*', "RESEND_API_KEY=$clave"
    $nuevo | Set-Content $ruta -Encoding utf8
    Write-Host ""
    Write-Host "Listo. Clave guardada en .env.local."
}

Write-Host ""
Write-Host "Ya puedes cerrar esta ventana."
Read-Host "Pulsa Enter para salir"
