pipeline {
    agent any

    options {
        timeout(time: 60, unit: 'MINUTES')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        // Set CI environment variable for Playwright
        CI = 'true'
        ENV = 'dev'
        // ReportPortal configuration (endpoint and project)
        REPORTPORTAL_ENDPOINT = 'http://localhost:8027/api/v2'
        REPORTPORTAL_PROJECT = 'playwrightwiki'
        // REPORTPORTAL_API_KEY is injected via withCredentials in Run Tests stage
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                script {
                    bat '''
                        @echo off
                        where node >nul 2>&1
                        if %ERRORLEVEL% EQU 0 (
                            echo Node.js is already installed
                            node --version
                        ) else (
                            echo Please install Node.js via Jenkins NodeJS plugin or ensure it's in PATH
                            echo Configure Node.js in: Manage Jenkins > Global Tool Configuration > NodeJS
                            exit /b 1
                        )
                    '''
                }
            }
        }

        stage('Setup pnpm') {
            steps {
                script {
                    bat '''
                        @echo off
                        echo Setting up pnpm...
                        REM Try to enable corepack first (comes with Node.js 16.9+)
                        call corepack enable >nul 2>&1
                        if %ERRORLEVEL% EQU 0 (
                            echo Corepack enabled successfully
                        )
                        REM Verify pnpm can be accessed via npx (this is what we'll use)
                        echo Verifying pnpm via npx...
                        call npx -y pnpm --version
                        if %ERRORLEVEL% EQU 0 (
                            echo pnpm is ready (will be used via npx)
                        ) else (
                            echo WARNING: Could not verify pnpm, but will continue with npx
                        )
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    bat '''
                        @echo off
                        echo Installing project dependencies...
                        REM Use npx pnpm to avoid PATH issues on Windows/Jenkins
                        REM Try frozen-lockfile first for reproducible builds
                        echo Attempting install with frozen-lockfile...
                        call npx -y pnpm install --frozen-lockfile
                        set INSTALL_ERROR=%ERRORLEVEL%
                        if %INSTALL_ERROR% NEQ 0 (
                            echo.
                            echo Frozen-lockfile install failed (error code: %INSTALL_ERROR%)
                            echo This may be due to incompatible lockfile version.
                            echo Falling back to install without frozen-lockfile...
                            echo.
                            REM Explicitly disable frozen-lockfile for fallback (CI mode enables it by default)
                            call npx -y pnpm install --no-frozen-lockfile
                            if %ERRORLEVEL% NEQ 0 (
                                echo Failed to install dependencies even without frozen-lockfile
                                exit /b 1
                            )
                            echo Dependencies installed successfully (without frozen-lockfile)
                        ) else (
                            echo Dependencies installed successfully (with frozen-lockfile)
                        )
                    '''
                }
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                script {
                    bat '''
                        @echo off
                        echo Installing Playwright browsers...
                        call npx -y pnpm exec playwright install --with-deps chromium
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Inject ReportPortal API key and user credentials from Jenkins credentials
                    withCredentials([
                        string(credentialsId: 'reportportal-api-key', variable: 'REPORTPORTAL_API_KEY'),
                        string(credentialsId: 'wiki_username', variable: 'WIKI_USERNAME'),
                        string(credentialsId: 'wiki_password', variable: 'WIKI_PASSWORD'),
                        string(credentialsId: 'wiki_meta_client_id', variable: 'WIKI_META_CLIENT_ID'),
                        string(credentialsId: 'wiki_meta_client_secret', variable: 'WIKI_META_CLIENT_SECRET')
                    ]) {
                        bat '''
                            @echo off
                            echo Running Playwright tests...
                            REM Use npx pnpm to avoid PATH issues on Windows/Jenkins
                            call npx -y pnpm test
                            if %ERRORLEVEL% NEQ 0 exit /b 1
                            
                            echo Generating HTML report...
                            if exist playwright-report (
                                echo HTML report directory exists
                            ) else (
                                echo Creating HTML report directory
                                mkdir playwright-report
                            )
                            
                            echo Listing test results and report directories:
                            if exist test-results dir test-results
                            if exist playwright-report dir playwright-report
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Archive test artifacts (screenshots, videos, traces)
                archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true, fingerprint: true
                
                // Check if HTML report exists and show info
                bat '''
                    @echo off
                    echo Checking for HTML report...
                    set REPORT_PATH=playwright-report\\index.html
                    if exist "%REPORT_PATH%" (
                        echo HTML report found
                        dir "%REPORT_PATH%"
                        echo Report directory contents:
                        dir playwright-report /b
                    ) else (
                        echo WARNING: HTML report not found
                        if exist playwright-report (
                            dir playwright-report /b
                        )
                    )
                '''
                
                publishHTML([
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Test Report',
                    reportTitles: 'Playwright Test Results',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: false
                ])
                
                archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true, fingerprint: true
            }
        }
        
        success {
            echo 'Pipeline succeeded!'
        }
        
        failure {
            echo 'Pipeline failed!'
        }
        
        unstable {
            echo 'Pipeline marked as unstable!'
        }
    }
}