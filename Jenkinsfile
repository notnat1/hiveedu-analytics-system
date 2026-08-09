pipeline {
    agent any

    environment {
        // Defines the docker compose command
        DOCKER_COMPOSE = 'docker compose'
    }

    stages {
        stage('Checkout') {
            steps {
                // Get the latest code from GitHub
                checkout scm
            }
        }

        stage('Build Frontend & Backend') {
            steps {
                echo "Building the application images..."
                sh "${DOCKER_COMPOSE} build frontend backend proxy"
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying the containers..."
                // -d runs it in detached mode
                // --remove-orphans cleans up old containers not defined in the compose file
                sh "${DOCKER_COMPOSE} up -d --remove-orphans"
            }
        }

        stage('Verify') {
            steps {
                echo "Verifying running containers..."
                sh "${DOCKER_COMPOSE} ps"
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
        success {
            echo "Deployment to Production Successful!"
        }
        failure {
            echo "Deployment Failed. Please check the logs."
        }
    }
}
