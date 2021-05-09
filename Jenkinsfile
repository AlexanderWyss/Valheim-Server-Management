node {
    stage('Clone repository') {
        checkout scm
    }
    stage('Dependencies Server') {
        sh 'npm ci'
    }
    stage('Build Server') {
        sh 'npm run build --prod'
    }
    stage('Dependencies Client') {
        dir('client') {
            sh 'npm ci'
        }
    }
    stage('Build Client') {
        dir('client') {
            sh 'npm run build:prod --prod'
        }
    }
    stage('Build Docker image') {
        docker.build("alexanderwyss/valheim-server-management")
    }
    stage('Deploy') {
            sh 'docker stop valheim-server-management || true && docker rm -f valheim-server-management || true'
            sh 'docker run -d --expose 8080 -v /var/run/docker.sock:/var/run/docker.sock --restart unless-stopped --name valheim-server-management -e NODE_ENV=production -e CONTAINER=valheim -e PORT=8080 -e VIRTUAL_HOST=valheim.wyss.tech -e VIRTUAL_PORT=8080 -e LETSENCRYPT_HOST=valheim.wyss.tech alexanderwyss/valheim-server-management:latest'
            sh 'docker run -d --expose 8080 -v /var/run/docker.sock:/var/run/docker.sock --restart unless-stopped --name valheim-cyrill-server-management -e NODE_ENV=production -e CONTAINER=valheim-cyrill -e PORT=8080 -e VIRTUAL_HOST=valheim-cyrill.wyss.tech -e VIRTUAL_PORT=8080 -e LETSENCRYPT_HOST=valheim-cyrill.wyss.tech alexanderwyss/valheim-server-management:latest'
    }
}
