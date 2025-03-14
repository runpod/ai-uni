# setup-llm

this tutorial shows you how to set up vllm as a serverless endpoint on runpod using the rest api.

> [!NOTE]  
> vllm is a high-performance serving system for llms, offering faster inference than traditional methods.

## what you'll learn

- setting up a runpod account and creating an api key
- configuring a vllm serverless endpoint
- connecting to your endpoint using the runpod rest api
- testing your setup with sample requests

## prerequisites

- a runpod account (sign up at https://runpod.io)
- basic knowledge of apis and json
- node.js and npm installed on your machine

> [!IMPORTANT]  
> you will need a gpu to run most llms. runpod provides access to gpus in the cloud.

## step-by-step guide

### 1. create a runpod account

sign up for runpod and create an api key from your account settings.

### 2. set up a vllm serverless endpoint

this section is under development and will include:

- selecting the right gpu for your needs
- choosing a model (qwq-32b, qwen-2.5-7b-instruct, etc.)
- configuring your endpoint for optimal performance
- deployment steps

### 3. connect via the rest api

learn how to use the runpod rest api to:

- authenticate requests
- send inference requests
- handle streaming responses

> [!TIP]
> check the `stream-text` tutorial for examples of how to consume streaming responses from your endpoint.

## example code

coming soon!

> [!CAUTION]
> running large language models can incur costs. monitor your usage on runpod to avoid unexpected charges.
