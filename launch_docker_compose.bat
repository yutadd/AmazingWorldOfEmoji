cd front
cmd /c npm install
cmd /cnpm run build
cd ../API
cmd /c .\mvnw install -Dmaven.test.skip=true
cd ..
start docker compose up
timeout 30
start http://localhost/index.html

