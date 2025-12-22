# Getting Started with Vercel Web Analytics

This guide will help you get started with using Vercel Web Analytics on your project, showing you how to enable it, add the package to your project, deploy your app to Vercel, and view your data in the dashboard.

## Prerequisites

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. If you don't have it, you can install it using the following command:

```bash
npm i -g vercel
```

Or with your preferred package manager:

```bash
# Using pnpm
pnpm i -g vercel

# Using yarn
yarn global add vercel

# Using bun
bun install -g vercel
```

## Enable Web Analytics in Vercel

On the [Vercel dashboard](/dashboard), select your Project and then click the **Analytics** tab and click **Enable** from the dialog.

> **💡 Note:** Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment.

## Implementation for Plain HTML

For the SPARKLE simulation project, which uses plain HTML/CSS/JavaScript, follow these steps:

### Step 1: Add the Analytics Script

Add the following script tags to your `index.html` file, preferably in the `<head>` section:

```html
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

This has already been added to the index.html file in the project.

### Step 2: Deploy Your App to Vercel

Deploy your app using the Vercel CLI:

```bash
vercel deploy
```

If you haven't already, we recommend [connecting your project's Git repository](https://docs.vercel.com/git/connecting-a-repository), which will enable Vercel to deploy your latest commits to main without terminal commands.

Once your app is deployed, it will start tracking visitors and page views.

> **💡 Note:** If everything is set up properly, you should be able to see a Fetch/XHR request in your browser's Network tab from `/_vercel/insights/view` when you visit any page.

### Step 3: View Your Data in the Dashboard

Once your app is deployed and users have visited your site, you can view your data in the dashboard.

To do so, go to your [dashboard](https://vercel.com/dashboard), select your project, and click the **Analytics** tab.

After a few days of visitors, you'll be able to start exploring your data by viewing and filtering the panels.

## Important Notes

**No package installation needed:** When using the HTML implementation, there is no need to install the `@vercel/analytics` package. However, there is no route support.

The analytics script will automatically:
- Track page views
- Monitor web performance metrics
- Track user interactions

## Troubleshooting

If you don't see data appearing in your dashboard:

1. Ensure the script tags are properly added to your HTML file
2. Verify that your site is deployed to Vercel (not running locally)
3. Check the Network tab in your browser's Developer Tools for requests to `/_vercel/insights/view`
4. Ensure at least a few hours have passed since deployment for data to appear in the dashboard
5. Check the Vercel documentation: [Troubleshooting](https://vercel.com/docs/analytics/troubleshooting)

## Learn More

Now that you have Vercel Web Analytics set up, you can explore the following topics:

- [Learn how to use the Web Analytics dashboard](https://vercel.com/docs/analytics/package)
- [Learn about filtering data](https://vercel.com/docs/analytics/filtering)
- [Read about privacy and compliance](https://vercel.com/docs/analytics/privacy-policy)
- [Explore pricing and limits](https://vercel.com/docs/analytics/limits-and-pricing)
