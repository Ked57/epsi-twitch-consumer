pipeline {
    agent {
        docker {
            image 'node:10' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm run build' 
            }
        } 
        stage('Deploy') { 
            steps {
                sh 'sudo npm install -g caprover'
                sh 'caprover deploy -h $DOMAIN -p $PASSWORD -b master -a $APPNAME'
            }
        }
    }
}