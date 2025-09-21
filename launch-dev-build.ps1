# Launch Expo Development Build on Android
# This script helps launch your development build when "Press a" doesn't work correctly

Write-Host "Launching development build on Android device..." -ForegroundColor Green

# Get the current Metro server URL from the running Expo process
$metroUrl = "http://192.168.1.2:8081"  # Update this if your IP changes

# Launch the development build with the correct deep link
$deepLink = "mvdb://expo-development-client/?url=" + [System.Web.HttpUtility]::UrlEncode($metroUrl)

try {
    $result = adb shell am start -a android.intent.action.VIEW -d $deepLink com.qntum.mvdb
    Write-Host "Successfully launched development build!" -ForegroundColor Green
    Write-Host "Deep link: $deepLink" -ForegroundColor Yellow
} catch {
    Write-Host "Error launching development build: $_" -ForegroundColor Red
    Write-Host "Make sure your Android device is connected and ADB is working" -ForegroundColor Yellow
}