#!/bin/bash

echo "Running Band Recruiting API Tests..."

# Navigate to test directory
cd backend.Tests

# Restore packages
echo "Restoring packages..."
dotnet restore

# Build the test project
echo "Building test project..."
dotnet build --no-restore

# Run all tests
echo "Running all tests..."
dotnet test --no-build --verbosity normal

# Run tests with coverage
echo "Running tests with coverage..."
dotnet test --no-build --collect:"XPlat Code Coverage" --results-directory ./TestResults

# Generate coverage report (requires reportgenerator tool)
echo "Generating coverage report..."
if command -v reportgenerator &> /dev/null; then
    reportgenerator -reports:"./TestResults/*/coverage.cobertura.xml" -targetdir:"./TestResults/CoverageReport" -reporttypes:Html
    echo "Coverage report generated in ./TestResults/CoverageReport/"
else
    echo "Install reportgenerator for HTML coverage reports: dotnet tool install -g dotnet-reportgenerator-globaltool"
fi

echo "Tests completed!"