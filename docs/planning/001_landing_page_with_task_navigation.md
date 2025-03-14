# User Story: Landing Page with Learning Path Navigation

## Overview

Create a minimal, accessible landing page for ai-uni that presents different learning paths/modules in an intuitive interface. The landing page will serve as the central hub for all educational resources and guide users through their learning journey.

## User Requirements

- As a developer learning AI, I want to see all available learning modules so I can plan my learning path
- As a user, I want to understand dependencies between tasks so I know what prerequisites I need to complete
- As a user, I want to toggle between light and dark mode based on my preference
- As a user, I want a clean, intuitive UI that makes navigation straightforward

## Technical Requirements

- Create a responsive landing page that displays all learning modules
- Implement a system to show dependencies between modules (e.g., module 1 must be completed before module 2)
- Add dark/light mode toggle with system preference as default
- Design with accessibility in mind using semantic HTML and proper ARIA attributes
- Use Next.js App Router for the main application structure
- Implement with React Server Components where possible
- Style with Tailwind CSS following the project conventions

## Learning Modules to Include

1. **Getting Started with RunPod**

   - Creating a RunPod account
   - Setting up an API key on RunPod
   - Configuring the API key in ai-uni

2. **Deploying an LLM as API**

   - Setting up vLLM as a serverless endpoint
   - Configuring the deployment
   - Testing the deployment

3. **Interacting with LLM API**
   - Making requests to the LLM API
   - Streaming text responses
   - Handling different response formats

## Terminology

In the context of a learning platform like ai-uni, the most appropriate term for the learning units would be "Modules" or "Labs" - both terms align well with educational terminology while conveying the practical, hands-on nature of the content.

## UI Components

- Header with project name and theme toggle
- Card-based module display with clear titles and descriptions
- Visual indicators for module prerequisites and dependencies
- Progress tracking indicators (future enhancement)
- Clean, minimal design following project conventions

## Acceptance Criteria

- Landing page displays all three initial learning modules
- Dependencies between modules are clearly indicated
- Dark/light mode toggle works correctly and defaults to system preference
- UI is responsive across desktop and mobile devices
- All components follow accessibility best practices
