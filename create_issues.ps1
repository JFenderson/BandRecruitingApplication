param(
    [string]$Repo = "JFenderson/BandRecruitingApplication",
    [string]$Csv  = ".\prompts.csv"
)

# ---------- 1)  Read CSV once -----------------------------------------
$csvData = Import-Csv -Path $Csv

# ---------- 2)  Ensure required labels exist --------------------------
$labelsNeeded = @("imported")
foreach ($row in $csvData) {
    if ($row.Labels) {
        $labelsNeeded += $row.Labels -split '\s*,\s*' | Where-Object { $_ }
    }
}
$labelsNeeded = $labelsNeeded | Sort-Object -Unique

$existing = (gh label list --repo $Repo --limit 100 --json name | ConvertFrom-Json).name
$missing  = $labelsNeeded | Where-Object { $_ -notin $existing }

foreach ($lab in $missing) {
    gh label create $lab --repo $Repo --color "ededed" --description "auto-added"
}

# ---------- 3)  Create issues -----------------------------------------
foreach ($row in $csvData) {

    # skip rows without a Title
    if (-not $row.Title) { continue }

    $title = $row.Title.Trim('"')

    # handle null Body ➜ empty string, normalise newlines
    $bodyRaw = if ($row.Body) { $row.Body } else { "" }
    $body    = $bodyRaw.Trim('"') -replace "`r`n|`n|`r", "\n"

    # build label list (always include 'imported')
    $issueLabels = @("imported")
    if ($row.Labels) {
        $issueLabels += $row.Labels -split '\s*,\s*' | Where-Object { $_ }
    }

    Write-Host "Creating: $title"

    # assemble CLI arguments (avoid using automatic $args variable)
    $cliArgs = @("issue","create","--repo",$Repo,"--title",$title,"--body",$body)
    foreach ($lab in $issueLabels) {
        $cliArgs += @("--label",$lab)
    }

    gh @cliArgs
}