# Desafio-Crawler-Fliper
>  Crawler com api para consulta

O projeto se trata de um crawler que armazena dados de legendas do site (<http://legendas.tv/>) e possui uma api para que o usuário possua acesso ao conteúdo. 
As API's possuem validação por api-key, para fins de teste, apenas a chave '_7696d03d-d194-4aae-a27e-c8fb73532b88_' está cadastrada em um arquivo criptografado, localizado na pasta raiz do projeto.

## Pré-requisitos

Para execução do projeto, é necessário ter o docker instalado na máquina, no Window, basta baixar o Docker Desktop (<https://www.docker.com/products/docker-desktop>) e caso durante a instalação ele aponte que algum recurso esteja faltando, apenas instale-o e prossiga até o final do processo.

## Instalação

OS X & Linux:

* Como não possuo nenhuma máquina com Linux, não foi possível criar um script para execução nele.

Windows:

* Baixe o projeto
    ```sh
    git clone git@github.com:gabrielcora20/Desafio-Crawler-Fliper.git
    ``` 
* Entre na pasta do projeto 
    ```sh
    cd Desafio-Crawler-Fliper
    ```
* Execute o script .bat de instalação
    ```sh
    instalador.bat
    ```

## Exemplo de uso

Para execução dos testes é altamente recomendado que seja usado o Postman (<https://www.postman.com/downloads/>). No arquivo /Postman/desafio-crawler-fliper.postman_collection.json está a collection salva de requisições para os métodos da api, para utilizá-lo, é necessário apenas importar o arquivo no Postman.

## Meta

Gabriel Corá – gabrielcora20@gmail.com

[https://github.com/gabrielcora20/Desafio-Crawler-Fliper/](https://github.com/gabrielcora20)