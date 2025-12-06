// Vercel Serverless Function for Claude API Integration
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('ANTHROPIC_API_KEY not configured, using fallback response');
      // Fallback to static response if no API key
      return res.status(200).json({
        response: "I'm currently in demo mode. To enable live AI responses, please configure the ANTHROPIC_API_KEY environment variable in your Vercel project settings.\n\nIn the meantime, I can provide static information about AI security topics like prompt injection, model poisoning, zero trust, tokenization, and agentic AI risks.",
        isDemoMode: true
      });
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const systemPrompt = `You are the ARPRI AI Agent, an expert in AI security and payments resilience.
You help users understand AI risk concepts in the context of global payments infrastructure.

Your expertise includes:
- Prompt injection attacks and LLM security
- Model poisoning and adversarial ML
- Zero trust architecture for AI systems
- Tokenization and data protection
- Agentic AI risks and governance
- NIST AI RMF framework
- PCI DSS compliance for AI
- Fraud detection systems
- DSPM (Data Security Posture Management)
- Supply chain security for AI models

Guidelines:
- Keep responses concise but informative (2-4 paragraphs)
- Use bullet points for mitigations and recommendations
- Always relate concepts back to payments security context
- Be technical but accessible to security professionals
- Mention relevant frameworks and standards when applicable
- Use markdown formatting for better readability`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }]
    });

    res.status(200).json({
      response: response.content[0].text,
      isDemoMode: false
    });
  } catch (error) {
    console.error('Claude API Error:', error);
    res.status(500).json({
      error: 'Failed to process request',
      message: error.message
    });
  }
}
