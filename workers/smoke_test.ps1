$headers = @{ 'Content-Type' = 'application/json' }
try {
  Invoke-RestMethod -Uri 'http://127.0.0.1:8787/auth/signup' -Method Post -Headers $headers -Body ( @{ email = 'test+1@example.com'; password = 'pass1234'; name='Test User' } | ConvertTo-Json ) -ErrorAction Stop
  Write-Output "signup: OK"
} catch {
  Write-Output "signup: error or exists - $($_.Exception.Message)"
}
$login = Invoke-RestMethod -Uri 'http://127.0.0.1:8787/auth/login' -Method Post -Headers $headers -Body ( @{ email = 'test+1@example.com'; password = 'pass1234' } | ConvertTo-Json )
Write-Output "LOGIN_RESPONSE:"
$login | ConvertTo-Json -Depth 5
$token = $login.token
if ($token) {
  Write-Output "PROJECTS_RESPONSE:"
  Invoke-RestMethod -Uri 'http://127.0.0.1:8787/projects' -Method Get -Headers @{ Authorization = "Bearer $token" } | ConvertTo-Json -Depth 5
} else {
  Write-Output "No token returned"
}
