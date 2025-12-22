# SPARKLE Simulation

Advanced Component Simulation software designed for electronic circuit design and testing.

## Features
- **Real-time Simulation**: Test logic gates, passive components, and sensors instantly.
- **Improved Search**: Real-time component search with relevance prioritization (starts-with matches).
- **Export to Image**: Download your circuit designs as high-quality PNG images.
- **Component Library**: Includes a wide range of components like logic gates, Bourns Trimpots, RGB LEDs, and more.
- **Undo/Redo Support**: Full history tracking for circuit and wire placement.

## Technologies Used
- HTML5
- CSS3 (Glassmorphism UI)
- Vanilla JavaScript
- Canvas API
- html2canvas (for image export)
- SheetJS (for data export)

## How to Run
Simply open `index.html` in any modern web browser.

## Deployment to Vercel

This project is configured to be deployed on Vercel. The project includes Vercel Web Analytics integration for tracking user engagement and performance metrics.

### Prerequisites
- A Vercel account ([sign up free](https://vercel.com/signup))
- Vercel CLI installed (`npm i -g vercel`)

### Deploy
```bash
vercel deploy
```

### Analytics
Vercel Web Analytics has been integrated into the application. Once deployed to Vercel:

1. Go to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your SPARKLE project
3. Click the **Analytics** tab to view usage data

The analytics script automatically tracks:
- Page views and user sessions
- Web performance metrics
- User interaction patterns

For detailed setup instructions, see [VERCEL_ANALYTICS_SETUP.md](./VERCEL_ANALYTICS_SETUP.md).
