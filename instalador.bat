docker rm meu-mongo -f  
docker rm desafio-crawler -f
docker build -t gabriel-cora/desafio-crawler .
docker-compose up -d