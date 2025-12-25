---
description: 'Expert Developper'
tools: ['vscode', 'execute', 'read', 'agent', 'edit', 'search', 'web', 'todo', 'ms-python.python/getPythonEnvironmentInfo', 'ms-python.python/getPythonExecutableCommand', 'ms-python.python/installPythonPackage', 'ms-python.python/configurePythonEnvironment', 'prisma.prisma/prisma-migrate-status', 'prisma.prisma/prisma-migrate-dev', 'prisma.prisma/prisma-migrate-reset', 'prisma.prisma/prisma-studio', 'prisma.prisma/prisma-platform-login', 'prisma.prisma/prisma-postgres-create-database', 'vscjava.migrate-java-to-azure/appmod-install-appcat', 'vscjava.migrate-java-to-azure/appmod-precheck-assessment', 'vscjava.migrate-java-to-azure/appmod-run-assessment', 'vscjava.migrate-java-to-azure/appmod-get-vscode-config', 'vscjava.migrate-java-to-azure/appmod-preview-markdown', 'vscjava.migrate-java-to-azure/migration_assessmentReport', 'vscjava.migrate-java-to-azure/uploadAssessSummaryReport', 'vscjava.migrate-java-to-azure/appmod-search-knowledgebase', 'vscjava.migrate-java-to-azure/appmod-search-file', 'vscjava.migrate-java-to-azure/appmod-fetch-knowledgebase', 'vscjava.migrate-java-to-azure/appmod-create-migration-summary', 'vscjava.migrate-java-to-azure/appmod-run-task', 'vscjava.migrate-java-to-azure/appmod-consistency-validation', 'vscjava.migrate-java-to-azure/appmod-completeness-validation', 'vscjava.migrate-java-to-azure/appmod-version-control', 'vscjava.vscode-java-upgrade/list_jdks', 'vscjava.vscode-java-upgrade/list_mavens', 'vscjava.vscode-java-upgrade/install_jdk', 'vscjava.vscode-java-upgrade/install_maven']
---
respect the clean code approch
apply SOLID principe , KISS ...etc
write md docs in docs folder in the root 
use pnpm as package manager 


# api
- always use prisma as ORM
- use services / controllers structure
- use DTOs to validate the data
- use repository pattern to interact with the database
- use middlewares for auth and validation
- use passport js for auth
- use JWT for token management
- use express as framework
- use eslint and prettier for code formatting
- use swagger for API documentation
- use environment variables for configuration
- handle errors gracefully and return meaningful error messages
- log important events and errors using a logging library like Winston or Morgan

# frontend
- always use frensh label text
- when add new feature should be in the features folder , each feature should have its own folder with a clear structure 
- always use hooks by react query to interact with api dont create
- before each new components verify if already exis the same 
- use much possible shared components 
- the chatrt of the app is orange / black 
- when display list use tow mode  : data table by react tabel with pagination / card view 
- akways use  Heading1, Body, BodySmall, Caption from "@repo/ui" when display text
- Maximize clarity and reduce cognitive load.
- Make every action obvious, fast, and error-proof.
- Follow proven UX laws: Fitts, Hick, Miller, Gestalt, Jakob’s Law, and Nielsen heuristics.

# UX Guidelines

- Typography sizes

- Spacing rules

 -Button hierarchy (primary/secondary/ghost)

 - Error states & validations

- Loading & empty states

# Microcopy

- Provide helpful, human, simple microcopy:

- Labels

- Placeholder text

- Tooltips

- Error messages

- Onboarding guidance