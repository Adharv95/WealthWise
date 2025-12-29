
# 🏦 WealthWise - AI Financial Architect

WealthWise is a high-performance, AI-driven financial audit platform. This repository contains the production-grade frontend and Gemini 3 Pro integration.

## 🚀 Quick Start (Local)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🌐 Production Deployment

### Option 1: Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. In the **Environment Variables** section, add:
   - Key: `API_KEY`
   - Value: `[Your Gemini API Key]`
4. Click **Deploy**.

### Option 2: Netlify
1. Connect your repository to Netlify.
2. Set the build command to `npm run build` and the publish directory to `dist`.
3. Add the `API_KEY` under **Site Settings > Environment Variables**.
4. Deploy the site.

## 🛠 Tech Stack
- **Engine**: Google Gemini 3 Pro (with Thinking Mode)
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS (Fintech Design System)
- **Visuals**: Recharts (Customized Tooltips)
- **Icons**: Lucide React

## 🔒 Security Note
In a live production fintech environment, we recommend wrapping the `geminiService` calls in a backend proxy (Node.js/Python) to ensure the `API_KEY` is never exposed to the client-side bundle.
