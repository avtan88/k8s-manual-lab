pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "avtan1/manual-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Cloning repository..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing npm dependencies..."
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh """
                docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                """
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                    echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                    """
                }
            }
        }

        stage('Push Image') {
            steps {
                echo "Pushing image to DockerHub..."
                sh """
                docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                """
            }
        }
    }

    post {
        success {
            echo "CI Pipeline completed successfully!"
        }
        failure {
            echo "CI Pipeline failed!"
        }
        always {
            echo "Pipeline finished."
        }
    }
}
