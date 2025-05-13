# MBTA Transit Benefit Calculator

A modern, interactive calculator to help MBTA riders determine whether a monthly pass or pay-per-ride option is more cost-effective. Takes into account employer subsidies, pre-tax benefits, and various transit modes.

## Features

- Support for all MBTA transit modes:
  - Subway and Bus
  - Commuter Rail (all zones)
  - Ferry routes
- 60% employer subsidy calculations
- Pre-tax savings based on tax bracket
- Subway connection calculations for commuter rail and ferry
- Real-time cost comparisons
- Clear recommendations

## Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mbta-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Deployment Options

### 1. Deploy with Vercel (Recommended)

The easiest way to deploy this application is using Vercel:

1. Create a [Vercel account](https://vercel.com/signup) if you don't have one
2. Install the Vercel CLI:
```bash
npm install -g vercel
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts to deploy your application

### 2. Deploy to GitHub Pages

1. Update the `vite.config.ts` file with your base URL:
```ts
export default defineConfig({
  base: '/your-repo-name/',
  // ... other config
})
```

2. Create a deployment script:
```bash
npm run build
git add dist -f
git commit -m "Deploy to gh-pages"
git subtree push --prefix dist origin gh-pages
```

### 3. Deploy to Netlify

1. Create a [Netlify account](https://app.netlify.com/signup)
2. Connect your repository
3. Set build command to: `npm run build`
4. Set publish directory to: `dist`

## Environment Variables

No environment variables are required for this application.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

MIT

## Acknowledgments

- MBTA for providing clear fare information
- React and Vite for the development framework
- Tailwind CSS for styling 