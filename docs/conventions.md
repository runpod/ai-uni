- we are creating educational resources for developers, so that they can get started when using ai
  for their projects
- we focus on RunPod as their platform of choice and use the services of partner companies when
  complementary to our use case
- we guide the user in every step
- we make sure to provide an easy to use way to deploy resources on RunPod alongside a written
  tutorial, so that users can choose both based on their desired technical complexity

## Voice and Perspective

- We write from RunPod's perspective (first-person "we/our/us"), not as a third party talking about
  RunPod
- Use a friendly, conversational tone that guides users through each step
- Avoid phrases like "RunPod's services" or "their platform" - instead use "our services" or "our
  platform"
- Address the user directly with "you/your" to create a personal connection

## Link Styling and Integration

- Integrate links naturally within sentences as actions rather than destinations
- Example: Write "**Sign up** for an account" instead of "Visit **RunPod Sign Up** to create an
  account"
- Use the primary color, medium font weight, and underline for links to make them clearly
  identifiable
- Reserve Button components for primary actions and navigation between pages

## Component Design Patterns

### API Routes for External Service Integration

- Use Next.js API routes to communicate with external services like RunPod REST API
- Never call external APIs directly from frontend components due to CORS restrictions
- Proxy API requests through server-side API routes to handle authentication and avoid exposing API
  keys
- Store API keys and sensitive configuration in environment variables, not in client-side code
- Return standardized response formats from API routes for consistent error handling

### Reusable Navigation Components

- Create dedicated navigation components for consistent UI patterns across pages
- Use props to configure navigation elements (text, links, styling)
- Support conditional rendering based on component state
- Implement consistent sizing and spacing to prevent layout shifts

### Task Completion Flow

- Use a consistent pattern for task completion across the application
- Implement state checking with intervals rather than subscriptions for more reliable updates
- Ensure visual feedback is consistent between states to prevent layout shifts
- Use conditional styling rather than conditional rendering when possible to maintain layout
  stability

## UI/UX Best Practices

### Button States and Transitions

- Maintain consistent button dimensions across all states to prevent layout shifts
- Use fixed height and padding classes (e.g., h-14, px-6) for buttons that change appearance
- Apply visual enhancements (gradients, animations) conditionally while preserving structure
- Position labels consistently to maintain visual hierarchy

### Visual Feedback

- Use subtle animations to draw attention to important actions
- Ensure animations don't cause layout shifts or performance issues
- Implement animations with CSS keyframes and apply them conditionally
- Contain animation styles within their respective components

## State Management

### Achievement and Task Completion

- Check completion status after component mounts to avoid hydration mismatches
- Use intervals to periodically check state changes (e.g., every 500ms) rather than subscriptions
- Implement proper cleanup of intervals in useEffect return functions
- Access store state directly via getState() for interval checks to ensure fresh data

## Hydration Strategy

### Client Components

- Use "use client" directive for components that require client-side interactivity
- Implement proper hydration checks with isMounted state
- Avoid rendering different content on server vs. client to prevent hydration mismatches
- Use conditional styling rather than conditional rendering when possible
