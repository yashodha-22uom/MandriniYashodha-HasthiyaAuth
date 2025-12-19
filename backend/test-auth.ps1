# Test Registration
Write-Host "Testing User Registration..." -ForegroundColor Cyan

$registerData = @{
    full_name = "John Doe"
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    Write-Host "`n✅ Registration Successful!" -ForegroundColor Green
    Write-Host "User ID: $($response.user.id)"
    Write-Host "Full Name: $($response.user.full_name)"
    Write-Host "Email: $($response.user.email)"
    Write-Host "Token: $($response.token.Substring(0, 20))..."
} catch {
    Write-Host "`n❌ Registration Failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host "`n-----------------------------------`n"

# Test Login
Write-Host "Testing User Login..." -ForegroundColor Cyan

$loginData = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    Write-Host "`n✅ Login Successful!" -ForegroundColor Green
    Write-Host "User ID: $($response.user.id)"
    Write-Host "Full Name: $($response.user.full_name)"
    Write-Host "Email: $($response.user.email)"
    Write-Host "Token: $($response.token.Substring(0, 20))..."
} catch {
    Write-Host "`n❌ Login Failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
