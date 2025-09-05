@echo off
echo Running Band Recruiting API Tests...

REM Navigate to test directory
cd backend.Tests

REM Restore packages
echo Restoring packages...
dotnet restore

REM Build the test project
echo Building test project...
dotnet build --no-restore

REM Run all tests
echo Running all tests...
dotnet test --no-build --verbosity normal

REM Run tests with coverage
echo Running tests with coverage...
dotnet test --no-build --collect:"XPlat Code Coverage" --results-directory ./TestResults

REM Generate coverage report (requires reportgenerator tool)
echo Generating coverage report...
where reportgenerator >nul 2>nul
if %ERRORLEVEL% == 0 (
    reportgenerator -reports:"./TestResults/*/coverage.cobertura.xml" -targetdir:"./TestResults/CoverageReport" -reporttypes:Html
    echo Coverage report generated in ./TestResults/CoverageReport/
) else (
    echo Install reportgenerator for HTML coverage reports: dotnet tool install -g dotnet-reportgenerator-globaltool
)

echo Tests completed!
pause