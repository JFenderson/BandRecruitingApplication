#!/bin/bash

echo "Running Integration Tests Only..."

cd backend.Tests

# Run only integration tests
dotnet test --filter "FullyQualifiedName~IntegrationTests" --verbosity normal

