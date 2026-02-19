pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "avtan1/manual-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
        CD_REPO = "avtan88/manual-app-helm"  // GitHub repo для CD (Helm chart)
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} ."
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                sh "docker push ${DOCKER_IMAGE}:${IMAGE_TAG}"
            }
        }

        stage('Update CD Repo') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-creds',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_PASS'
                )]) {
                    sh """
                    rm -rf cd-repo
                    git clone https://${GIT_USER}:${GIT_PASS}@github.com/${CD_REPO}.git cd-repo
                    cd cd-repo

                    # Обновляем image tag в values.yaml
                    sed -i "s/tag:.*/tag: '${IMAGE_TAG}'/" values.yaml

                    git config user.email "jenkins@jumptotech.com"
                    git config user.name "jenkins"

                    git add values.yaml
                    git commit -m "Update image tag to ${IMAGE_TAG}" || true
                    git push origin main
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build, push, and CD update completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs!"
        }
    }
}
