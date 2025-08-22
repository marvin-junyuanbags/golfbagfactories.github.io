# 启动简单的HTTP服务器来预览网站

Write-Host "启动HTTP服务器..."
Write-Host "请在浏览器中访问 http://localhost:8000 查看网站"

# 启动Python HTTP服务器
python -m http.server 8000 --directory .