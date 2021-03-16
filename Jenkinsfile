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
        docker.build("alexanderwyss/web-starter")
    }
}
