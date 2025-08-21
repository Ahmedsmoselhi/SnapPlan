# SnapPlan

## Getting started

1. Copy config template and set your local connection string:

```bash
cp appsettings.json.example appsettings.json
```

On Windows PowerShell:

```powershell
Copy-Item appsettings.json.example appsettings.json
```

2. Restore and run:

```bash
dotnet restore
dotnet ef database update
dotnet run
```

## What to commit

- Solution and project files: `SnapPlan.sln`, `SnapPlan.csproj`
- Source: `Program.cs`, `Data/`, `Models/`
- Migrations: `Migrations/`
- Config templates: `appsettings.json.example`

## What is ignored

- Build artifacts: `bin/`, `obj/`
- User-specific files: `*.user`, `.vs/`, `.vscode/`
- Local settings: `appsettings.json`, `appsettings.*.local.json`
- Local DB files: `*.mdf`, `*.ldf`
