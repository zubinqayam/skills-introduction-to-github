# GitHub Skills Exercise Review: Introduction to GitHub

## Overview
This repository contains an interactive GitHub Skills exercise designed to introduce users to fundamental GitHub concepts and workflows.

## Exercise Structure

### Learning Objectives
The exercise guides learners through:
1. **Creating a branch** - Understanding parallel development
2. **Committing a file** - Making and recording changes
3. **Opening a pull request** - Proposing changes for review
4. **Merging a pull request** - Incorporating changes into the main branch

### Exercise Steps

#### Step 1: Create a branch
- **Branch name**: `my-first-branch`
- **Learning goal**: Understand branches as parallel versions of the repository
- **Trigger**: Branch creation detected via GitHub Actions workflow

#### Step 2: Commit a file
- **File**: `PROFILE.md` with content "Welcome to my GitHub profile!"
- **Learning goal**: Learn about commits and version control
- **Trigger**: Push to `my-first-branch` with `PROFILE.md` changes

#### Step 3: Open a pull request
- **Requirements**:
  - Title must contain: "Add my first file"
  - Non-empty description required
  - Base: `main`, Compare: `my-first-branch`
- **Learning goal**: Understand collaboration through pull requests
- **Trigger**: Pull request opened/edited targeting main branch

#### Step 4: Merge your pull request
- **Learning goal**: Complete the workflow by merging changes
- **Trigger**: Pull request merged into main

## Technical Implementation

### Automation
The exercise uses GitHub Actions workflows (`./github/workflows/`) to:
- Detect learner progress
- Post instructional comments on the exercise issue
- Enable/disable workflows as steps complete
- Validate step completion criteria

### Step Content
Markdown files in `./.github/steps/` contain:
- Educational content about GitHub concepts
- Step-by-step instructions with screenshots
- Troubleshooting tips

### Workflow Permissions
Workflows require:
- `contents: write` - Update README
- `actions: write` - Enable/disable workflows
- `issues: write` - Post comments and updates

## Exercise Flow
1. Initial workflow creates exercise issue
2. Learner follows instructions in issue comments
3. Actions detect progress and post next steps
4. Exercise progresses through all 4 steps
5. Completion message and next steps provided

## Key Features
- **Self-paced**: Learners control the timing
- **Interactive feedback**: Automated responses guide progress
- **Visual aids**: Screenshots help learners navigate GitHub UI
- **Troubleshooting**: Built-in help sections for common issues

## Status
✅ Exercise configuration is complete and ready for learners
✅ All workflow files properly configured
✅ Step content files present and comprehensive
✅ Review completion file (x-review.md) included
