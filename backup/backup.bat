cd "D:\Jady\Auto Entreprise Jady\jadynekena.com"
start "my_jekyll_server" cmd /k "jekyll serve & timeout 2 & exit"
start msedge "http://localhost:4000/backup/"
timeout 2
taskkill /IM "msedge.exe" /F

