# Portfolio AI Agent System

A multi-agent orchestration system for automated portfolio management using GitHub Actions.

## Overview

This system uses four specialized AI agents that work together to maintain, improve, and quality-check Ahmed Saeed's portfolio. Each agent has a distinct role and can run independently or as a coordinated team.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  GitHub Actions Workflow                │
│              (portfolio-ai-agent.yml)                   │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ Content Agent │  │ Design Agent  │  │  SEO Agent    │
└───────────────┘  └───────────────┘  └───────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                  ┌───────────────┐
                  │ Review Agent  │
                  └───────────────┘
```

## Agent Roles

### 1. Content Agent

**Purpose:** Updates and manages portfolio content

**Responsibilities:**
- Update project descriptions and details
- Add new portfolio items
- Refresh content copy and messaging
- Update skills and experience sections
- Maintain accurate contact information
- Manage blog posts or articles

**Trigger:** `agent: content` or `agent: all`

**Example Topic:** "Add new machine learning project to portfolio"

---

### 2. Design Agent

**Purpose:** Improves visual design and user experience

**Responsibilities:**
- Enhance CSS styles and animations
- Optimize color schemes and typography
- Improve responsive design breakpoints
- Add micro-interactions and transitions
- Optimize visual hierarchy
- Update iconography and imagery
- Improve accessibility visuals

**Trigger:** `agent: design` or `agent: all`

**Example Topic:** "Modernize the hero section with new animations"

---

### 3. SEO Agent

**Purpose:** Optimizes portfolio for search engine visibility

**Responsibilities:**
- Optimize meta titles and descriptions
- Improve heading structure (H1-H6 hierarchy)
- Add structured data (JSON-LD)
- Optimize images with alt attributes
- Improve page load performance
- Add Open Graph tags for social sharing
- Generate/verify sitemap.xml
- Optimize for Core Web Vitals
- Add canonical URLs

**Trigger:** `agent: seo` or `agent: all`

**Example Topic:** "Improve SEO for 'Ahmed Saeed software engineer' keywords"

---

### 4. Review Agent

**Purpose:** Quality assurance and consistency checks

**Responsibilities:**
- Validate HTML/CSS/JS syntax
- Check accessibility (WCAG guidelines)
- Verify responsive design across viewports
- Detect broken links or missing resources
- Review content accuracy and grammar
- Ensure brand consistency
- Check mobile experience
- Verify performance metrics

**Trigger:** `agent: review` or `agent: all`

**Example Topic:** "Full audit of portfolio accessibility"

---

## Usage

### Triggering via GitHub Actions UI

1. Navigate to the repository on GitHub
2. Go to **Actions** tab
3. Select **Portfolio AI Agent Orchestration** workflow
4. Click **Run workflow**
5. Choose agent: `all`, `content`, `design`, `seo`, or `review`
6. Enter a topic describing your update request
7. Click **Run**

### Triggering via GitHub CLI

```bash
# Run all agents
gh workflow run portfolio-ai-agent.yml -f agent=all -f topic="quarterly portfolio refresh"

# Run specific agent
gh workflow run portfolio-ai-agent.yml -f agent=content -f topic="add new project"
```

### Triggering via API

```bash
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/ahmedsaeedq11-arch/formal-portfolio/actions/workflows/portfolio-ai-agent.yml/dispatches \
  -d '{"ref":"main","inputs":{"agent":"all","topic":"portfolio update"}}'
```

## Workflow Configuration

### Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `agent` | Yes | `all` | Agent to run: `all`, `content`, `design`, `seo`, or `review` |
| `topic` | No | `portfolio review and update` | Description of the update task |

### Permissions

- `contents: write` - Required for committing changes
- `pull-requests: write` - For creating pull requests
- `issues: write` - For filing issues on problems found

## Automated Triggers

The workflow can also be scheduled or triggered by:

```yaml
on:
  schedule:
    - cron: '0 2 * * 0'  # Weekly on Sundays at 2 AM UTC
  
  push:
    branches: [main]
  
  pull_request:
    types: [closed]
```

## Example Workflow Runs

### Single Agent: Content Only
```
Agent: content
Topic: "Update project descriptions with recent achievements"
```
**Result:** Only Content Agent runs, updates project files, commits changes.

### Multi-Agent: Design + Review
```
Agent: design
Topic: "Refresh the contact form styling"
```
**Result:** Design Agent improves visuals, Review Agent validates changes.

### Full Orchestration
```
Agent: all
Topic: "Complete portfolio refresh for job search"
```
**Result:** All four agents run sequentially, with Review Agent providing final validation.

## Integration with External AI

To enhance these agents with actual AI capabilities, integrate an AI provider:

```yaml
- name: Run AI Content Agent
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  run: |
    # Call your AI API here
    response=$(curl -s -X POST https://api.openai.com/v1/chat/completions \
      -H "Authorization: Bearer $OPENAI_API_KEY" \
      -d '{
        "model": "gpt-4",
        "messages": [{
          "role": "system",
          "content": "You are the Content Agent for Ahmed Saeed portfolio..."
        }, {
          "role": "user", 
          "content": "Task: '"${{ github.event.inputs.topic }}"'"
        }]
      }')
```

## Best Practices

1. **Start with Review Agent** - Run review first to understand current state
2. **Use specific topics** - More detail yields better results
3. **Check commits** - Review AI-generated changes before merging
4. **Run regularly** - Schedule weekly runs for portfolio maintenance
5. **Test locally** - Preview changes locally before committing

## Troubleshooting

### Agent fails to push
- Ensure GitHub Actions has write permissions to main branch
- Check if branch protection is enabled

### No changes detected
- The topic may not match any files the agent manages
- Try more specific instructions

### Rate limiting
- If using external AI APIs, add retry logic
- Consider caching responses for repeated tasks

## Maintenance

Regular maintenance tasks:
- Review agent commit history monthly
- Update agent prompts as portfolio evolves
- Add new agents as needs grow
- Monitor GitHub Actions minutes usage

---

Built with GitHub Actions • For Ahmed Saeed's Portfolio
