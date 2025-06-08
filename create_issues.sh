# create_issues.ps1
param(
    [string]$Repo = "JFenderson/BandRecruitingApplication",
    [string]$Csv  = ".\prompts.csv"
)

$issues = Import-Csv -Path $Csv            # PowerShell parses commas *inside* quotes

foreach ($row in $issues) {
    $title  = $row.Title
    $body   = $row.Body
    $labels = if ($row.Labels) { $row.Labels -split '\s*,\s*' } else { @() }

    # Build an array of arguments for gh
    $args   = @("issue","create","--repo",$Repo,"--title",$title,"--body",$body)
    foreach ($lab in $labels) { $args += @("--label",$lab) }

    & gh @args                              # call gh with the assembled args
}
