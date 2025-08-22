# 简单的HTTP服务器启动脚本
Write-Host "启动golfbagfactories-website服务器..."
Write-Host "请访问 http://localhost:8888 查看网站"

# 使用Python启动HTTP服务器在8888端口
python -m http.server 8888 --directory .