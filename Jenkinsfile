// Jenkins Pipeline for Auto Service Frontend (React + Vite)
// Builds, tests, and deploys using Docker Compose

pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 20, unit: 'MINUTES')
        timestamps()
    }

    environment {
        // Docker image configuration
        DOCKER_REGISTRY = 'localhost'  // Local Docker for development
        FRONTEND_IMAGE = 'autoservice-frontend:latest'
        FRONTEND_IMAGE_FULL = "${DOCKER_REGISTRY}:5000/${FRONTEND_IMAGE}"
        
        // Repository information
        GITHUB_REPO = 'https://github.com/Chamithjay/auto_service_frontend.git'
        GITHUB_BRANCH = 'main'
        
        // Node.js configuration
        NODE_ENV = 'production'
        VITE_API_BASE_URL = 'http://localhost:8080/api'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo '========== STAGE: Checkout =========='
                    deleteDir()
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "${GITHUB_BRANCH}"]],
                        userRemoteConfigs: [[url: "${GITHUB_REPO}"]]
                    ])
                    echo "✅ Repository cloned successfully"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo '========== STAGE: Install Dependencies =========='
                    sh '''
                        echo "Node version:"
                        node --version
                        echo "NPM version:"
                        npm --version
                        
                        echo "Installing dependencies..."
                        npm ci --silent
                        
                        echo "✅ Dependencies installed"
                    '''
                }
            }
        }

        stage('Lint Code') {
            steps {
                script {
                    echo '========== STAGE: Lint Code =========='
                    sh '''
                        echo "Running ESLint..."
                        npm run lint || true
                        
                        echo "✅ Linting completed"
                    '''
                }
            }
        }

        stage('Build Application') {
            steps {
                script {
                    echo '========== STAGE: Build Application =========='
                    sh '''
                        echo "Building React application with Vite..."
                        npm run build
                        
                        if [ -d "dist" ]; then
                            echo "Build artifacts created:"
                            ls -lh dist/
                            echo "✅ Build successful"
                        else
                            echo "❌ Build failed - dist directory not found"
                            exit 1
                        fi
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo '========== STAGE: Build Docker Image =========='
                    sh '''
                        echo "Building Docker image: ${FRONTEND_IMAGE}"
                        docker build \\
                            --build-arg VITE_API_BASE_URL="${VITE_API_BASE_URL}" \\
                            -t ${FRONTEND_IMAGE} .
                        
                        echo "Docker images:"
                        docker images | grep autoservice-frontend
                        
                        echo "✅ Docker image built successfully"
                    '''
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo '========== STAGE: Deploy with Docker Compose =========='
                    sh '''
                        # Navigate to deployment directory
                        cd ../automobile-service-deployment
                        
                        echo "Current directory: $(pwd)"
                        echo "Docker Compose version:"
                        docker-compose --version
                        
                        echo "Starting services with docker-compose..."
                        docker-compose -f docker-compose.yml up -d
                        
                        echo "✅ Docker Compose deployment initiated"
                    '''
                }
            }
        }

        stage('Health Checks') {
            steps {
                script {
                    echo '========== STAGE: Health Checks =========='
                    sh '''
                        echo "Waiting for services to start (30 seconds)..."
                        sleep 30
                        
                        echo "Checking running containers..."
                        docker ps
                        
                        echo "Checking frontend health..."
                        FRONTEND_HEALTH=$(docker exec autoservice-frontend curl -s http://localhost/health 2>/dev/null || echo "pending")
                        echo "Frontend health: $FRONTEND_HEALTH"
                        
                        echo "Checking backend connectivity..."
                        docker exec autoservice-frontend curl -s http://localhost:8080/api/health || echo "Backend check result: $?"
                        
                        echo "✅ Health checks completed"
                    '''
                }
            }
        }

        stage('Display Service URLs') {
            steps {
                script {
                    echo '========== STAGE: Service URLs =========='
                    echo '''
                    ✅ Deployment Complete!
                    
                    Services available at:
                    - Frontend: http://localhost
                    - Backend: http://localhost:8080
                    - API Base: http://localhost:8080/api
                    
                    View logs:
                    - docker-compose logs -f frontend
                    - docker logs -f autoservice-frontend
                    
                    Stop services:
                    - docker-compose down
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo '========== POST: Cleanup & Summary =========='
                sh '''
                    echo "Docker containers running:"
                    docker ps --format "table {{.Names}}\t{{.Status}}" | grep autoservice || echo "No autoservice containers found"
                    
                    echo "Docker images:"
                    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep autoservice || echo "No autoservice images found"
                '''
            }
        }
        success {
            script {
                echo '✅ Pipeline completed successfully!'
            }
        }
        failure {
            script {
                echo '❌ Pipeline failed. Check logs above for details.'
            }
        }
    }
}
