pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "avtan1/manual-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
        CD_REPO = "avtan88/manual-app-helm"
    }

    stages {
        stage('Checkout') { steps { checkout scm } }

        stage('Install Dependencies') { steps { sh 'npm install' } }

        stage('Build Docker Image') {
            steps { sh "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} ." }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps { sh "docker push ${DOCKER_IMAGE}:${IMAGE_TAG}" }
        }

        stage('Update CD Repo') {
            steps {
                withCredentials([string(credentialsId: 'github-pat', variable: 'GITHUB_TOKEN')]) {
                    sh '''
                    rm -rf cd-repo
                    git clone https://${GITHUB_TOKEN}@github.com/${CD_REPO}.git cd-repo
                    cd cd-repo
                    sed -i "s/tag:.*/tag: '${IMAGE_TAG}'/" values.yaml
                    git config user.email "jenkins@jumptotech.com"
                    git config user.name "jenkins"
                    git add values.yaml
                    git commit -m "Update image tag to ${IMAGE_TAG}" || true
                    git push origin main
                    '''
                }
            }
        }
    }

    post {
        success { echo "✅ Pipeline completed successfully!" }
        failure { echo "❌ Pipeline failed!" }
    }
}
