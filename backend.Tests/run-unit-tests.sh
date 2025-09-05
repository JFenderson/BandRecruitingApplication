#!/bin/bash

echo "Running Unit Tests Only..."

cd backend.Tests

# Run only unit tests (exclude integration tests)
dotnet test --filter "FullyQualifiedName!~IntegrationTests" --verbosity normal

